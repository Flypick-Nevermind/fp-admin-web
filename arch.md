# ARCHITECTURE — fp-admin-web

Admin dashboard berbasis **React + TypeScript + Vite** dengan **Clean Architecture**.
Styling pakai **Tailwind CSS v4** dan tema UI ala **Duolingo**.

## Layers

```
src/
├─ core/                  # Domain (pure, tanpa dependency eksternal)
│  ├─ entities/           # Plain types / business objects
│  └─ usecases/           # Application logic + ports (interfaces)
│
├─ data/                  # Infrastruktur (implementasi concrete)
│  ├─ datasources/        # Akses data mentah (API client, dsb.)
│  ├─ models/             # DTO (Data Transfer Objects)
│  └─ repositories/       # Implementasi port, map DTO → entity
│
├─ presentation/          # UI (React)
│  ├─ components/         # Reusable layout / molecule
│  ├─ pages/              # Full-page views
│  ├─ hooks/              # UI state + composition root
│  └─ routes/             # React Router config
│
└─ shared/                # Dipakai lintas layer
   ├─ components/         # UI atom (StatCard, ActivityFeed, ...)
   ├─ utils/              # Fungsi helper (format, truncate, ...)
   └─ types/              # Shared type definitions
```

## Dependency Rules (Clean Architecture)

```
presentation → core → (tanpa dependency keluar)
data         → core  (implementasi port milik domain)
shared       → (dipakai semua, tanpa dependency ke layer lain)
```

- **`core`** tidak boleh import dari `presentation` maupun `data`.
- **`data`** hanya boleh import `core` (port) dan type-only.
- **`presentation`** wire port → implementasi via **hooks** (composition root).

## Data Flow (contoh: Dashboard)

```
DashboardPage (presentation)
   └─ useDashboardStats hook
        └─ GetDashboardStats usecase (core)
             └─ DashboardRepository port (core)
                  └─ DashboardRepositoryImpl (data)
                       └─ DashboardDataSource (data) → DTO
                            └─ map DTO → DashboardStat entity
```

## Port & Adapter

| Port (interface, domain)    | Adapter (implementasi, data)              |
|----------------------------|------------------------------------------|
| `DashboardRepository`      | `DashboardRepositoryImpl`               |

## Path Aliases

- `@/` → `src/` (via `tsconfig.app.json` + `vite.config.ts`).

## Tech

| Concern            | Choice                          |
|--------------------|---------------------------------|
| Framework          | React 19 + Vite                 |
| Language           | TypeScript (strict)             |
| Routing            | React Router v7 (browser)       |
| Styling            | Tailwind CSS v4                 |
| State (future)     | Zustand (terinstall, belum dipakai) |

## Verification

- `npm run build` → tsc strict + vite build (harus hijau).
- `npm run dev` → buka `http://localhost:5173/admin`.
