import { NextRequest } from "next/server";
import { createClient } from "next-sanity";
import crypto from "node:crypto";
import { getServerSecret } from "@/app/lib/serverSecret";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

const TRANSABLE_TYPES = new Set([
  "sidebarProfile",
  "homeProfile",
  "aboutProfile",
  "homeContent",
  "aboutContent",
  "careerContent",
  "achievementContent",
  "projectContent",
  "personalProjectContent",
  "contactContent",
  "education",
  "job",
  "project",
  "contact",
  "github",
]);

const NON_TRANSLATABLE_KEY_PATTERN =
  /^(?:_id|_type|_rev|_createdAt|_updatedAt|language|slug|profileImage|image|logo|link|githubLink|url|email|whatsapp|linkedin|instagram|tiktok|github|tags|startDate|endDate)$/i;

function getSanityWriteClient() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-12",
    token: getServerSecret("SANITY_API_WRITE_TOKEN"),
    useCdn: false,
  });
}

const hashText = (text: string, targetLang: string) =>
  crypto.createHash("sha256").update(`${targetLang}:${text}`).digest("hex");

async function translateWithGoogle(sourceText: string, targetLang: "en", sourceLang: "id") {
  const apiKey = getServerSecret("GOOGLE_TRANSLATE_API_KEY");
  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured");
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: sourceText,
      source: sourceLang,
      target: targetLang,
      format: "text",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Translate API error: ${response.status} ${body}`);
  }

  const json = (await response.json()) as {
    data?: {
      translations?: Array<{ translatedText?: string }>;
    };
  };

  const translated = json.data?.translations?.[0]?.translatedText?.trim();
  if (!translated) {
    throw new Error("Google Translate API returned empty translation");
  }

  return translated;
}

async function translateWithGemini(sourceText: string, targetLang: "en", sourceLang: "id") {
  const apiKey = getServerSecret("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const modelCandidates = [
    process.env.GEMINI_MODEL,
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
  ].filter(Boolean) as string[];

  const prompt = [
    `Translate the following ${sourceLang.toUpperCase()} text into ${targetLang.toUpperCase()}.`,
    "Return only the translation text without quotes or explanations.",
    sourceText,
  ].join("\n\n");

  let lastError = "Gemini translation failed";

  for (const model of modelCandidates) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.9,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      lastError = `Gemini API error (${model}): ${response.status} ${body}`;

      if (response.status === 404) {
        continue;
      }

      throw new Error(lastError);
    }

    const json = (await response.json()) as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const translated = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (translated) {
      return translated;
    }
  }

  throw new Error(lastError);
}

async function translateText(sourceText: string, targetLang: "en", sourceLang: "id") {
  const googleKey = getServerSecret("GOOGLE_TRANSLATE_API_KEY");
  const geminiKey = getServerSecret("GEMINI_API_KEY");

  if (!googleKey && !geminiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY or GEMINI_API_KEY must be configured");
  }

  if (googleKey) {
    try {
      return await translateWithGoogle(sourceText, targetLang, sourceLang);
    } catch (error) {
      if (!geminiKey) {
        throw error;
      }
      console.warn("[translate-to-en] Google translate failed, falling back to Gemini", error);
    }
  }

  return translateWithGemini(sourceText, targetLang, sourceLang);
}

async function translateTextWithCache(client: ReturnType<typeof getSanityWriteClient>, sourceText: string) {
  const normalized = sourceText.trim();
  if (!normalized) return sourceText;

  const hash = hashText(normalized, "en");
  const cacheDocId = `translation-cache-${hash}`;

  const cached = await client.fetch(
    `*[_type == "translationCache" && hash == $hash][0]{ translatedText }`,
    { hash }
  ) as { translatedText?: string } | null;

  if (cached?.translatedText) {
    return cached.translatedText;
  }

  const translatedText = await translateText(normalized, "en", "id");

  await client.createOrReplace({
    _id: cacheDocId,
    _type: "translationCache",
    hash,
    sourceText: normalized,
    targetLang: "en",
    translatedText,
    provider: "google",
    updatedAt: new Date().toISOString(),
  });

  return translatedText;
}

async function translateValue(
  client: ReturnType<typeof getSanityWriteClient>,
  value: JsonValue,
  keyName?: string
): Promise<JsonValue> {
  if (typeof value === "string") {
    if (keyName && NON_TRANSLATABLE_KEY_PATTERN.test(keyName)) {
      return value;
    }
    return translateTextWithCache(client, value);
  }

  if (Array.isArray(value)) {
    const translatedArray = await Promise.all(value.map((item) => translateValue(client, item, keyName)));
    return translatedArray;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as JsonObject);
    const translatedEntries = await Promise.all(
      entries.map(async ([entryKey, entryValue]) => {
        if (entryKey.startsWith("_")) {
          return [entryKey, entryValue] as const;
        }
        const translated = await translateValue(client, entryValue, entryKey);
        return [entryKey, translated] as const;
      })
    );

    return Object.fromEntries(translatedEntries) as JsonObject;
  }

  return value;
}

function toTargetDocumentId(sourceId: string) {
  if (sourceId.endsWith("-id")) {
    return `${sourceId.slice(0, -3)}-en`;
  }
  if (sourceId.endsWith("-main")) {
    return `${sourceId.slice(0, -5)}-en`;
  }
  return `${sourceId}-en`;
}

export async function POST(req: NextRequest) {
  try {
    const writeToken = getServerSecret("SANITY_API_WRITE_TOKEN");
    if (!writeToken) {
      return Response.json({ error: "SANITY_API_WRITE_TOKEN is not configured" }, { status: 500 });
    }

    const body = (await req.json()) as {
      id?: string;
      type?: string;
      document?: JsonObject;
    };

    const sourceId = body.id || "";
    const schemaType = body.type || "";
    const sourceDocument = body.document;

    if (!sourceId || !schemaType || !sourceDocument) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (!TRANSABLE_TYPES.has(schemaType)) {
      return Response.json({ error: "Schema type is not enabled for translation" }, { status: 400 });
    }

    const client = getSanityWriteClient();

    const translatedPayload = await translateValue(client, sourceDocument) as JsonObject;
    const targetId = toTargetDocumentId(sourceId);

    const cleanPayload = Object.fromEntries(
      Object.entries(translatedPayload).filter(([key]) =>
        !["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(key)
      )
    );

    await client.createOrReplace({
      _id: targetId,
      _type: schemaType,
      ...cleanPayload,
      language: "en",
    });

    return Response.json({ success: true, targetId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown translation error";
    return Response.json({ error: message }, { status: 500 });
  }
}
