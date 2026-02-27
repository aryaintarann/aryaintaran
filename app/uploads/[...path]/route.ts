import { NextRequest } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const MIME_BY_EXT: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
};

async function findUploadedFile(relativePath: string): Promise<string | null> {
    const candidates = [
        path.join(process.cwd(), "data", "uploads", relativePath),
        path.join(process.cwd(), "public", "uploads", relativePath),
    ];

    for (const candidate of candidates) {
        try {
            const fileStat = await stat(candidate);
            if (fileStat.isFile()) return candidate;
        } catch {
            /* file not found at this location, try next */
        }
    }

    return null;
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path: pathFragments } = await context.params;

    if (!pathFragments || pathFragments.length === 0) {
        return new Response("Not Found", { status: 404 });
    }

    const relativePath = pathFragments.join("/");

    if (relativePath.includes("..") || relativePath.startsWith("/")) {
        return new Response("Forbidden", { status: 403 });
    }

    const absolutePath = await findUploadedFile(relativePath);

    if (!absolutePath) {
        return new Response("Not Found", { status: 404 });
    }

    try {
        const fileBuffer = await readFile(absolutePath);
        const ext = path.extname(absolutePath).toLowerCase();
        const contentType = MIME_BY_EXT[ext] || "application/octet-stream";

        return new Response(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return new Response("Not Found", { status: 404 });
    }
}
