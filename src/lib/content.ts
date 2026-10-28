import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { CONTENT_TAG } from "@/hooks/revalidateContent";
import { cleanBio } from "@/lib/sanitize";
import type { Media } from "@/payload-types";
import type { SiteContent } from "@/types/content";

const mediaUrl = (m: number | Media) => (typeof m === "object" && m.url ? m.url : "");

/** Reads Payload and reshapes it into SiteContent, so every section component keeps its existing props. */
async function loadContent(): Promise<SiteContent> {
  const payload = await getPayload({ config });
  const [hero, about, contact, projects, skills] = await Promise.all([
    payload.findGlobal({ slug: "hero" }),
    payload.findGlobal({ slug: "about" }),
    payload.findGlobal({ slug: "contact" }),
    payload.find({ collection: "projects", sort: "_order", pagination: false, depth: 1 }),
    payload.find({ collection: "skills", sort: "_order", pagination: false }),
  ]);

  const details = (d?: { text: string }[] | null) => (d ?? []).map((x) => x.text);

  // An empty Payload returns blank globals rather than failing; surface it instead of rendering an empty site.
  if (!hero.name) throw new Error("Payload content is empty. Run `npm run migrate:content`.");

  return {
    hero: { name: hero.name, tagline: hero.tagline },
    about: {
      bio: convertLexicalToHTML({ data: about.bio }),
      education: (about.education ?? []).map((e) => ({
        title: e.title,
        school: e.school,
        year: e.year,
        summary: e.summary ?? "",
        details: details(e.details),
        active: !!e.active,
      })),
      career: (about.career ?? []).map((c) => ({
        title: c.title,
        company: c.company,
        year: c.year,
        summary: c.summary ?? "",
        details: details(c.details),
        active: !!c.active,
      })),
    },
    skills: skills.docs.map((s) => ({ name: s.name, icon: s.icon ?? "" })),
    projects: projects.docs.map((p, i) => ({
      index: String(i + 1).padStart(2, "0"),
      title: p.title,
      slug: p.slug,
      description: p.description,
      longDescription: p.longDescription,
      type: p.type,
      images: (p.images ?? []).map(mediaUrl).filter(Boolean),
      stack: (p.stack ?? []).map((s) => s.name),
      link: p.link,
      ...(p.github ? { github: p.github } : {}),
    })),
    contact: {
      email: contact.email,
      location: contact.location,
      phone: contact.phone,
      social: {
        instagram: contact.social?.instagram ?? "",
        tiktok: contact.social?.tiktok ?? "",
        github: contact.social?.github ?? "",
        linkedin: contact.social?.linkedin ?? "",
      },
    },
  };
}

const readContent = async (): Promise<SiteContent> => {
  const c = await loadContent();
  return { ...c, about: { ...c.about, bio: cleanBio(c.about.bio) } };
};

/**
 * Site content with the HTML bio sanitized. Tag-cached; Payload hooks bust it on every save.
 * Uncached in dev: the disk cache survives restarts, and scripts that write the database
 * (migrate:content) run outside Next and cannot expire it.
 */
export const getContent =
  process.env.NODE_ENV === "development"
    ? readContent
    : unstable_cache(readContent, ["site-content"], {
        // revalidate is a safety net in case a hook-triggered revalidateTag is ever missed
        tags: [CONTENT_TAG],
        revalidate: 3600,
      });
