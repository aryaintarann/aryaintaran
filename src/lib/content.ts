import { supabase } from "@/lib/supabase";
import type { SiteContent } from "@/types/content";

const TABLE = "site_content";
const ROW_ID = 1;

export async function getContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("id", ROW_ID)
    .single();

  if (error || !data) {
    throw new Error(`Failed to read content: ${error?.message ?? "No data"}`);
  }

  return data.data as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, data: content }, { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to save content: ${error.message}`);
  }
}
