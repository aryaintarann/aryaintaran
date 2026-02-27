import { RowDataPacket } from "mysql2";
import { ensureAdminTables, getMysqlPool } from "@/lib/mysql";
import type {
    AboutProfileData,
    ContactData,
    EducationData,
    GithubData,
    HomeProfileData,
    JobData,
    SidebarProfileData,
    TranslationText,
} from "@/app/components/tabs/types";

export type ContentLanguage = "id" | "en";

export const MANAGED_CONTENT_KEYS = [
    "homeProfile",
    "aboutProfile",
    "sidebarProfile",
    "education",
    "jobs",
    "contact",
    "github",
    "homeContent",
    "aboutContent",
    "careerContent",
    "achievementContent",
    "projectContent",
    "personalProjectContent",
    "contactContent",
] as const;

export type ManagedContentKey = (typeof MANAGED_CONTENT_KEYS)[number];

interface ContentRow extends RowDataPacket {
    content_key: ManagedContentKey;
    language: ContentLanguage;
    data: unknown;
}

const isManagedKey = (value: string): value is ManagedContentKey =>
    (MANAGED_CONTENT_KEYS as readonly string[]).includes(value);

function parseJsonData<T>(raw: unknown, fallback: T): T {
    if (raw === null || raw === undefined) {
        return fallback;
    }

    if (typeof raw === "string") {
        try {
            return JSON.parse(raw) as T;
        } catch {
            return fallback;
        }
    }

    return raw as T;
}

type ContentBundle = {
    homeProfile: HomeProfileData;
    aboutProfile: AboutProfileData;
    sidebarProfile: SidebarProfileData;
    education: EducationData[];
    jobs: JobData[];
    contact: ContactData;
    github: GithubData;
    homeContent: Partial<TranslationText>;
    aboutContent: Partial<TranslationText>;
    careerContent: Partial<TranslationText>;
    achievementContent: Partial<TranslationText>;
    projectContent: Partial<TranslationText>;
    personalProjectContent: Partial<TranslationText>;
    contactContent: Partial<TranslationText>;
};

const defaultBundle: ContentBundle = {
    homeProfile: {},
    aboutProfile: {},
    sidebarProfile: {},
    education: [],
    jobs: [],
    contact: {},
    github: {},
    homeContent: {},
    aboutContent: {},
    careerContent: {},
    achievementContent: {},
    projectContent: {},
    personalProjectContent: {},
    contactContent: {},
};

export async function listManagedContent(language: ContentLanguage) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [rows] = await pool.query<ContentRow[]>(
        `
            SELECT content_key, language, data
            FROM admin_content
            WHERE language = ?
        `,
        [language]
    );

    return rows
        .filter((row) => isManagedKey(row.content_key))
        .map((row) => ({
            key: row.content_key,
            language: row.language,
            data: parseJsonData<unknown>(row.data, null),
        }));
}

export async function upsertManagedContent(language: ContentLanguage, key: ManagedContentKey, data: unknown) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const payload = JSON.stringify(data ?? {});

    await pool.query(
        `
            INSERT INTO admin_content (content_key, language, data)
            VALUES (?, ?, CAST(? AS JSON))
            ON DUPLICATE KEY UPDATE
                data = VALUES(data)
        `,
        [key, language, payload]
    );
}

export async function deleteManagedContent(language: ContentLanguage, key: ManagedContentKey) {
    await ensureAdminTables();
    const pool = getMysqlPool();
    const [result] = await pool.query(
        `
            DELETE FROM admin_content
            WHERE language = ? AND content_key = ?
        `,
        [language, key]
    );

    return Number((result as { affectedRows?: number }).affectedRows || 0) > 0;
}

export async function getPortfolioContent(language: ContentLanguage): Promise<ContentBundle> {
    const bundle: ContentBundle = { ...defaultBundle };

    try {
        const items = await listManagedContent(language);
        for (const item of items) {
            if (item.key in bundle) {
                (bundle as Record<string, unknown>)[item.key] = item.data;
            }
        }
    } catch (error) {
        console.error("[mysql] getPortfolioContent failed", error);
    }

    const educationItems = Array.isArray(bundle.education) ? bundle.education : [];
    const jobItems = Array.isArray(bundle.jobs) ? bundle.jobs : [];

    const normalizeEducation = educationItems.map((item, index) => ({
        ...item,
        _id: item?._id || `mysql-edu-${index + 1}`,
    }));

    const normalizeJobs = jobItems.map((item, index) => ({
        ...item,
        _id: item?._id || `mysql-job-${index + 1}`,
    }));

    return {
        ...bundle,
        education: normalizeEducation,
        jobs: normalizeJobs,
    };
}
