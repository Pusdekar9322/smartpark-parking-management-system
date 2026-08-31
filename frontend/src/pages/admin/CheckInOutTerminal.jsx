import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { QrCode, CheckCircle2, AlertCircle, ArrowRight, Clock, ShieldCheck, Car } from 'lucide-react';

export default function CheckInOutTerminal() {
  const [activeTab, setActiveTab] = useState('checkin');
  const [bookingIdentifier, setBookingIdentifier] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH_AT_PARKING');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
      }
    } catch (err) {
      setError(err.message || 'Operation failed. Verify the booking number.');
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
    <div className="max-w-2xl mx-auto space-y-6 text-left">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gate Entry / Exit Terminal 🚧</h1>
        <p className="text-xs text-slate-500 mt-0.5">Automated barrier controller and QR verification station</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab('checkin');
              handleReset();
            }}
            className={`py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'checkin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Gate Entry (Check-In)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('checkout');
              handleReset();
            }}
            className={`py-3 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'checkout'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Gate Exit (Check-Out)</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Barrier Alert</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {result ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 space-y-4">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-base">
                <CheckCircle2 className="w-6 h-6" />
                <span>{activeTab === 'checkin' ? 'Barrier Raised: Vehicle Check-In Successful!' : 'Vehicle Cleared & Session Completed!'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/80 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Booking Ref</span>
                  <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{result.bookingNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Allocated Slot</span>
                  <p className="font-black text-brand-600 text-base mt-0.5">{result.slotNumber} ({result.floorName})</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicle</span>
                  <p className="font-bold text-slate-900 mt-0.5">{result.vehicleNumber}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Customer</span>
                  <p className="font-bold text-slate-900 mt-0.5">{result.customerName}</p>
                </div>

                {activeTab === 'checkout' && (
                  <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black">
                    <span>Collected Amount:</span>
                    <span className="text-brand-600 text-base">{formatCurrency(result.finalAmount)}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
            >
              Scan Next Pass
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcess} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scan Ticket QR / Type Reference Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bookingIdentifier}
                  onChange={(e) => setBookingIdentifier(e.target.value.toUpperCase())}
                  placeholder="e.g. SP-PN-2026-000001"
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-200 text-sm font-mono font-bold uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                  autoFocus
                />
                <QrCode className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {activeTab === 'checkout' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select On-Counter Collection Mode (If Unpaid)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CASH_AT_PARKING', label: 'Cash Counter' },
                    { id: 'UPI_AT_PARKING', label: 'UPI QR' },
                    { id: 'CARD_AT_PARKING', label: 'POS Card' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                        paymentMode === m.id
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !bookingIdentifier.trim()}
              className={`w-full py-4 px-4 text-white rounded-2xl font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 ${
                activeTab === 'checkin'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-brand-600 hover:bg-brand-700 shadow-brand-600/20'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Barrier System...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === 'checkin' ? 'Validate Entry (Check-In)' : 'Process Exit & Generate Receipt'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
