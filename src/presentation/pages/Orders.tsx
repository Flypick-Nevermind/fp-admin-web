import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import {
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentStatusBadgeClass,
  paymentStatusLabel,
} from '@/shared/utils/order';
import { formatIdr } from '@/shared/utils/format';
import { formatTimestamp } from '@/shared/utils/cart';
import { Pagination } from '@/shared/components/Pagination';

const STATUS_TABS = [
  { id: '', label: 'Semua Status' },
  { id: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran' },
  { id: 'PROCESSING', label: 'Diproses' },
  { id: 'SHIPPED', label: 'Dikirim' },
  { id: 'COMPLETED', label: 'Selesai' },
  { id: 'CANCELLED', label: 'Dibatalkan' },
];

export function OrdersPage() {
  const navigate = useNavigate();
  const {
    items,
    meta,
    page,
    limit,
    status,
    loading,
    error,
    goToPage,
    setPageSize,
    setStatusFilter,
    reload,
  } = useOrders();

  const [search, setSearch] = useState('');

  // Client-side search across visible orders
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((ord) => {
      const matchNumber = ord.orderNumber.toLowerCase().includes(q);
      const matchCustomer = ord.user?.userName.toLowerCase().includes(q) ||
        ord.user?.userEmail.toLowerCase().includes(q) ||
        ord.user?.userPhone.includes(q);
      const matchRecipient = ord.recipientName.toLowerCase().includes(q) ||
        ord.recipientPhone.includes(q) ||
        ord.shippingCity.toLowerCase().includes(q);
      const matchNotes = ord.shippingNotes.toLowerCase().includes(q);
      return matchNumber || matchCustomer || matchRecipient || matchNotes;
    });
  }, [items, search]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-text">Customer Orders</h1>
          <p className="text-sm text-muted mt-1">
            Kelola pesanan pelanggan, verifikasi bukti pembayaran manual, dan update pengiriman
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="search"
            placeholder="Cari order, pelanggan, catatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-64"
          />
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border">
        {STATUS_TABS.map((tab) => {
          const active = status === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-muted hover:text-text hover:bg-card/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-danger/20 bg-danger-soft text-danger text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={reload} className="btn-secondary text-xs !py-1">
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="card overflow-hidden divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 animate-pulse">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-app-surface rounded" />
                <div className="h-3 w-64 bg-app-surface rounded" />
              </div>
              <div className="h-6 w-24 bg-app-surface rounded" />
              <div className="h-8 w-24 bg-app-surface rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Orders Table */}
      {!loading && filtered.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-app-surface/60 border-b border-border text-xs text-muted font-medium uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Order & Tanggal</th>
                  <th className="py-3 px-4">Pelanggan & Tujuan</th>
                  <th className="py-3 px-4">Total & Item</th>
                  <th className="py-3 px-4">Metode & Info</th>
                  <th className="py-3 px-4">Status Pesanan</th>
                  <th className="py-3 px-4">Status Pembayaran</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((ord) => (
                  <tr
                    key={ord.orderId}
                    className="hover:bg-app-surface/40 transition-colors"
                  >
                    {/* Order Number & Created Date */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="font-mono font-semibold text-text text-sm block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-muted block mt-0.5">
                        {formatTimestamp(ord.createdAt)}
                      </span>
                    </td>

                    {/* Customer & Destination */}
                    <td className="py-3.5 px-4 align-top max-w-[220px]">
                      <div className="font-medium text-text text-xs truncate">
                        {ord.recipientName}
                      </div>
                      <div className="text-[11px] text-muted truncate">
                        {ord.user?.userName ? `@${ord.user.userName}` : ord.recipientPhone}
                      </div>
                      <div className="text-[11px] text-subtle truncate mt-0.5" title={ord.shippingAddress}>
                        📍 {ord.shippingCity}
                      </div>
                    </td>

                    {/* Total & Items */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-text text-xs">
                        {formatIdr(ord.totalAmount)}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5">
                        {ord.itemCount} barang
                      </div>
                    </td>

                    {/* Payment Method & Shipping Notes */}
                    <td className="py-3.5 px-4 align-top max-w-[200px]">
                      <div className="text-xs font-medium text-text">
                        {ord.paymentMethod}
                      </div>
                      {ord.shippingNotes ? (
                        <div
                          className="text-[11px] text-muted line-clamp-2 mt-0.5 bg-card/60 rounded px-1.5 py-0.5 border border-border"
                          title={ord.shippingNotes}
                        >
                          {ord.shippingNotes}
                        </div>
                      ) : (
                        <span className="text-[11px] text-subtle italic">-</span>
                      )}
                    </td>

                    {/* Order Status */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${orderStatusBadgeClass(
                          ord.orderStatus,
                        )}`}
                      >
                        {orderStatusLabel(ord.orderStatus)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4 align-top">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${paymentStatusBadgeClass(
                          ord.paymentStatus,
                        )}`}
                      >
                        {paymentStatusLabel(ord.paymentStatus)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/orders/${ord.orderId}`)}
                        className="btn-secondary text-xs !py-1.5 !px-3 inline-flex items-center gap-1.5"
                      >
                        Detail
                        <span aria-hidden="true">→</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && !error && (
        <div className="card p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-app-surface border border-border flex items-center justify-center text-muted mb-3">
            📦
          </div>
          <h3 className="text-sm font-semibold text-text">Tidak ada pesanan ditemukan</h3>
          <p className="text-xs text-muted max-w-sm mt-1">
            {search
              ? 'Tidak ada pesanan yang sesuai dengan kata kunci pencarian Anda.'
              : 'Belum ada transaksi pesanan pelanggan untuk filter status ini.'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn-secondary text-xs mt-4"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && meta && meta.total > 0 && (
        <Pagination
          meta={meta}
          page={page}
          limit={limit}
          disabled={loading}
          onPageChange={goToPage}
          onLimitChange={setPageSize}
        />
      )}
    </div>
  );
}
