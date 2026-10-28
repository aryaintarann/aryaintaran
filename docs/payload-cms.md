# Admin panel (Payload CMS 3)

Admin ada di `/admin`, tertanam di app Next.js. Konten situs disimpan di Postgres Supabase, schema `payload`
(bukan `public`, jadi tidak terekspos lewat API Supabase). Gambar disimpan di bucket Supabase Storage lewat S3 API.

## Struktur

| Apa | Di mana |
|---|---|
| Config | `src/payload.config.ts` |
| Collections | `src/collections/` (`projects`, `skills`, `media`, `contact-messages`, `users`) |
| Globals | `src/globals/` (`hero`, `about`, `contact`) |
| Pembaca konten situs | `src/lib/content.ts`, `getContent()` mengembalikan bentuk `SiteContent` yang sama seperti sebelumnya |
| Cache | tag `site-content`, di-expire oleh hook di `src/hooks/revalidateContent.ts` setiap simpan |
| Form kontak publik | `POST /api/messages` (Turnstile + honeypot + rate limit), menulis ke `contact-messages` lewat Local API |

`contact-messages` bukan `messages` karena Payload akan melayani `/api/messages` dan bentrok dengan route form kontak.

## Environment

Lihat `.env.example`. Wajib: `PAYLOAD_SECRET`, `DATABASE_URL`, dan semua `S3_*`.
`DATABASE_URL` memakai connection string pooler Supabase. S3 key dibuat di Project Settings > Storage > S3 Connection.

## Setup pertama (produksi)

Urutannya penting: build prerender halaman dari database, jadi tabel dan data harus ada sebelum deploy.

1. Isi env var di mesin lokal (`.env.local`) dan di Vercel, menunjuk ke database produksi.
2. `npm run db:migrate` membuat tabel di schema `payload`.
3. `npm run migrate:content -- --dry-run`, lalu `npm run migrate:content` menyalin `site_content`, gambar, dan pesan lama.
   Salinan JSON sumber disimpan di `.migration-backup/` (di-gitignore). Aman dijalankan ulang.
4. Deploy, lalu **segera** buka `/admin` dan buat akun admin pertama. Layar pendaftaran pertama terbuka untuk siapa saja
   sampai akun pertama ada.

> **Awas:** `scripts/run-ts.mjs` ikut membaca `.env.local`. Kalau `S3_*` terisi, `migrate:content` mengunggah gambar
> ke bucket Supabase yang asli, bukan ke folder `media/`. Untuk uji lokal murni, kosongkan `S3_BUCKET`.

## Mengubah schema

Ubah collection/global, lalu:

```
npm run generate:types           # memperbarui src/payload-types.ts dan importMap
npm run db:migrate:create -- nama
npm run db:migrate
```

Setelah `db:migrate:create`, jalankan sekali lagi dengan nama lain: isi migrasinya harus kosong (`// Migration code`).
Kalau tidak kosong, config dan migrasi tidak sinkron.

## Catatan

- Push schema otomatis di mode dev dimatikan (`push: false`). Tanpa itu, `npm run dev` mengubah database langsung dan
  `db:migrate` berikutnya bentrok (`type ... already exists`). Kalau sudah terlanjur: cek isi schema, lalu
  `drop schema payload cascade;` di SQL Editor dan jalankan ulang `npm run db:migrate`.

- `payload` CLI (`npx payload ...`) rusak di proyek ini: loader tsx bentrok dengan class `CacheStorage` di undici.
  Semua skrip memakai `scripts/run-ts.mjs` (bundle esbuild lalu jalan dengan Node biasa).
- Upload lewat server di Vercel dibatasi 4,5 MB (`upload.limits.fileSize`).
- Tabel lama `site_content` dan `messages` di schema `public` tidak dihapus; hapus manual setelah yakin.
