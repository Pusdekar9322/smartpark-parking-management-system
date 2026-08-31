import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { TicketPercent, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(100);
  const [minBookingAmount, setMinBookingAmount] = useState(50);
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d.toISOString().split('T')[0];
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    adminService.getCoupons()
      .then((res) => {
        if (res.data) setCoupons(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createCoupon({
        couponCode: couponCode.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : null,
        minBookingAmount: parseFloat(minBookingAmount || 0),
        expiryDate: `${expiryDate}T23:59:59`
      });
      setShowModal(false);
      setCouponCode('');
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to create coupon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this discount coupon?')) return;
    try {
      await adminService.deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      alert(err.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Discount Coupons 🎟️</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage promotional codes, percentage discounts, and min spend thresholds</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading coupons...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono font-black text-sm rounded-xl uppercase tracking-wider">
                    {c.couponCode}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Discount Benefit:</span>
                    <span className="font-extrabold text-slate-900">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `Flat ${formatCurrency(c.discountValue)} OFF`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Min Booking Required:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(c.minBookingAmount || 0)}</span>
                  </div>

                  {c.maxDiscountAmount && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Max Discount Cap:</span>
                      <span className="font-bold text-slate-800">{formatCurrency(c.maxDiscountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    <span>Valid Until:</span>
                    <span className="font-semibold text-slate-600">{formatDate(c.expiryDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Create Discount Coupon</h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code (Promo Code)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVAL30, PUNE100"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="20"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    value={minBookingAmount}
                    onChange={(e) => setMinBookingAmount(e.target.value)}
                    placeholder="50"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
