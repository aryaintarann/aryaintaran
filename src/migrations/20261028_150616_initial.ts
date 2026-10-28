import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "payload";
  CREATE TYPE "payload"."enum_projects_type" AS ENUM('personal', 'freelance', 'work');
  CREATE TYPE "payload"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__projects_v_version_type" AS ENUM('personal', 'freelance', 'work');
  CREATE TYPE "payload"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."projects_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "payload"."projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"type" "payload"."enum_projects_type" DEFAULT 'personal',
  	"description" varchar,
  	"long_description" varchar,
  	"link" varchar,
  	"github" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."_projects_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "payload"."enum__projects_v_version_type" DEFAULT 'personal',
  	"version_description" varchar,
  	"version_long_description" varchar,
  	"version_link" varchar,
  	"version_github" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "payload"."skills" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"name" varchar NOT NULL,
  	"icon" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"read" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"projects_id" integer,
  	"skills_id" integer,
  	"contact_messages_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."about_education_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"summary" varchar,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "payload"."about_career_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."about_career" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"year" varchar NOT NULL,
  	"summary" varchar,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "payload"."about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"bio" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"social_instagram" varchar,
  	"social_tiktok" varchar,
  	"social_github" varchar,
  	"social_linkedin" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_stack" ADD CONSTRAINT "projects_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_version_stack" ADD CONSTRAINT "_projects_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "payload"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_skills_fk" FOREIGN KEY ("skills_id") REFERENCES "payload"."skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "payload"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_education_details" ADD CONSTRAINT "about_education_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_education" ADD CONSTRAINT "about_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_career_details" ADD CONSTRAINT "about_career_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about_career"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."about_career" ADD CONSTRAINT "about_career_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "projects_stack_order_idx" ON "payload"."projects_stack" USING btree ("_order");
  CREATE INDEX "projects_stack_parent_id_idx" ON "payload"."projects_stack" USING btree ("_parent_id");
  CREATE INDEX "projects__order_idx" ON "payload"."projects" USING btree ("_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "payload"."projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "payload"."projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "payload"."projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "payload"."projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "payload"."projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "payload"."projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "payload"."projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "payload"."projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_stack_order_idx" ON "payload"."_projects_v_version_stack" USING btree ("_order");
  CREATE INDEX "_projects_v_version_stack_parent_id_idx" ON "payload"."_projects_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "payload"."_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "payload"."_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "payload"."_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "payload"."_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "payload"."_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "payload"."_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "payload"."_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "payload"."_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "payload"."_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "payload"."_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "payload"."_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "payload"."_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "payload"."_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "skills__order_idx" ON "payload"."skills" USING btree ("_order");
  CREATE INDEX "skills_updated_at_idx" ON "payload"."skills" USING btree ("updated_at");
  CREATE INDEX "skills_created_at_idx" ON "payload"."skills" USING btree ("created_at");
  CREATE INDEX "contact_messages_updated_at_idx" ON "payload"."contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "payload"."contact_messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_skills_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("skills_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "about_education_details_order_idx" ON "payload"."about_education_details" USING btree ("_order");
  CREATE INDEX "about_education_details_parent_id_idx" ON "payload"."about_education_details" USING btree ("_parent_id");
  CREATE INDEX "about_education_order_idx" ON "payload"."about_education" USING btree ("_order");
  CREATE INDEX "about_education_parent_id_idx" ON "payload"."about_education" USING btree ("_parent_id");
  CREATE INDEX "about_career_details_order_idx" ON "payload"."about_career_details" USING btree ("_order");
  CREATE INDEX "about_career_details_parent_id_idx" ON "payload"."about_career_details" USING btree ("_parent_id");
  CREATE INDEX "about_career_order_idx" ON "payload"."about_career" USING btree ("_order");
  CREATE INDEX "about_career_parent_id_idx" ON "payload"."about_career" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."projects_stack" CASCADE;
  DROP TABLE "payload"."projects" CASCADE;
  DROP TABLE "payload"."projects_rels" CASCADE;
  DROP TABLE "payload"."_projects_v_version_stack" CASCADE;
  DROP TABLE "payload"."_projects_v" CASCADE;
  DROP TABLE "payload"."_projects_v_rels" CASCADE;
  DROP TABLE "payload"."skills" CASCADE;
  DROP TABLE "payload"."contact_messages" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."hero" CASCADE;
  DROP TABLE "payload"."about_education_details" CASCADE;
  DROP TABLE "payload"."about_education" CASCADE;
  DROP TABLE "payload"."about_career_details" CASCADE;
  DROP TABLE "payload"."about_career" CASCADE;
  DROP TABLE "payload"."about" CASCADE;
  DROP TABLE "payload"."contact" CASCADE;
  DROP TYPE "payload"."enum_projects_type";
  DROP TYPE "payload"."enum_projects_status";
  DROP TYPE "payload"."enum__projects_v_version_type";
  DROP TYPE "payload"."enum__projects_v_version_status";`)
}
