import fs from "fs";
import path from "path";
import { supabase } from "@/lib/supabase";
import type { SiteContent } from "@/types/content";

const TABLE = "site_content";
const ROW_ID = 1;
const contentPath = path.join(process.cwd(), "src/data/content.json");

/** Read the bundled JSON file (always available — committed to git). */
function readLocalContent(): SiteContent {
  const raw = fs.readFileSync(contentPath, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

/**
 * Get site content.
 * Strategy: Supabase first → fallback to local content.json.
 * Fallback is triggered when:
 *   - Table does not exist yet (PGRST116 / 42P01)
 *   - Row is empty (no data seeded yet)
 *   - Supabase credentials are missing / network error
 */
export async function getContent(): Promise<SiteContent> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .single();

    // error.code PGRST116 = no rows found; other errors = table missing, etc.
    if (error || !data) {
      console.warn("[content] Supabase unavailable or empty, using local JSON fallback.");
      return readLocalContent();
    }

    return data.data as SiteContent;
  } catch (err) {
    console.warn("[content] Supabase exception, using local JSON fallback:", err);
    return readLocalContent();
  }
}

/**
 * Save site content.
 * Strategy: Supabase first (upsert) → fallback to local content.json.
 * Fallback allows the local admin to work before the Supabase table is created.
 * On Vercel the filesystem is read-only, so the fallback will also fail there —
 * meaning the Supabase table MUST exist in production.
 */
export async function saveContent(content: SiteContent): Promise<void> {
  // Try Supabase first
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: content }, { onConflict: "id" });

    if (!error) return; // success
    console.warn("[content] Supabase save failed, falling back to local JSON:", error.message);
  } catch (err) {
    console.warn("[content] Supabase exception on save, falling back to local JSON:", err);
  }

  // Fallback: write to local content.json (works locally, fails on Vercel read-only FS)
  try {
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8");
  } catch {
    throw new Error(
      "Gagal menyimpan: Supabase tidak tersedia dan filesystem juga tidak bisa ditulis. " +
      "Jalankan SQL di supabase/migrations/create_site_content.sql terlebih dahulu."
    );
  }
}
