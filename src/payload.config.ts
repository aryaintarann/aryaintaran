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
    pool: { connectionString: process.env.DATABASE_URL },
    schemaName: "payload",
    migrationDir: path.resolve(dirname, "migrations"),
    push: false,
  }),
  csrf: [SITE_URL, ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:3000"])],
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
