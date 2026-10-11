# DESIGN — fp-admin-web

Desain sistem **profesional / dark SaaS** (gaya Linear & Vercel):
warna dark muted, tipografi Inter yang rapi, kartu dengan border halus
+ shadow lembut, ikon garis (line icons), dan badge status yang lembut.
Tidak ada emoji, mascot, atau efek 3D "pressed".

## Design Tokens

Tokens didefinisikan di `@theme` dalam `src/index.css` (Tailwind v4).
**Jangan hardcode hex di komponen** — selalu pakai token.

| Token                | Nilai            | Pemakaian                          |
|----------------------|------------------|------------------------------------|
| `--color-app-bg`     | `#0a0a0b`        | background utama app               |
| `--color-app-surface`| `#111113`        | surface / sidebar / input bg       |
| `--color-card`       | `#161618`        | background kartu                   |
| `--color-card-hover` | `#1b1b1f`        | hover state kartu                  |
| `--color-border`     | `#26262b`        | border, divider                    |
| `--color-text`       | `#ededf0`        | teks utama                         |
| `--color-muted`      | `#8a8a94`        | teks sekunder                      |
| `--color-subtle`     | `#5e5e68`        | teks tersier / placeholder         |
| `--color-accent`     | `#635bff`        | primary / CTA / link              |
| `--color-accent-hover`| `#5448e6`       | hover CTA                          |
| `--color-accent-soft`| `rgba(99,91,255,.14)` | background soft aksen      |
| `--color-success`    | `#47d68c`        | sukses / aktif                     |
| `--color-success-soft`| `rgba(71,214,140,.14)`| badge sukses                 |
| `--color-warning`    | `#f5a623`        | belum diaktifkan / pending         |
| `--color-warning-soft`| `rgba(245,166,35,.14)`| badge warning                |
| `--color-danger`     | `#ff5c7a`        | error / hapus / inactive           |
| `--color-danger-soft`| `rgba(255,92,122,.14)`| badge danger                 |
| `--color-info`       | `#4cc9f0`        | on-progress / info                 |
| `--color-info-soft`  | `rgba(76,201,240,.14)`| badge info                   |

## Utilities (custom `@utility`)

| Class           | Deskripsi                                   |
|-----------------|---------------------------------------------|
| `card`          | kartu: `bg-card`, border halus, radius `lg` |
| `card-hover`    | hover state kartu (bg + border lebih terang)|
| `btn-primary`   | tombol aksen (fill, hover gelap)          |
| `btn-secondary` | tombol outline / solid netral               |
| `btn-ghost`     | tombol tanpa bg, text-only                  |
| `btn-danger`    | tombol merah (konfirmasi destruktif)        |
| `badge`         | chip status (soft bg + teks berwarna)        |
| `input`         | input form (dark, focus ring aksen)         |
| `divide`        | divider row (`border-bottom`)               |
| `skeleton`      | shimmer loader (subtle, low-contrast)       |
| `scroll-thin`   | scrollbar tipis gelap                       |

### Contoh pemakaian

```tsx
<div className="card card-hover p-5">…</div>
<button className="btn-primary">Save</button>
<span className="badge bg-success-soft text-success">Aktif</span>
<input className="input" />
```

## Ikon

- Pakai **line icons** SVG (24×24, stroke 1.7) — bukan emoji.
- Didefinisikan inline di `AdminLayout.tsx` (nav icons) dan di tiap
  button kecil (refresh, chevron, arrow up/down).
- Warna mengikuti context (`text-subtle` → hover `text-muted`,
  aktif `text-accent`).

## Tipografi

- Font: **Inter** (400, 500, 600, 700, 800) — di-import via Google Fonts.
- Heading halaman: `text-xl font-semibold`.
- Judul kartu / section: `text-sm font-semibold`.
- Body: `text-sm`; meta: `text-xs text-muted` / `text-subtle`.
- Angka metrik: `font-semibold tracking-tight`.

## Layout (Admin)

- Sidebar kiri (collapsible, `w-60` / `w-16`) + area konten di kanan.
- Konten `max-w-6xl`, padding `px-6 py-6`, scroll vertical internal.
- Grid stat card: responsif `sm:2` → `lg:4`.
- Tabel (Inactive Users): header sticky-look + row divider `divide-border`.

## Konvensi Status

| Kondisi            | Warna              | Label          |
|--------------------|--------------------|----------------|
| Aktif / Completed  | success (hijau)    | "Aktif"        |
| On progress / info | info (biru cyan)   | status ID      |
| Belum diaktifkan   | warning (oranye)   | "Belum Diaktifkan" |
| Inactive / Cancel  | danger (merah)     | "Inactive"     |

## Aksesibilitas

- Teks selalu `text-text` di atas `card`/`app-bg` (kontras tinggi).
- Semua elemen interaktif punya `cursor: pointer` + state disabled.
- Modal: `role="dialog"`, `aria-modal`, close via `Esc`.
