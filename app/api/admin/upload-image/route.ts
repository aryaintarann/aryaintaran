import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { requireAdminSession } from "@/lib/require-admin-session";

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const UPLOAD_TARGETS = {
    profile: { folder: "profiles", prefix: "profile" },
    education: { folder: "education", prefix: "education" },
    career: { folder: "career", prefix: "career" },
    achievement: { folder: "achievement", prefix: "achievement" },
    "project-image": { folder: "projects", prefix: "project-image" },
    "project-logo": { folder: "projects", prefix: "project-logo" },
} as const;

type UploadTarget = keyof typeof UPLOAD_TARGETS;

function extensionByMime(mime: string) {
    if (mime === "image/jpeg") return ".jpg";
    if (mime === "image/png") return ".png";
    if (mime === "image/webp") return ".webp";
    if (mime === "image/gif") return ".gif";
    return "";
}

export const runtime = "nodejs";

function toLocalUploadedFilePath(previousUrl: string, folder: string) {
    const expectedPrefix = `/uploads/${folder}/`;
    if (!previousUrl.startsWith(expectedPrefix)) {
        return null;
    }

    const normalized = previousUrl.replaceAll("\\", "/");
    if (normalized.includes("..")) {
        return null;
    }

    const fileName = normalized.slice(expectedPrefix.length);
    if (!fileName) {
        return null;
    }

    return path.join(process.cwd(), "public", "uploads", folder, fileName);
}

export async function POST(request: Request) {
    const session = await requireAdminSession();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const previousUrlRaw = formData.get("previousUrl");
    const targetRaw = formData.get("target");
    const previousUrl = typeof previousUrlRaw === "string" ? previousUrlRaw.trim() : "";
    const target =
        typeof targetRaw === "string" && targetRaw in UPLOAD_TARGETS
            ? (targetRaw as UploadTarget)
            : "profile";

    if (!(file instanceof File)) {
        return Response.json({ error: "File is required" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
        return Response.json({ error: "Format gambar tidak didukung" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
        return Response.json({ error: "Ukuran gambar maksimal 3MB" }, { status: 400 });
    }

    const extension = extensionByMime(file.type);
    if (!extension) {
        return Response.json({ error: "Format gambar tidak valid" }, { status: 400 });
    }

    const selectedTarget = UPLOAD_TARGETS[target];
    const fileName = `${selectedTarget.prefix}-${Date.now()}-${crypto.randomUUID()}${extension}`;
    const relativeDir = path.join("uploads", selectedTarget.folder);
    const absoluteDir = path.join(process.cwd(), "public", relativeDir);
    const absolutePath = path.join(absoluteDir, fileName);

    await mkdir(absoluteDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(absolutePath, Buffer.from(bytes));

    if (previousUrl) {
        const oldFilePath = toLocalUploadedFilePath(previousUrl, selectedTarget.folder);
        if (oldFilePath) {
            await unlink(oldFilePath).catch(() => undefined);
        }
    }

    const url = `/${relativeDir.replaceAll("\\", "/")}/${fileName}`;
    return Response.json({ url });
}
