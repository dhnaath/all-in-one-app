# All in One

Frontend workspace all-in-one — klien, proyek, tugas, keuangan, dan alat produktivitas dalam satu aplikasi.

## Struktur Proyek

```
src/
  app/         Shell aplikasi inti (app-shell, dock, command palette, modal global)
  features/    Modul per fitur (finance, credit, syariah, zakat, tax, wira, dst.)
  components/ui  Komponen UI dasar (shadcn/ui)
  config/      Konfigurasi navigasi
  routes/      Definisi route (file-based routing via TanStack Router)
  lib/         Utilities & helper bersama
  hooks/       Custom React hooks bersama
```

## Menjalankan Secara Lokal

**Prasyarat:** Node.js, pnpm

1. Install dependencies:
   ```
   pnpm install
   ```
2. Jalankan development server:
   ```
   pnpm run dev
   ```
3. Build untuk produksi:
   ```
   pnpm run build
   ```

## Stack

- React + Vite
- TanStack Router
- Tailwind CSS
- TypeScript
