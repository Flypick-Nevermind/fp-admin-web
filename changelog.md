# CHANGELOG — fp-admin-web

Format mengikuti [Keep a Changelog](https://keepachangelog.com) dan
[Semantic Versioning](https://semver.org).

## [Unreleased] — 0.2.0 (auth + env)

### Added
- **Env config (dev/prod):**
  - `.env` (defaults), `.env.development`, `.env.production` → `VITE_API_BASE_URL` + `VITE_AUTH_LOGIN_PATH`.
  - `src/shared/utils/env.ts` = single source of truth (typed `env` + `getLoginUrl()`).
  - `src/vite-env.d.ts` typing for `import.meta.env`.
- **Auth (clean-arch):**
  - `core/entities/auth.ts` → `LoginCredentials`, `AuthSession`.
  - `core/usecases/auth.ts` → port `AuthRepository`.
  - `core/usecases/login.ts` → use case `Login`.
  - `data/models/auth.ts` → `AuthResponseDTO` (wire envelope, snake_case).
  - `data/datasources/auth.ts` → `AuthDataSource` (fetch ke `/auth/login`) + `AuthApiError`.
  - `data/repositories/auth.ts` → `AuthRepositoryImpl` (map DTO → entity).
  - `presentation/hooks/useAuthStore.ts` (Zustand session).
  - `presentation/hooks/useLogin.ts` (composition root: port → impl → use case).
  - `presentation/pages/Login.tsx` (login Duolingo-style).
  - `presentation/routes/RequireAuth.tsx` (route guard).
- Router: `/login` public, `/admin/**` di-guard `RequireAuth`, `/` + `*` → `/admin`.
- `AdminLayout`: menampilkan `user_name` + tombol **Log out**.

### Dependencies
- `zustand` kini dipakai (auth store).

### Verified
- `npm run build` hijau.
- `dev /login` & `dev /admin` → HTTP 200.

## [0.1.0] — scaffold awal

### Added
- Scaffold React + TypeScript + Vite (`react-ts` template).
- Struktur folder Clean Architecture:
  - `src/core/entities`, `src/core/usecases`
  - `src/data/datasources`, `src/data/models`, `src/data/repositories`
  - `src/presentation/{components,pages,hooks,routes}`
  - `src/shared/{components,utils,types}`
- Tailwind CSS v4 + `@tailwindcss/postcss` (`postcss.config.js`).
- Design tokens Duolingo-style di `src/index.css` (`@theme`).
- Custom utility `duo-card`, `duo-btn-primary`, `duo-btn-secondary`, `duo-btn-danger`.
- Domain:
  - `AdminUser`, `DashboardStat`, `ActivityItem` entities + `ADMIN_ROLES`.
  - Port `DashboardRepository`.
  - Use case `GetDashboardStats`.
- Data:
  - `DashboardStatDTO` / `ActivityItemDTO`.
  - `DashboardDataSource` (fetch simulasi).
  - `DashboardRepositoryImpl` (map DTO → entity).
- Presentation:
  - `AdminLayout` (sidebar collapsible + content).
  - `DashboardPage` + loading skeleton.
  - `PlaceholderPage` untuk Users / Orders / Settings.
  - `useDashboardStats` hook (composition root).
  - `appRouter` (React Router v7).
- Path alias `@/` → `src/`.
- Dokumentasi: `arch.md`, `design.md`, `changelog.md`.

### Dependencies
- `react-router-dom`
- `zustand` (siap pakai, belum dipakai)
- dev: `tailwindcss`, `@tailwindcss/postcss`, `postcss`

### Verified
- `npm run build` hijau (tsc strict + vite).
- `npm run dev` → `http://localhost:5173/admin` render Dashboard.

## [0.0.0] — initial (auto)
- Template awal Vite (belum dipakai; langsung di-replace).
