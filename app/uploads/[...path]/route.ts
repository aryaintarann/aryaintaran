import { NextRequest } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export async function GET(
    request: NextRequest,
    context: { params: Record<string, string | string[]> }
) {
    const resolvedParams = await Promise.resolve(context.params);
    const pathFragments = resolvedParams.path as string[];

    if (!pathFragments || pathFragments.length === 0) {
        return new Response("Not Found", { status: 404 });
    }

    const relativePath = pathFragments.join("/");

    if (relativePath.includes("..") || relativePath.startsWith("/")) {
        return new Response("Forbidden", { status: 403 });
    }

    const absolutePath = path.join(process.cwd(), "public", "uploads", relativePath);

    try {
        const fileStat = await stat(absolutePath);
        if (!fileStat.isFile()) {
            return new Response("Not Found", { status: 404 });
        }

        const fileBuffer = await readFile(absolutePath);

        let contentType = "application/octet-stream";
        const ext = path.extname(absolutePath).toLowerCase();
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";

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
