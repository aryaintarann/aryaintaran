import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { RowDataPacket } from "mysql2";
import { ensureAdminTables, getMysqlPool } from "@/lib/mysql";
import { getServerSecret } from "@/app/lib/serverSecret";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type TranslationCacheRow = RowDataPacket & { translated_text?: string };

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
  "educations",
  "job",
  "jobs",
  "project",
  "projects",
  "contact",
  "github",
]);

const NON_TRANSLATABLE_KEY_PATTERN =
  /^(?:_id|_type|_rev|_createdAt|_updatedAt|language|slug|profileImage|image|logo|link|githubLink|url|email|whatsapp|linkedin|instagram|tiktok|github|tags|startDate|endDate)$/i;

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

async function translateTextWithCache(sourceText: string) {
  const normalized = sourceText.trim();
  if (!normalized) return sourceText;

  await ensureAdminTables();
  const pool = getMysqlPool();

  const hash = hashText(normalized, "en");

  const [rows] = await pool.query<TranslationCacheRow[]>(
    `
      SELECT translated_text
      FROM admin_translation_cache
      WHERE hash = ?
      LIMIT 1
    `,
    [hash]
  );

  if (rows.length > 0 && rows[0]?.translated_text) {
    return rows[0].translated_text;
  }

  const translatedText = await translateText(normalized, "en", "id");

  await pool.query(
    `
      INSERT INTO admin_translation_cache (hash, source_text, target_lang, translated_text, provider)
      VALUES (?, ?, 'en', ?, 'google')
      ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text), provider = VALUES(provider)
    `,
    [hash, normalized, translatedText]
  );

  return translatedText;
}

async function translateValue(
  value: JsonValue,
  keyName?: string
): Promise<JsonValue> {
  if (typeof value === "string") {
    if (keyName && NON_TRANSLATABLE_KEY_PATTERN.test(keyName)) {
      return value;
    }
    return translateTextWithCache(value);
  }

  if (Array.isArray(value)) {
    const translatedArray = await Promise.all(value.map((item) => translateValue(item, keyName)));
    return translatedArray;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value as JsonObject);
    const translatedEntries = await Promise.all(
      entries.map(async ([entryKey, entryValue]) => {
        if (entryKey.startsWith("_")) {
          return [entryKey, entryValue] as const;
        }
        const translated = await translateValue(entryValue, entryKey);
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
    const body = (await req.json()) as {
      id?: string;
      type?: string;
      document?: JsonValue;
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

    const translatedPayload = await translateValue(sourceDocument);
    const targetId = toTargetDocumentId(sourceId);

    const stripMetaFields = (value: JsonValue): JsonValue => {
      if (Array.isArray(value)) {
        return value.map((item) => stripMetaFields(item as JsonValue));
      }

      if (value && typeof value === "object") {
        const entries = Object.entries(value as JsonObject).filter(
          ([key]) => !["_id", "_type", "_rev", "_createdAt", "_updatedAt"].includes(key)
        );

        return Object.fromEntries(
          entries.map(([key, val]) => [key, stripMetaFields(val as JsonValue)])
        ) as JsonObject;
      }

      return value;
    };

    const cleanPayload = stripMetaFields(translatedPayload);
    const translatedResult =
      cleanPayload && typeof cleanPayload === "object" && !Array.isArray(cleanPayload)
        ? ({ ...(cleanPayload as JsonObject), language: "en" } as JsonObject)
        : cleanPayload;

    return Response.json({ success: true, targetId, translated: translatedResult });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown translation error";
    return Response.json({ error: message }, { status: 500 });
  }
}
