# DESIGN — fp-admin-web

Desain sistem ala **Duolingo**: warna cerah, kartu dengan tepi 3D,
font tebal (Nunito), dan tombol dengan efek "pressed".

## Design Tokens

Tokens didefinisikan di `@theme` dalam `src/index.css` (Tailwind v4).
**Jangan hardcode hex di komponen** — selalu pakai token.

| Token             | Nilai     | Pemakaian                       |
|-------------------|-----------|--------------------------------|
| `--color-duo-bg`  | `#fff`    | background kartu / konten      |
| `--color-duo-surface` | `#f6f7fb` | background app          |
| `--color-duo-border`  | `#e5e5ea` | border & shadow tepi          |
| `--color-duo-text`    | `#3c3c3c` | teks utama                    |
| `--color-duo-muted`   | `#777777` | teks sekunder                 |
| `--color-duo-green`   | `#58cc02` | primary / success             |
| `--color-duo-green-dark` | `#4cb302` | hover / shadow tepi hijau   |
| `--color-duo-blue`    | `#1cb0f6` | accent / info                 |
| `--color-duo-red`     | `#ff4b4b` | danger / error                |
| `--color-duo-yellow`  | `#ffc800` | streak / badge                |
| `--color-duo-purple`  | `#ce82ff` | level / premium               |
| `--radius-duo`        | `1rem`    | radius standar                |

## Utilities (custom `@utility`)

| Class              | Deskripsi                                  |
|--------------------|--------------------------------------------|
| `duo-card`         | kartu putih, border 2px, shadow tepi 3D     |
| `duo-btn-primary`  | tombol hijau, shadow bawah, efek tekan      |
| `duo-btn-secondary`| tombol biru muda (soft)                     |
| `duo-btn-danger`   | tombol merah                                |

### Contoh pemakaian

```tsx
<div className="duo-card p-5">…</div>
<button className="duo-btn-primary px-8 py-3">Save</button>
```

## Tipografi

- Font: **Nunito** (400, 600, 700, 800, 900) — di-import via Google Fonts di CSS.
- Heading: `font-extrabold` (800) atau `font-black` (900).
- Body / label: `font-bold` (700).

## Layout (Admin)

- Sidebar kiri (collapsible) + area konten di kanan.
- Konten dimaksimumkan `max-w-6xl`, padding `px-6 py-6`.
- Grid stat card: responsif `sm:2` → `lg:4`.

## Aksesibilitas

- Kontras token hijau/teks putih memenuhi WCAG AA untuk teks ≥ 14px bold.
- Semua elemen interaktif punya `cursor: pointer` dan state `:active`.
