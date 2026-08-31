import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters';
import { paymentService } from '../services/paymentService';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RazorpayPaymentModal({ isOpen, onClose, booking, onSuccess }) {
  const [activeTab, setActiveTab] = useState('upi');
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !booking) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      // 1. Create Razorpay Test Order on Backend
      const orderRes = await paymentService.createRazorpayOrder(booking.id);
      const order = orderRes.data;

      // 2. Simulate standard Razorpay sandbox success payment flow
      const fakePaymentId = 'pay_rzp_test_' + Math.random().toString(36).substring(2, 12);
      const fakeSignature = 'test_sig_' + Math.random().toString(36).substring(2, 12);

      let methodEnum = 'ONLINE_UPI';
      if (activeTab === 'card') methodEnum = 'ONLINE_CARD';
      if (activeTab === 'netbanking') methodEnum = 'ONLINE_NET_BANKING';

      // 3. Verify Payment on Backend with HMAC SHA256 Signature verification
      const verifyRes = await paymentService.verifyPayment({
        bookingId: booking.id,
        razorpayOrderId: order.orderId,
        razorpayPaymentId: fakePaymentId,
        razorpaySignature: fakeSignature,
        paymentMethod: methodEnum
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onSuccess) {
        onSuccess(verifyRes.data);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Razorpay Brand Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-left relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider">Razorpay</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                TEST SANDBOX
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <p className="text-xs text-blue-200 uppercase font-semibold">Paying SmartPark Platform</p>
            <h2 className="text-3xl font-extrabold text-white mt-0.5">
              {formatCurrency(booking.finalAmount || booking.estimatedAmount)}
            </h2>
            <p className="text-xs text-blue-200 mt-1">Ref: {booking.bookingNumber}</p>
          </div>
        </div>

        {error && (
          <div className="m-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Payment Methods Tabs */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('upi')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'upi'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI / QR</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'card'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'netbanking'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>NetBanking</span>
            </button>
          </div>

          <form onSubmit={handlePay} className="space-y-4 text-left">
            {activeTab === 'upi' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <div className="flex gap-2">
                  {['@okhdfcbank', '@paytm', '@okaxis', '@ybl'].map((vpa) => (
                    <button
                      key={vpa}
                      type="button"
                      onClick={() => setUpiId(`rahul${vpa}`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg"
                    >
                      {vpa}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'netbanking' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Select Popular Indian Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        selectedBank === bank
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{bank} Bank</span>
                      {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying Sandbox Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatCurrency(booking.finalAmount || booking.estimatedAmount)}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted Sandbox Gateway</span>
          </div>
        </div>

      </div>
    </div>
  );
}
