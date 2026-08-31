import React, { useState } from 'react';
import { adminService } from '../services/adminService';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Car,
  CreditCard,
  IndianRupee,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function QRScannerTerminalModal({ isOpen, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' | 'checkout'
  const [bookingIdentifier, setBookingIdentifier] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH_AT_PARKING');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!bookingIdentifier.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res;
      if (activeTab === 'checkin') {
        res = await adminService.checkIn({ bookingIdentifier: bookingIdentifier.trim() });
      } else {
        res = await adminService.checkOut({
          bookingIdentifier: bookingIdentifier.trim(),
          paymentMethod: paymentMode
        });
      }

      if (res.data) {
        setResult(res.data);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Please check the booking number.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setBookingIdentifier('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-brand-950 text-white p-6 relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Gate Entry / Exit Terminal 🇮🇳</h3>
              <p className="text-[11px] text-slate-400">Scan QR Code or Enter Booking Reference</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-base font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-6 space-y-5 text-left">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('checkin');
                handleReset();
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'checkin'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Vehicle Check-In (Entry)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('checkout');
                handleReset();
              }}
              className={`py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'checkout'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Vehicle Check-Out (Exit)</span>
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Validation Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {result ? (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                <div className="flex items-center gap-2 text-emerald-700 font-extrabold text-sm mb-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {activeTab === 'checkin' ? 'Vehicle Entry Approved!' : 'Parking Completed & Gate Opened!'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs bg-white/70 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Booking Number</span>
                    <p className="font-bold text-slate-800">{result.bookingNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Assigned Slot</span>
                    <p className="font-extrabold text-brand-600">{result.slotNumber} ({result.floorName})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Vehicle</span>
                    <p className="font-bold text-slate-800">{result.vehicleNumber}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Customer</span>
                    <p className="font-bold text-slate-800 truncate">{result.customerName}</p>
                  </div>
                  {activeTab === 'checkout' && (
                    <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">Total Collected:</span>
                      <span className="text-sm font-black text-brand-700">{formatCurrency(result.finalAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors"
              >
                Scan Next Vehicle
              </button>
            </div>
          ) : (
            <form onSubmit={handleProcess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scan QR / Enter Booking Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bookingIdentifier}
                    onChange={(e) => setBookingIdentifier(e.target.value)}
                    placeholder="e.g. SP-PN-2026-000123"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                    autoFocus
                  />
                  <div className="absolute right-3 top-3 text-slate-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {activeTab === 'checkout' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Collect On-Counter Payment Mode (if unpaid)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'CASH_AT_PARKING', label: 'Cash Counter' },
                      { id: 'UPI_AT_PARKING', label: 'UPI / QR' },
                      { id: 'CARD_AT_PARKING', label: 'POS Card' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPaymentMode(mode.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                          paymentMode === mode.id
                            ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !bookingIdentifier.trim()}
                  className={`w-full py-3.5 px-4 text-white rounded-2xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 ${
                    activeTab === 'checkin'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                      : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{activeTab === 'checkin' ? 'Approve Entry (Check-In)' : 'Process Exit & Generate Invoice'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
