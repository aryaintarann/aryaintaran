import { RowDataPacket } from "mysql2";
import { ensureAdminTables, getMysqlPool } from "@/lib/mysql";

export type AdminProjectCategory = "project" | "personal-project";

export interface AdminProjectInput {
    title: string;
    titleEn?: string;
    slug?: string;
    shortDescription?: string;
    shortDescriptionEn?: string;
    description?: string;
    descriptionEn?: string;
    imageUrl?: string;
    logoUrl?: string;
    projectUrl?: string;
    githubUrl?: string;
    tags?: string[];
    category?: AdminProjectCategory;
    isFeatured?: boolean;
    isPublished?: boolean;
    issuedMonth?: number;
    issuedYear?: number;
}

export interface AdminProjectRecord {
    id: number;
    title: string;
    titleEn: string;
    slug: string;
    shortDescription: string;
    shortDescriptionEn: string;
    description: string;
    descriptionEn: string;
    imageUrl: string;
    logoUrl: string;
    projectUrl: string;
    githubUrl: string;
    tags: string[];
    category: AdminProjectCategory;
    isFeatured: boolean;
    isPublished: boolean;
    issuedMonth: number | null;
    issuedYear: number | null;
    createdAt: string;
    updatedAt: string;
}

interface AdminProjectRow extends RowDataPacket {
    id: number;
    title: string;
    title_en: string | null;
    slug: string;
    short_description: string | null;
    short_description_en: string | null;
    description: string | null;
    description_en: string | null;
    image_url: string | null;
    logo_url: string | null;
    project_url: string | null;
    github_url: string | null;
    tags: unknown;
    category: AdminProjectCategory;
    is_featured: 0 | 1;
    is_published: 0 | 1;
    issued_month: number | null;
    issued_year: number | null;
    created_at: Date | string;
    updated_at: Date | string;
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

const normalizeTags = (tags?: string[]) =>
    (tags || [])
        .map((tag) => tag.trim())
        .filter(Boolean);

const parseTags = (raw: unknown) => {
    if (Array.isArray(raw)) {
        return raw.filter((tag): tag is string => typeof tag === "string");
    }

    if (typeof raw === "string") {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.filter((tag): tag is string => typeof tag === "string");
            }
            return [];
        } catch {
            return [];
        }
    }

    return [];
};

const mapRecord = (row: AdminProjectRow): AdminProjectRecord => ({
    id: row.id,
    title: row.title,
    titleEn: row.title_en || "",
    slug: row.slug,
    shortDescription: row.short_description || "",
    shortDescriptionEn: row.short_description_en || "",
    description: row.description || "",
    descriptionEn: row.description_en || "",
    imageUrl: row.image_url || "",
    logoUrl: row.logo_url || "",
    projectUrl: row.project_url || "",
    githubUrl: row.github_url || "",
    tags: parseTags(row.tags),
    category: row.category,
    isFeatured: row.is_featured === 1,
    isPublished: row.is_published === 1,
    issuedMonth: row.issued_month ?? null,
    issuedYear: row.issued_year ?? null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
});

const toSlug = (input: AdminProjectInput) => slugify(input.slug?.trim() || input.title);

function validateInput(input: AdminProjectInput) {
    const title = input.title?.trim();
    if (!title) {
        throw new Error("Title is required");
    }

    const slug = toSlug(input);
    if (!slug) {
        throw new Error("Slug is required");
    }

    const category: AdminProjectCategory = input.category === "personal-project" ? "personal-project" : "project";

    return {
        title,
        titleEn: input.titleEn === undefined ? undefined : input.titleEn.trim(),
        slug,
        shortDescription: input.shortDescription?.trim() || "",
        shortDescriptionEn: input.shortDescriptionEn === undefined ? undefined : input.shortDescriptionEn.trim(),
        description: input.description?.trim() || "",
        descriptionEn: input.descriptionEn === undefined ? undefined : input.descriptionEn.trim(),
        imageUrl: input.imageUrl?.trim() || "",
        logoUrl: input.logoUrl?.trim() || "",
        projectUrl: input.projectUrl?.trim() || "",
        githubUrl: input.githubUrl?.trim() || "",
        tags: normalizeTags(input.tags),
        category,
        isFeatured: Boolean(input.isFeatured),
        isPublished: input.isPublished !== false,
        issuedMonth: input.issuedMonth != null ? Math.max(1, Math.min(12, Math.floor(Number(input.issuedMonth)))) : null,
        issuedYear: input.issuedYear != null ? Math.floor(Number(input.issuedYear)) : null,
    };
}

