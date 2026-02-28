import { RowDataPacket } from "mysql2";
import { ensureAdminTables, getMysqlPool } from "@/lib/mysql";

interface PublicProjectRow extends RowDataPacket {
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
    category: "project" | "personal-project";
    issued_month: number | null;
    issued_year: number | null;
    updated_at: Date | string;
    created_at: Date | string;
}

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

const normalizeTags = (row: PublicProjectRow) => {
    const tags = parseTags(row.tags);
    if (row.category === "personal-project" && !tags.some((tag) => /personal/i.test(tag))) {
        return [...tags, "personal"];
    }
    return tags;
};

const pickLocalizedText = (primary: string | null, english: string | null, language: "id" | "en") => {
    if (language === "en") {
        return english || primary || "";
    }
    return primary || "";
};

const mapPortfolioProject = (row: PublicProjectRow, language: "id" | "en") => ({
    _id: `mysql-${row.id}`,
    _createdAt: new Date(row.created_at).toISOString(),
    title: pickLocalizedText(row.title, row.title_en, language),
    shortDescription: pickLocalizedText(row.short_description, row.short_description_en, language),
    description: pickLocalizedText(row.description, row.description_en, language),
    image: row.image_url || null,
    logo: row.logo_url || null,
    link: row.project_url || "",
    githubLink: row.github_url || "",
    tags: normalizeTags(row),
    slug: {
        current: row.slug,
    },
    issuedMonth: row.issued_month ?? undefined,
    issuedYear: row.issued_year ?? undefined,
});

const mapProjectDetail = (row: PublicProjectRow) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description || "",
    description: row.description || "",
    imageUrl: row.image_url || "",
    projectUrl: row.project_url || "",
    githubUrl: row.github_url || "",
    tags: normalizeTags(row),
    updatedAt: new Date(row.updated_at).toISOString(),
});

async function fetchPublishedRows() {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [rows] = await pool.query<PublicProjectRow[]>(`
        SELECT *
        FROM admin_projects
        WHERE is_published = 1
        ORDER BY created_at DESC
    `);
    return rows;
}

export async function listPublishedProjectsForPortfolio(language: "id" | "en" = "id") {
    const rows = await fetchPublishedRows();
    return rows.map((row) => mapPortfolioProject(row, language));
}

export async function listPublishedProjectSlugs() {
    const rows = await fetchPublishedRows();
    return rows.map((row) => ({
        slug: row.slug,
        updatedAt: new Date(row.updated_at).toISOString(),
    }));
}

export async function getPublishedProjectDetailBySlug(slug: string) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [rows] = await pool.query<PublicProjectRow[]>(
        `
            SELECT *
            FROM admin_projects
            WHERE slug = ? AND is_published = 1
            LIMIT 1
        `,
        [slug]
    );

    if (rows.length === 0) {
        return null;
    }

    return mapProjectDetail(rows[0]);
}
