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
 * Save site content to Supabase.
 * Uses upsert so the first save also acts as the initial seed.
 * Throws if Supabase is not accessible (table must exist first).
 */
export async function saveContent(content: SiteContent): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, data: content }, { onConflict: "id" });

  if (error) {
    throw new Error(
      `Failed to save to Supabase: ${error.message}. ` +
      `Make sure table 'site_content' exists. Run the SQL in supabase/migrations/create_site_content.sql`
    );
  }
}
