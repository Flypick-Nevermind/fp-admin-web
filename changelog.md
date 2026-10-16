# CHANGELOG — fp-admin-web

Format mengikuti [Keep a Changelog](https://keepachangelog.com) dan
[Semantic Versioning](https://semver.org).

## [Unreleased] — 0.5.0 (integrasi customer orders + detail & status flow)

### Added
- **Modul Customer Orders (`/admin/orders` & `/admin/orders/:id`)**:
  - `core/entities/order.ts`: domain types (`OrderListItem`, `OrderDetail`, `OrderItem`, `OrderStatus`, `PaymentStatus`, dsb.).
  - `core/usecases/order.ts`: ports (`OrderRepository`) + use cases (`GetOrdersUseCase`, `GetOrderDetailUseCase`, `UpdateOrderStatusUseCase`).
  - `data/models/order.ts`: wire DTOs untuk paginated list, detail with items, dan payload update status.
  - `data/datasources/orders.ts`: HTTP client untuk `/orders` (list + filter status), `/orders/:id`, dan `/orders/status`.
  - `data/repositories/orders.ts`: repository implementation + DTO to domain mappers.
  - `shared/utils/order.ts` & `format.ts`: badges warna status order/pembayaran, labels, dan helper `formatIdr`.
  - `presentation/hooks/useOrders.ts` & `useOrderDetail.ts`: composition roots untuk list paginated filterable & status mutation.
  - `presentation/pages/Orders.tsx`: tabel responsif customer orders dengan status tabs, search filter, pagination, dan direct link detail.
  - `presentation/pages/OrderDetail.tsx`: tampilan detail komprehensif (daftar barang Taobao/Tmall, breakdown ongkir/jasa, data pembeli & alamat pengiriman, info transfer manual/struk) dilengkapi quick action (Verifikasi Pembayaran & Proses, Kirim, Selesai) serta modal ubah status kustom.
  - Router `/admin/orders` dan `/admin/orders/:id` terhubung ke layout admin.

## [0.4.0] — (assigned carts + metrik live + kontrak login)

### Added
- **Tab Assigned Carts** (`/admin/assigned-carts`):
  - `core/entities/assignedCartCreation.ts`, `data/models`, `data/datasources` (fetch `/cart-creations/assigned?user_admin_id=X&page=&limit=`), port + use case + `data/repositories`.
  - `presentation/hooks/useAssignedCartCreations.ts` (state pagination; `user_admin_id` dibaca dari `adminId` di auth session, bukan hardcode).
  - `shared/components/AssignedCartCardSkeleton.tsx` + `presentation/pages/AssignedCarts.tsx` (card grid + pagination).
  - Router + sidebar (ikon cart-check).
- **Metrik live di Dashboard**:
  - `GET /users/active/count` → `ActiveUsersCard` (badge live, hijau).
  - `GET /users/inactive/count` → `InactiveUsersCard` (badge live, oranye).
  - Tiap endpoint dibangun full clean-arch (entity → model → datasource → port → usecase → repo → hook → card).
  - Dashboard baris atas kini 4 kolom: Active + Inactive (live) + 2 stat.
- **Auth persistence**: session JWT disimpan ke `localStorage` via middleware `persist` Zustand (key `fp-admin-auth`), jadi refresh nggak ngembaliin ke login.
  - Tambah helper `getAccessToken()` di `useAuthStore`.

### Changed
- **Kontrak login**: response backend berubah `user_id` → `user_admin_id`. Di-adjust di `data/models/auth.ts` (wire), `core/entities/auth.ts` (`AuthSession.adminId`), dan `data/repositories/auth.ts` (mapping).
- `Assigned Carts` hanya menampilkan cart yang di-assign ke admin yang login (sesuai filter `user_admin_id` backend).

### Verified
- `npm run build` hijau.
- Browser end-to-end: login → tab Assigned Carts render data + pagination; Dashboard nunjukin Active (2) & Inactive (11) dari backend.

## [0.3.0] — desain profesional + pagination + layout fix

### Changed
- **Desain dari Duolingo → profesional dark SaaS** (gaya Linear/Vercel):
  - Token baru di `@theme`: palet dark muted (`app-bg`, `card`, `accent` #635bff, status success/warning/danger/info), radius kecil.
  - Font **Inter** (ganti Nunito), weight rapi (400–800).
  - Kartu: border halus + `card-hover`, buang efek 3D "pressed".
  - Ikon line SVG (ganti emoji/mascot owl) di nav + tombol.
  - Badge status soft-bg + teks berwarna.
  - Scrollbar tipis gelap + skeleton shimmer subtle.
- Utility baru: `card`/`card-hover`/`btn-primary`/`btn-secondary`/`btn-ghost`/`btn-danger`/`badge`/`input`/`skeleton`/`scroll-thin`/`divide`.
- Update semua komponen: `AdminLayout`, `Login`, `Dashboard`, `UnassignedCarts`, `InactiveUsers`, `Placeholder`, `StatCard`, `ConfirmModal`, `Pagination`, skeleton.
- `statusColor` + `userActiveState` sekarang map ke token profesional (info/success/warning/danger).

### Added
- **Pagination** di tab Unassigned Carts + Inactive Users (prev/next + page-size 10/20/50).
- `core/entities/page.ts` (`PageMeta`, `PageResult`), `shared/components/Pagination.tsx`.
- Backend kini berformat `data.items` + `data.meta` → semua layer cart & user diupdate.

### Fixed
- Layout: sidebar kini pin (logout/collapse nggak ke-seret oleh list panjang) — `h-screen overflow-hidden` + scroll internal.
- Hook `useUnassignedCartCreations` & `useInactiveUsers`: instance repo dibuat di dalam `useEffect` (bukan per-render) biar nggak ada re-render loop.
- `is_active` tri-state (null = "Belum Diaktifkan", false = "Inactive", true = "Aktif").

### Verified
- `npm run build` hijau.
- Browser: pagination (P1→P2→P1) + token warna resolve bener, layout pin.

## [0.2.0] — auth + env

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
