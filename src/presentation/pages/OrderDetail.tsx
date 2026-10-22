import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrderDetail } from '../hooks/useOrderDetail';
import type { OrderStatus, PaymentStatus } from '@/core/entities/order';
import {
  orderStatusBadgeClass,
  orderStatusLabel,
  paymentStatusBadgeClass,
  paymentStatusLabel,
} from '@/shared/utils/order';
import { formatIdr } from '@/shared/utils/format';
import { formatTimestamp, shopLabel } from '@/shared/utils/cart';
import { resolveImageSrc } from '@/shared/utils/image';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, loading, error, updating, updateStatus, reload } =
    useOrderDetail(id);

  // Quick Action / Custom Status Modal states
  const [modalMode, setModalMode] = useState<
    'verify_payment' | 'ship' | 'complete' | 'cancel' | 'custom' | null
  >(null);
  const [customOrderStatus, setCustomOrderStatus] = useState<OrderStatus>('PROCESSING');
  const [customPaymentStatus, setCustomPaymentStatus] = useState<PaymentStatus>('SETTLEMENT');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleOpenCustom = () => {
    if (order) {
      setCustomOrderStatus(order.orderStatus);
      setCustomPaymentStatus(order.paymentStatus);
    }
    setActionError(null);
    setModalMode('custom');
  };

  const handleExecuteStatusUpdate = async () => {
    setActionError(null);
    try {
      if (modalMode === 'verify_payment') {
        await updateStatus({
          orderStatus: 'PROCESSING',
          paymentStatus: 'SETTLEMENT',
        });
      } else if (modalMode === 'ship') {
        await updateStatus({
          orderStatus: 'SHIPPED',
        });
      } else if (modalMode === 'complete') {
        await updateStatus({
          orderStatus: 'COMPLETED',
        });
      } else if (modalMode === 'cancel') {
        await updateStatus({
          orderStatus: 'CANCELLED',
        });
      } else if (modalMode === 'custom') {
        await updateStatus({
          orderStatus: customOrderStatus,
          paymentStatus: customPaymentStatus,
        });
      }
      setModalMode(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Gagal memperbarui status order.',
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-6 w-32 bg-card rounded" />
        <div className="card p-6 h-36 bg-card" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-6 h-80 bg-card" />
          <div className="card p-6 h-80 bg-card" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="card p-8 max-w-md text-center border-danger/30 bg-danger-soft">
          <h2 className="text-base font-semibold text-danger">Order Tidak Ditemukan</h2>
          <p className="text-xs text-muted mt-2">{error || 'Data order tidak tersedia.'}</p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate('/admin/orders')}
              className="btn-secondary text-xs"
            >
              Kembali ke Daftar Orders
            </button>
            <button onClick={reload} className="btn-primary text-xs">
              Muat Ulang
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted">
        <Link
          to="/admin/orders"
          className="hover:text-text transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>Daftar Pesanan</span>
        </Link>
        <span>/</span>
        <span className="text-text font-mono">{order.orderNumber}</span>
      </div>

      {/* Top Banner / Order Summary Card */}
      <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-border">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl font-bold font-mono text-text">
              {order.orderNumber}
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${orderStatusBadgeClass(
                order.orderStatus,
              )}`}
            >
              {orderStatusLabel(order.orderStatus)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${paymentStatusBadgeClass(
                order.paymentStatus,
              )}`}
            >
              {paymentStatusLabel(order.paymentStatus)}
            </span>
          </div>
          <p className="text-xs text-muted">
            Dibuat pada {formatTimestamp(order.createdAt)} • Diperbarui pada{' '}
            {formatTimestamp(order.updatedAt)}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {order.orderStatus === 'WAITING_PAYMENT' && (
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setModalMode('verify_payment');
              }}
              className="btn-primary text-xs !bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600 text-white font-semibold flex items-center gap-1.5"
            >
              <span>✓</span>
              <span>Verifikasi & Proses Bayar</span>
            </button>
          )}

          {order.orderStatus === 'PROCESSING' && (
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setModalMode('ship');
              }}
              className="btn-primary text-xs !bg-blue-600 hover:!bg-blue-700 !border-blue-600 text-white font-semibold flex items-center gap-1.5"
            >
              <span>🚚</span>
              <span>Kirim Pesanan (SHIPPED)</span>
            </button>
          )}

          {order.orderStatus === 'SHIPPED' && (
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setModalMode('complete');
              }}
              className="btn-primary text-xs !bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600 text-white font-semibold flex items-center gap-1.5"
            >
              <span>🎉</span>
              <span>Tandai Selesai (COMPLETED)</span>
            </button>
          )}

          {order.orderStatus !== 'CANCELLED' && order.orderStatus !== 'COMPLETED' && (
            <button
              type="button"
              onClick={() => {
                setActionError(null);
                setModalMode('cancel');
              }}
              className="btn-danger text-xs"
            >
              Batalkan
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCustom}
            className="btn-secondary text-xs"
          >
            Ubah Status
          </button>
        </div>
      </div>

      {/* Main Grid: Left Items & Costs | Right Customer & Shipping Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-border bg-app-surface/50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">
                Daftar Barang ({order.items.length})
              </h2>
              <span className="text-xs text-muted">
                Total Item: {order.items.reduce((acc, it) => acc + it.quantity, 0)} pcs
              </span>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <div key={item.orderDetailId} className="p-4 flex gap-4 items-start">
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-app-surface border border-border shrink-0 flex items-center justify-center">
                    {item.productImage ? (
                      <img
                        src={resolveImageSrc(item.productImage)}
                        alt={item.productTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%23666"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="10">No Image</text></svg>';
                        }}
                      />
                    ) : (
                      <span className="text-xs text-subtle">No Img</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card border border-border text-accent uppercase font-mono">
                        {shopLabel(item.productUrl)}
                      </span>
                      {item.productUrl && (
                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-accent hover:underline flex items-center gap-0.5 truncate"
                        >
                          Buka Link Produk ↗
                        </a>
                      )}
                    </div>

                    <h3 className="text-xs font-semibold text-text line-clamp-2">
                      {item.productTitle}
                    </h3>

                    {item.notes && (
                      <p className="text-[11px] text-muted bg-app-surface/60 border border-border/80 rounded px-2 py-1 inline-block mt-1">
                        📝 {item.notes}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted">
                        {formatIdr(item.productPrice)} × {item.quantity}
                      </span>
                      <span className="text-xs font-semibold text-text font-mono">
                        {formatIdr(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown Footer */}
            <div className="p-4 bg-app-surface/40 border-t border-border space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Subtotal Barang:</span>
                <span className="font-mono text-text font-medium">
                  {formatIdr(order.totalItemPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Biaya Layanan &amp; Handling:</span>
                <span className="font-mono text-text font-medium">
                  {formatIdr(order.serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Biaya Pengiriman Internasional/Domestik:</span>
                <span className="font-mono text-text font-medium">
                  {formatIdr(order.shippingFee)}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-bold text-text">
                <span>Total Tagihan:</span>
                <span className="font-mono text-accent text-base">
                  {formatIdr(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping Details */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="card p-5 space-y-3">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
              Data Akun Pemesan
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-subtle block text-[10px]">Nama Lengkap</span>
                <span className="font-medium text-text">
                  {order.user?.userName || '-'}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">Email</span>
                <span className="font-medium text-text">
                  {order.user?.userEmail || '-'}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">No. Telepon / WhatsApp</span>
                <span className="font-medium text-text font-mono">
                  {order.user?.userPhone || '-'}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">User ID</span>
                <span className="text-[11px] font-mono text-muted break-all">
                  {order.userId}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="card p-5 space-y-3">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
              Alamat Pengiriman
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-subtle block text-[10px]">Penerima Paket</span>
                <span className="font-semibold text-text">
                  {order.recipientName}
                </span>
                <span className="text-muted block font-mono text-[11px] mt-0.5">
                  📞 {order.recipientPhone}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">Alamat Lengkap</span>
                <p className="font-medium text-text leading-relaxed">
                  {order.shippingAddress}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-subtle block text-[10px]">Kota</span>
                  <span className="font-medium text-text">
                    {order.shippingCity}
                  </span>
                </div>
                <div>
                  <span className="text-subtle block text-[10px]">Kode Pos</span>
                  <span className="font-medium text-text font-mono">
                    {order.shippingPostalCode || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Notes Card */}
          <div className="card p-5 space-y-3">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
              Pembayaran &amp; Catatan
            </h2>
            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-subtle block text-[10px]">Metode Pembayaran</span>
                <span className="font-semibold text-text">
                  {order.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">Status Pembayaran</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${paymentStatusBadgeClass(
                    order.paymentStatus,
                  )}`}
                >
                  {paymentStatusLabel(order.paymentStatus)}
                </span>
              </div>
              <div>
                <span className="text-subtle block text-[10px]">Catatan Pengiriman & Bukti Struk Transfer</span>
                {order.paymentProofUrl && (
                  <div className="mt-2 mb-2 p-2.5 bg-app-surface rounded-lg border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                      📸 Foto Struk Transfer Customer:
                    </span>
                    <a
                      href={resolveImageSrc(order.paymentProofUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block relative overflow-hidden rounded border border-border hover:border-emerald-500 transition-all max-w-[200px]"
                    >
                      <img
                        src={resolveImageSrc(order.paymentProofUrl)}
                        alt="Bukti Struk Transfer"
                        className="w-full h-28 object-cover rounded group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23666"><rect width="100%" height="100%" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="10">Gagal Memuat Struk</text></svg>';
                        }}
                      />
                      <span className="block text-center text-[10px] text-emerald-300 font-medium py-1 bg-black/60 backdrop-blur-xs">
                        Buka Struk Asli ↗
                      </span>
                    </a>
                  </div>
                )}
                {order.shippingNotes ? (
                  <div className="p-3 bg-app-surface/60 rounded-lg border border-border text-xs text-text leading-relaxed mt-1">
                    {order.shippingNotes}
                  </div>
                ) : (
                  !order.paymentProofUrl && (
                    <span className="text-muted text-xs italic">Tidak ada catatan</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Quick Actions */}
      <ConfirmModal
        open={modalMode === 'verify_payment'}
        title="Verifikasi Pembayaran"
        description={
          <>
            Konfirmasi bahwa dana tagihan sebesar{' '}
            <strong className="text-accent">{formatIdr(order.totalAmount)}</strong> telah
            masuk ke rekening mutasi bank Flypick. Status pesanan akan diubah menjadi{' '}
            <strong>DIPROSES</strong> dan pembayaran menjadi <strong>LUNAS</strong>.
          </>
        }
        confirmLabel="Ya, Verifikasi & Proses"
        cancelLabel="Batal"
        busy={updating}
        error={actionError}
        onConfirm={handleExecuteStatusUpdate}
        onCancel={() => setModalMode(null)}
      />

      <ConfirmModal
        open={modalMode === 'ship'}
        title="Kirim Pesanan"
        description="Pesanan telah siap diberangkatkan melalui maskapai/ekspedisi. Ubah status menjadi DIKIRIM (SHIPPED)?"
        confirmLabel="Ya, Tandai Dikirim"
        cancelLabel="Batal"
        busy={updating}
        error={actionError}
        onConfirm={handleExecuteStatusUpdate}
        onCancel={() => setModalMode(null)}
      />

      <ConfirmModal
        open={modalMode === 'complete'}
        title="Selesaikan Pesanan"
        description="Barang telah diterima oleh pelanggan dengan baik. Tandai pesanan ini sebagai SELESAI?"
        confirmLabel="Ya, Selesaikan"
        cancelLabel="Batal"
        busy={updating}
        error={actionError}
        onConfirm={handleExecuteStatusUpdate}
        onCancel={() => setModalMode(null)}
      />

      <ConfirmModal
        open={modalMode === 'cancel'}
        title="Batalkan Pesanan"
        description="Apakah Anda yakin ingin membatalkan pesanan ini? Status akan diubah menjadi CANCELLED."
        confirmVariant="danger"
        confirmLabel="Ya, Batalkan Pesanan"
        cancelLabel="Kembali"
        busy={updating}
        error={actionError}
        onConfirm={handleExecuteStatusUpdate}
        onCancel={() => setModalMode(null)}
      />

      {/* Custom Status Modal */}
      {modalMode === 'custom' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !updating && setModalMode(null)}
          />
          <div className="relative z-10 w-full max-w-md card p-6 flex flex-col shadow-2xl space-y-4">
            <h2 className="text-base font-semibold text-text">
              Ubah Status Pesanan &amp; Pembayaran
            </h2>
            <p className="text-xs text-muted">
              Pilih status pesanan dan status pembayaran yang sesuai untuk order{' '}
              <strong className="text-text font-mono">{order.orderNumber}</strong>.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-medium text-text block mb-1">
                  Status Pesanan (Order Status)
                </label>
                <select
                  value={customOrderStatus}
                  onChange={(e) => setCustomOrderStatus(e.target.value as OrderStatus)}
                  disabled={updating}
                  className="input w-full"
                >
                  <option value="WAITING_PAYMENT">WAITING_PAYMENT (Menunggu Pembayaran)</option>
                  <option value="PROCESSING">PROCESSING (Sedang Diproses)</option>
                  <option value="SHIPPED">SHIPPED (Dalam Pengiriman)</option>
                  <option value="COMPLETED">COMPLETED (Selesai)</option>
                  <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text block mb-1">
                  Status Pembayaran (Payment Status)
                </label>
                <select
                  value={customPaymentStatus}
                  onChange={(e) => setCustomPaymentStatus(e.target.value as PaymentStatus)}
                  disabled={updating}
                  className="input w-full"
                >
                  <option value="PENDING">PENDING (Menunggu)</option>
                  <option value="SETTLEMENT">SETTLEMENT (Lunas)</option>
                  <option value="EXPIRED">EXPIRED (Kedaluwarsa)</option>
                  <option value="FAILED">FAILED (Gagal)</option>
                </select>
              </div>
            </div>

            {actionError && (
              <div className="text-xs font-medium text-danger bg-danger-soft border border-danger/20 rounded-md px-3 py-2">
                {actionError}
              </div>
            )}

            <div className="mt-4 flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                disabled={updating}
                className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusUpdate}
                disabled={updating}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  'Simpan Perubahan'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
