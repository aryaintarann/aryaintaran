import {
    deleteManagedContent,
    listManagedContent,
    MANAGED_CONTENT_KEYS,
    upsertManagedContent,
    type ContentLanguage,
    type ManagedContentKey,
} from "@/lib/admin-content";
import { requireAdminSession } from "@/lib/require-admin-session";

const managedKeySet = new Set<string>(MANAGED_CONTENT_KEYS);

function parseLanguage(value: string | null): ContentLanguage {
    return value === "en" ? "en" : "id";
}

function parseManagedKey(value: unknown): ManagedContentKey | null {
    if (typeof value !== "string") return null;
    return managedKeySet.has(value) ? (value as ManagedContentKey) : null;
}

export async function GET(request: Request) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const language = parseLanguage(url.searchParams.get("language"));
    const items = await listManagedContent(language);
    return Response.json({ items, keys: MANAGED_CONTENT_KEYS });
}

export async function POST(request: Request) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        language?: ContentLanguage;
        key?: string;
        data?: unknown;
    };

    const language: ContentLanguage = body.language === "en" ? "en" : "id";
    const key = parseManagedKey(body.key);
    if (!key) {
        return Response.json({ error: "Invalid content key" }, { status: 400 });
    }

    await upsertManagedContent(language, key, body.data ?? {});
    return Response.json({ success: true });
}

export async function DELETE(request: Request) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
        language?: ContentLanguage;
        key?: string;
    };

    const language: ContentLanguage = body.language === "en" ? "en" : "id";
    const key = parseManagedKey(body.key);
    if (!key) {
        return Response.json({ error: "Invalid content key" }, { status: 400 });
    }

    const deleted = await deleteManagedContent(language, key);
    return Response.json({ success: deleted });
}
