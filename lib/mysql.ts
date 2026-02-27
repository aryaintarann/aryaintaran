import mysql, { type Pool } from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

declare global {
    var __mysqlPool: Pool | undefined;
    var __mysqlInitPromise: Promise<void> | undefined;
}

function getDatabaseUrl() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        throw new Error("DATABASE_URL is not configured");
    }
    return url;
}

export function getMysqlPool() {
    if (!global.__mysqlPool) {
        global.__mysqlPool = mysql.createPool({
            uri: getDatabaseUrl(),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            charset: "utf8mb4",
        });
    }

    return global.__mysqlPool;
}

export async function ensureAdminTables() {
    if (!global.__mysqlInitPromise) {
        const pool = getMysqlPool();
        global.__mysqlInitPromise = (async () => {
            await Promise.all([
                pool.query(`
                    CREATE TABLE IF NOT EXISTS admin_projects (
                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                        title VARCHAR(255) NOT NULL,
                        title_en VARCHAR(255) NULL,
                        slug VARCHAR(255) NOT NULL,
                        short_description TEXT NULL,
                        short_description_en TEXT NULL,
                        description LONGTEXT NULL,
                        description_en LONGTEXT NULL,
                        image_url TEXT NULL,
                        logo_url TEXT NULL,
                        project_url TEXT NULL,
                        github_url TEXT NULL,
                        tags JSON NULL,
                        category ENUM('project','personal-project') NOT NULL DEFAULT 'project',
                        is_featured TINYINT(1) NOT NULL DEFAULT 0,
                        is_published TINYINT(1) NOT NULL DEFAULT 1,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (id),
                        UNIQUE KEY admin_projects_slug_unique (slug)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `),
                pool.query(`
                    CREATE TABLE IF NOT EXISTS admin_content (
                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                        content_key VARCHAR(120) NOT NULL,
                        language ENUM('id','en') NOT NULL DEFAULT 'id',
                        data JSON NOT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (id),
                        UNIQUE KEY admin_content_key_language_unique (content_key, language)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `),
                pool.query(`
                    CREATE TABLE IF NOT EXISTS admin_contact_submissions (
                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                        name VARCHAR(120) NOT NULL,
                        email VARCHAR(160) NOT NULL,
                        message TEXT NOT NULL,
                        language ENUM('id','en') NOT NULL DEFAULT 'id',
                        ip VARCHAR(90) NOT NULL DEFAULT '',
                        user_agent TEXT NULL,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        PRIMARY KEY (id),
                        KEY admin_contact_submissions_created_idx (created_at)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `),
                pool.query(`
                    CREATE TABLE IF NOT EXISTS admin_translation_cache (
                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                        hash VARCHAR(128) NOT NULL,
                        source_text TEXT NOT NULL,
                        target_lang VARCHAR(10) NOT NULL,
                        translated_text TEXT NOT NULL,
                        provider VARCHAR(32) NOT NULL DEFAULT 'google',
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (id),
                        UNIQUE KEY admin_translation_cache_hash_unique (hash)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                `),
            ]);

            const ensureProjectColumn = async (columnName: string, sqlType: string, afterColumn: string) => {
                const [rows] = await pool.query<RowDataPacket[]>(
                    `SHOW COLUMNS FROM admin_projects LIKE ?`,
                    [columnName]
                );

                const hasColumn = rows.some(
                    (row) => typeof (row as Record<string, unknown>).Field === "string"
                );

                if (!hasColumn) {
                    await pool.query(
                        `ALTER TABLE admin_projects ADD COLUMN ${columnName} ${sqlType} NULL AFTER ${afterColumn}`
                    );
                }
            };

            await ensureProjectColumn("title_en", "VARCHAR(255)", "title");
            await ensureProjectColumn("short_description_en", "TEXT", "short_description");
            await ensureProjectColumn("description_en", "LONGTEXT", "description");
        })();
    }

    await global.__mysqlInitPromise;
}
