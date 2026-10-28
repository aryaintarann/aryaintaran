// One-off: copy the old site_content JSON, images and contact messages into Payload. Safe to re-run.
// Usage: npm run migrate:content [-- --dry-run]
import fs from "fs";
import path from "path";
import config from "@payload-config";
import { createClient } from "@supabase/supabase-js";
import { convertHTMLToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
import { JSDOM } from "jsdom";
import { getPayload } from "payload";
import type { SiteContent } from "@/types/content";

const dryRun = process.argv.includes("--dry-run");
const ctx = { disableRevalidate: true };
const log = (m: string) => console.log(`${dryRun ? "[dry-run] " : ""}${m}`);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } }) : null;

async function loadSource(): Promise<SiteContent> {
  if (supabase) {
    const { data, error } = await supabase.from("site_content").select("data").eq("id", 1).single();
    if (!error && data) return data.data as SiteContent;
    log(`site_content unavailable (${error?.message ?? "empty"}), using src/data/content.json`);
  }
  return JSON.parse(fs.readFileSync("src/data/content.json", "utf-8")) as SiteContent;
}

const source = await loadSource();
fs.mkdirSync(".migration-backup", { recursive: true });
fs.writeFileSync(`.migration-backup/site-content-${Date.now()}.json`, JSON.stringify(source, null, 2));

const payload = await getPayload({ config });
const lexical = convertHTMLToLexical({ editorConfig: await editorConfigFactory.default({ config: payload.config }), html: source.about.bio, JSDOM });

// shortcut: media is matched by filename, so two different source images sharing a basename would collapse into one.
async function mediaFor(url: string, alt: string): Promise<number | null> {
  const name = decodeURIComponent(path.basename(new URL(url).pathname));
  const existing = await payload.find({ collection: "media", where: { filename: { equals: name } }, limit: 1, overrideAccess: true });
  if (existing.docs[0]) return existing.docs[0].id;
  if (dryRun) return null;
  const res = await fetch(url);
  if (!res.ok) {
    log(`  skip image ${url} (${res.status})`);
    return null;
  }
  const data = Buffer.from(await res.arrayBuffer());
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: { data, name, mimetype: res.headers.get("content-type") ?? "image/jpeg", size: data.length },
    overrideAccess: true,
    context: ctx,
  });
  return created.id;
}

// --- globals
log("globals: hero, about, contact");
if (!dryRun) {
  await payload.updateGlobal({ slug: "hero", data: source.hero, overrideAccess: true, context: ctx });
  await payload.updateGlobal({ slug: "contact", data: source.contact, overrideAccess: true, context: ctx });
  const withDetails = <T extends { details: string[] }>(items: T[]) => items.map((i) => ({ ...i, details: i.details.map((text) => ({ text })) }));
  await payload.updateGlobal({
    slug: "about",
    data: { bio: lexical, education: withDetails(source.about.education), career: withDetails(source.about.career) },
    overrideAccess: true,
    context: ctx,
  });
}

// --- skills (matched by name)
for (const s of source.skills) {
  const found = await payload.find({ collection: "skills", where: { name: { equals: s.name } }, limit: 1, overrideAccess: true });
  log(`skill ${s.name}: ${found.docs[0] ? "update" : "create"}`);
  if (dryRun) continue;
  const data = { name: s.name, icon: s.icon };
  if (found.docs[0]) await payload.update({ collection: "skills", id: found.docs[0].id, data, overrideAccess: true, context: ctx });
  else await payload.create({ collection: "skills", data, overrideAccess: true, context: ctx });
}

// --- projects (matched by slug; source order = admin order because orderable appends on create)
for (const p of source.projects) {
  const found = await payload.find({ collection: "projects", where: { slug: { equals: p.slug } }, limit: 1, draft: true, overrideAccess: true });
  log(`project ${p.slug}: ${found.docs[0] ? "update" : "create"} (${p.images.length} images)`);
  const images: number[] = [];
  for (const url of p.images) {
    const id = await mediaFor(url, p.title);
    if (id !== null) images.push(id);
  }
  if (dryRun) continue;
  const data = {
    title: p.title,
    slug: p.slug,
    type: p.type,
    description: p.description,
    longDescription: p.longDescription,
    images,
    stack: p.stack.map((name) => ({ name })),
    link: p.link,
    github: p.github,
    _status: "published" as const,
  };
  if (found.docs[0]) await payload.update({ collection: "projects", id: found.docs[0].id, data, overrideAccess: true, context: ctx });
  else await payload.create({ collection: "projects", data, overrideAccess: true, context: ctx });
}

// --- contact messages (only when the old Supabase table is reachable)
if (supabase) {
  const { data: rows, error } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
  if (error) log(`messages: skipped (${error.message})`);
  else {
    let copied = 0;
    for (const m of rows ?? []) {
      const dup = await payload.find({
        collection: "contact-messages",
        where: { and: [{ email: { equals: m.email } }, { message: { equals: m.message } }, { createdAt: { equals: m.created_at } }] },
        limit: 1,
        overrideAccess: true,
      });
      if (dup.docs[0]) continue;
      copied++;
      if (dryRun) continue;
      await payload.create({
        collection: "contact-messages",
        data: { name: m.name, email: m.email, message: m.message, read: !!m.read, createdAt: m.created_at },
        overrideAccess: true,
        context: ctx,
      });
    }
    log(`messages: ${copied} to copy of ${rows?.length ?? 0}`);
  }
}

log("done");