export async function listAdminProjects() {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [rows] = await pool.query<AdminProjectRow[]>(`
        SELECT *
        FROM admin_projects
        ORDER BY created_at DESC
    `);

    return rows.map(mapRecord);
}

export async function getAdminProjectById(id: number) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [rows] = await pool.query<AdminProjectRow[]>(`
        SELECT *
        FROM admin_projects
        WHERE id = ?
        LIMIT 1
    `, [id]);

    if (rows.length === 0) {
        return null;
    }

    return mapRecord(rows[0]);
}

export async function createAdminProject(input: AdminProjectInput) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const payload = validateInput(input);

    const [result] = await pool.query(
        `
            INSERT INTO admin_projects (
                title,
                title_en,
                slug,
                short_description,
                short_description_en,
                description,
                description_en,
                image_url,
                logo_url,
                project_url,
                github_url,
                tags,
                category,
                is_featured,
                is_published,
                issued_month,
                issued_year
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            payload.title,
            payload.titleEn || null,
            payload.slug,
            payload.shortDescription,
            payload.shortDescriptionEn || null,
            payload.description,
            payload.descriptionEn || null,
            payload.imageUrl,
            payload.logoUrl,
            payload.projectUrl,
            payload.githubUrl,
            JSON.stringify(payload.tags),
            payload.category,
            payload.isFeatured ? 1 : 0,
            payload.isPublished ? 1 : 0,
            payload.issuedMonth,
            payload.issuedYear,
        ]
    );

    const insertedId = Number((result as { insertId?: number }).insertId || 0);
    if (!insertedId) {
        throw new Error("Failed to create project");
    }

    const created = await getAdminProjectById(insertedId);
    if (!created) {
        throw new Error("Failed to load created project");
    }

    return created;
}

export async function updateAdminProject(id: number, input: AdminProjectInput) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const payload = validateInput(input);

    await pool.query(
        `
            UPDATE admin_projects
            SET
                title = ?,
                title_en = COALESCE(?, title_en),
                slug = ?,
                short_description = ?,
                short_description_en = COALESCE(?, short_description_en),
                description = ?,
                description_en = COALESCE(?, description_en),
                image_url = ?,
                logo_url = ?,
                project_url = ?,
                github_url = ?,
                tags = ?,
                category = ?,
                is_featured = ?,
                is_published = ?,
                issued_month = ?,
                issued_year = ?
            WHERE id = ?
        `,
        [
            payload.title,
            payload.titleEn ?? null,
            payload.slug,
            payload.shortDescription,
            payload.shortDescriptionEn ?? null,
            payload.description,
            payload.descriptionEn ?? null,
            payload.imageUrl,
            payload.logoUrl,
            payload.projectUrl,
            payload.githubUrl,
            JSON.stringify(payload.tags),
            payload.category,
            payload.isFeatured ? 1 : 0,
            payload.isPublished ? 1 : 0,
            payload.issuedMonth,
            payload.issuedYear,
            id,
        ]
    );

    const updated = await getAdminProjectById(id);
    if (!updated) {
        throw new Error("Project not found");
    }

    return updated;
}

export async function deleteAdminProject(id: number) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [result] = await pool.query(
        `
            DELETE FROM admin_projects
            WHERE id = ?
        `,
        [id]
    );

    const affectedRows = Number((result as { affectedRows?: number }).affectedRows || 0);
    return affectedRows > 0;
}
