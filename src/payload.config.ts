import path from "path";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { Users } from "@/collections/Users";
import { Media } from "@/collections/Media";
import { Projects } from "@/collections/Projects";
import { Skills } from "@/collections/Skills";
import { ContactMessages } from "@/collections/ContactMessages";
import { Hero } from "@/globals/Hero";
import { About } from "@/globals/About";
import { Contact } from "@/globals/Contact";

const dirname = path.resolve(process.cwd(), "src");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aryaintaran.dev";

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: dirname } },
  collections: [Users, Media, Projects, Skills, ContactMessages],
  globals: [Hero, About, Contact],
  // Same markup cleanBio() allows on the public site, so the editor never offers what gets stripped.
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      BoldFeature(),
      ItalicFeature(),
      UnderlineFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      LinkFeature(),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET ?? "",
  // Own schema: Supabase only exposes `public` through its API, so these tables stay off it.
  // push: false — dev must never alter a shared database on its own; schema changes go through `npm run db:migrate`.
  db: postgresAdapter({
    // Supabase's session pooler allows only 15 clients in total; every serverless instance holds its own pool,
    // so a small max keeps instances from exhausting it (EMAXCONNSESSION). Also point DATABASE_URL at port 6543 (transaction mode) on Vercel.
    pool: { connectionString: process.env.DATABASE_URL, max: process.env.NODE_ENV === "production" ? 3 : 10 },
    schemaName: "payload",
    migrationDir: path.resolve(dirname, "migrations"),
    push: false,
  }),
  // A REST call whose Origin isn't listed loses its auth cookie, so /api/media/access says "no create" and the bulk-upload Save button never renders.
  // Dev: empty list = no origin check (any host/port you open the admin on works). Production keeps the strict list.
  csrf:
    process.env.NODE_ENV === "production"
      ? [
          SITE_URL,
          SITE_URL.replace("://www.", "://"),
          SITE_URL.replace("://", "://www."),
          ...[process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
            .filter(Boolean)
            .map((host) => `https://${host}`),
        ]
      : [],
  // shortcut: server-side upload, so Vercel's 4.5MB request cap applies; upgrade to clientUploads if images outgrow it.
  upload: { limits: { fileSize: 4_500_000 } },
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  plugins: [
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: {
        media: {
          prefix: "media",
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => `${process.env.S3_PUBLIC_URL}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      },
    }),
  ],
});
