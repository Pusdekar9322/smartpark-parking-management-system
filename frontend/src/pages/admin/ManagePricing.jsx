import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import { IndianRupee, Save, Plus, Edit2, ShieldAlert, Sparkles } from 'lucide-react';

export default function ManagePricing() {
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [vehicleType, setVehicleType] = useState('CAR');
  const [baseHours, setBaseHours] = useState(2);
  const [basePrice, setBasePrice] = useState(40);
  const [extraHourPrice, setExtraHourPrice] = useState(20);
  const [weekendSurcharge, setWeekendSurcharge] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const fetchPricing = () => {
    setLoading(true);
    adminService.getPricingRules()
      .then((res) => {
        if (res.data) setPricingRules(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleOpenRule = (rule) => {
    if (rule) {
      setVehicleType(rule.vehicleType);
      setBaseHours(rule.baseHours);
      setBasePrice(rule.basePrice);
      setExtraHourPrice(rule.extraHourPrice);
      setWeekendSurcharge(rule.weekendSurcharge);
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.savePricingRule({
        vehicleType,
        baseHours: parseInt(baseHours),
        basePrice: parseFloat(basePrice),
        extraHourPrice: parseFloat(extraHourPrice),
        weekendSurcharge: parseFloat(weekendSurcharge)
      });
      setShowModal(false);
      fetchPricing();
    } catch (err) {
      alert(err.message || 'Failed to save pricing rule.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tariff & Dynamic Pricing 💰</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure base hours, tiered hourly charges, and weekend surcharges</p>
        </div>

        <button
          onClick={() => handleOpenRule(null)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Configure Tariff</span>
        </button>
      </div>

      {/* Pricing Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading pricing rules...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingRules.map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-full font-black text-xs uppercase">
                    {r.vehicleType}
                  </span>
                  <button
                    onClick={() => handleOpenRule(r)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Base Hours Included:</span>
                    <span className="font-bold text-slate-800">{r.baseHours} hours</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Base Fare:</span>
                    <span className="font-black text-brand-600 text-sm">{formatCurrency(r.basePrice)}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Extra Hour Fee:</span>
                    <span className="font-bold text-slate-800">+{formatCurrency(r.extraHourPrice)} / hr</span>
                  </div>

                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Weekend Surcharge:</span>
                    <span className="font-bold text-amber-600">+{formatCurrency(r.weekendSurcharge)} / hr</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Formula: Rule 33 ceiling math applied automatically.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Set Vehicle Pricing Tariff</h3>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="CAR">Car</option>
                  <option value="BIKE">Two-Wheeler</option>
                  <option value="SUV">SUV</option>
                  <option value="EV">EV (Electric)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Included Hours</label>
                  <input
                    type="number"
                    value={baseHours}
                    onChange={(e) => setBaseHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (₹ INR)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Extra Hour Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={extraHourPrice}
                    onChange={(e) => setExtraHourPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Weekend Surcharge (₹ INR/hr)</label>
                  <input
                    type="number"
                    value={weekendSurcharge}
                    onChange={(e) => setWeekendSurcharge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
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
                  {submitting ? 'Saving...' : 'Save Tariff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
