# Arya Intaran - Professional Portfolio

Selamat datang di repositori portofolio profesional saya! Website ini adalah portofolio modern, cepat, dan responsif yang dibangun untuk menampilkan proyek, kemampuan, dan pengalaman saya sebagai **Website Developer & IT Support** berbasis di Bali.

Website ini juga dilengkapi dengan integrasi AI chatbot untuk membantu pengunjung secara interaktif.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **CMS (Content Management)**: [Sanity.io](https://www.sanity.io/)
- **Animasi UI**: [GSAP](https://gsap.com/)
- **AI Integrasi**: [Google Gemini API](https://deepmind.google/technologies/gemini/) (Chatbot)
- **Deployment**: Recomendasi menggunakan [Vercel](https://vercel.com/)

## 📦 Fitur Utama

- **Konten Dinamis**: Website ini telah terintegrasi dengan Sanity CMS, sehingga pembaruan profil, proyek, pendidikan, dan pengalaman kerja dapat dilakukan dengan mudah tanpa harus mengubah kode.
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
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-02-12
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Menjalankan server development:
   ```bash
   npm run dev
   ```

5. Buka tautan [http://localhost:3000](http://localhost:3000) pada peramban (browser) Anda untuk melihat hasilnya.

## 🧩 Manajemen Konten (Sanity Studio)

Jika Anda ingin mengubah konten di dalamnya (seperti proyek baru dan sebagainya), Anda dapat login dan mengakses Sanity Studio:

1. Jalankan aplikasi seperti tahap `Memulai Development` di atas.
2. Akses halaman `/studio`.
3. Konten siap diedit dan dipublikasikan.

---
*Dibuat dengan ❤️ oleh Arya Intaran*
