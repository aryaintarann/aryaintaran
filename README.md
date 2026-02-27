# Arya Intaran - Professional Portfolio

Selamat datang di repositori portofolio profesional saya! Website ini adalah portofolio modern, cepat, dan responsif yang dibangun untuk menampilkan proyek, kemampuan, dan pengalaman saya sebagai **Website Developer & IT Support** berbasis di Bali.

Website ini juga dilengkapi dengan integrasi AI chatbot untuk membantu pengunjung secara interaktif.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Admin Panel**: Custom Admin Panel (Next.js + NextAuth)
- **Animasi UI**: [GSAP](https://gsap.com/)
- **AI Integrasi**: [Google Gemini API](https://deepmind.google/technologies/gemini/) (Chatbot)
- **Deployment**: Recomendasi menggunakan [Vercel](https://vercel.com/)

## 📦 Fitur Utama

- **Konten Dinamis**: Website ini menggunakan MySQL + custom admin panel untuk mengelola profil, proyek, pendidikan, pengalaman kerja, dan konten terlokalisasi tanpa perlu ubah kode.
- **AI Chatbot**: Asisten pintar yang dibangun menggunakan **Google Gemini API** yang siap menjawab secara langsung di dalam website.
- **Desain Responsif**: Desain yang dioptimalkan untuk berbagai layar peramban (Mobile, Tablet, Desktop).
- **Animasi Halus**: Animasi menarik performa tinggi serta kustom dengan GSAP.
- **Optimasi SEO**: Pengaturan metadata dinamis yang sudah diatur agar ramah terhadap mesin pencari.

## 🛠️ Memulai Development Berlokasi Lokal (Getting Started)

### Prasyarat

Pastikan spesifikasi mesin (komputer/laptop) Anda sudah terinstal framework Javascript di bawah ini:
- Node.js (direkomendasikan versi 18 ke atas)

### Instalasi dan Menjalankan

1. Clone repositori ini:
   ```bash
   git clone https://github.com/aryaintaran/aryaintaran.git
   cd aryaintaran
   ```

2. Instal dependensi:
   ```bash
   npm install
   # atau menggunakan yarn/pnpm/bun
   ```

3. Pengaturan Environment (Variabel Lingkungan):
   Salin berkas `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi / lengkapi *value* berikut di dalam file `.env.local` yang baru saja dibuat:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
   AUTH_SECRET=your_strong_random_secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=your_strong_admin_password
   DATABASE_URL=mysql://root:password@localhost:3306/aryaintaran
   ```

4. Menjalankan server development:
   ```bash
   npm run dev
   ```

5. Buka tautan [http://localhost:3891](http://localhost:3891) pada peramban (browser) Anda untuk melihat hasilnya.

## 🐳 Menjalankan dengan Docker

Project ini sudah disiapkan dengan `Dockerfile`, `.dockerignore`, dan `docker-compose.yml`.

### Prasyarat

- Docker Desktop aktif di Windows

### Development Mode (dengan hot reload)

1. Pastikan file `.env.local` sudah ada.
2. Buat file secrets lokal (jangan di-commit):
   - `.docker/secrets/gemini_api_key.txt`
   - `.docker/secrets/google_translate_api_key.txt`
3. Isi masing-masing file hanya dengan 1 nilai token.
4. Jalankan:
   ```bash
   docker compose up --build app-dev
   ```
5. Buka [http://localhost:3891](http://localhost:3891).

### Production Mode

1. Pastikan file `.env.local` dan file di folder `.docker/secrets/` sudah ada.
2. Jalankan:
   ```bash
   docker compose up --build app-prod
   ```
3. Buka [http://localhost:3891](http://localhost:3891).

### Catatan Keamanan

- Untuk variabel sensitif (`GEMINI_API_KEY`, `GOOGLE_TRANSLATE_API_KEY`, `AUTH_SECRET`, `ADMIN_PASSWORD`), gunakan file di `.docker/secrets/`.
- Setelah pindah ke `.docker/secrets/`, hapus variabel sensitif tersebut dari `.env.local`.
- Hindari menjalankan `docker compose config` di mesin bersama karena output dapat menampilkan konfigurasi environment.

### Stop Container

```bash
docker compose down
```

## 🧩 Manajemen Konten (Custom Admin Panel)

Admin panel sekarang menggunakan autentikasi NextAuth dengan kredensial dari environment variable:

1. Tambahkan variabel berikut di `.env.local`:
   - `AUTH_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `DATABASE_URL` (format MySQL, contoh: `mysql://root:password@localhost:3306/aryaintaran`)
2. Jalankan aplikasi seperti tahap `Memulai Development` di atas.
3. Akses halaman `/admin/login`.
4. Login menggunakan `ADMIN_EMAIL` dan `ADMIN_PASSWORD`.
5. Kelola data project, konten profil/karier/kontak, dan localized text langsung dari dashboard `/admin` (fitur CRUD penuh).

