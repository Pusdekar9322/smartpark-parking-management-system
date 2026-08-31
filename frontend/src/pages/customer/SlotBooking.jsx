import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { vehicleService } from '../../services/vehicleService';
import { bookingService } from '../../services/bookingService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import RazorpayPaymentModal from '../../components/RazorpayPaymentModal';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  TicketPercent,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SlotBooking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const locationId = searchParams.get('locationId');
  const initialSlotId = searchParams.get('slotId');
  const initialVehicleType = searchParams.get('vehicleType') || 'CAR';

  const [location, setLocation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState(initialSlotId || '');

  // Schedule
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);

  // Payment Option: 'ONLINE_UPI' | 'CASH_AT_PARKING'
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_UPI');

  // Fee calculation state
  const [feeBreakdown, setFeeBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Razorpay Checkout Modal
  const [createdBookingForPayment, setCreatedBookingForPayment] = useState(null);

  useEffect(() => {
    if (!locationId) {
      navigate('/customer/parking');
      return;
    }

    Promise.all([
      parkingService.getLocationById(locationId),
      vehicleService.getMyVehicles()
    ])
      .then(([locRes, vehRes]) => {
        if (locRes.data) setLocation(locRes.data);
        if (vehRes.data) {
          setVehicles(vehRes.data);
          if (vehRes.data.length > 0) {
            setSelectedVehicleId(vehRes.data[0].id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locationId, navigate]);

  // Recalculate fee whenever times or vehicle changes
  useEffect(() => {
    if (!selectedVehicleId || !bookingDate || !startTime || !endTime) return;

    const selectedVeh = vehicles.find((v) => v.id.toString() === selectedVehicleId.toString());
    const vType = selectedVeh?.vehicleType || initialVehicleType;

    const startIso = `${bookingDate}T${startTime}:00`;
    const endIso = `${bookingDate}T${endTime}:00`;

    parkingService.calculateFee({
      vehicleType: vType,
      startTime: startIso,
      endTime: endIso,
      couponCode: appliedCoupon?.couponCode || undefined
    })
      .then((res) => {
        if (res.data) setFeeBreakdown(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [selectedVehicleId, bookingDate, startTime, endTime, appliedCoupon, vehicles, initialVehicleType]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError(null);

    const gross = feeBreakdown?.grossAmount || 100;
    try {
      const res = await bookingService.applyCoupon(couponCode.trim(), gross);
      if (res.data) {
        setAppliedCoupon(res.data);
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) {
      alert('Please add or select a vehicle first.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const startIso = `${bookingDate}T${startTime}:00`;
    const endIso = `${bookingDate}T${endTime}:00`;

    try {
      const bookingRes = await bookingService.createBooking({
        vehicleId: selectedVehicleId,
        parkingLocationId: locationId,
        parkingSlotId: selectedSlotId,
        startTime: startIso,
        endTime: endIso,
        paymentMethod: paymentMethod,
        couponCode: appliedCoupon?.couponCode || undefined
      });

      const newBooking = bookingRes.data;

      if (paymentMethod.startsWith('ONLINE')) {
        // Open Razorpay Checkout Modal
        setCreatedBookingForPayment(newBooking);
      } else {
        // Pay at Parking confirmed
        navigate(`/customer/booking-confirmation?bookingId=${newBooking.id}`);
      }
    } catch (err) {
      setError(err.message || 'Could not complete booking. Please try another slot or time.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-left">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase text-brand-600 tracking-wider">Step 2: Reservation & Payment</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          Booking Summary & Checkout 🇮🇳
        </h1>
        <p className="text-xs text-slate-500">
          Review your reservation at {location?.name} and select your payment preference.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Reservation Failed</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleCreateBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Configurator */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Vehicle Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-brand-600" />
                <span>1. Select Vehicle</span>
              </h2>
              <Link
                to="/customer/vehicles"
                className="text-xs font-bold text-brand-600 hover:text-brand-700"
              >
                + Add New Vehicle
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                <p className="font-bold">No registered vehicles found.</p>
                <p className="mt-1">Please register your vehicle before proceeding.</p>
                <Link
                  to="/customer/vehicles"
                  className="inline-block mt-2 px-3 py-1.5 bg-amber-600 text-white rounded-lg font-bold"
                >
                  Register Vehicle
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVehicleId(v.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      selectedVehicleId.toString() === v.id.toString()
                        ? 'border-brand-600 bg-brand-50/70 text-slate-900 ring-2 ring-brand-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-black font-mono tracking-wider">{v.vehicleNumber}</p>
                      <p className="text-[11px] text-slate-500">{v.vehicleBrand} • {v.vehicleType}</p>
                    </div>
                    {selectedVehicleId.toString() === v.id.toString() && (
                      <CheckCircle2 className="w-4 h-4 text-brand-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Schedule Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>2. Date & Parking Duration</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Booking Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Entry Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Exit Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {feeBreakdown?.isWeekend && (
              <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                ⚡ Weekend Tariff Active: Includes Pune weekend parking surcharge.
              </p>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600" />
              <span>3. Choose Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Online Payment */}
              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE_UPI')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentMethod.startsWith('ONLINE')
                    ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  {paymentMethod.startsWith('ONLINE') && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Online Payment</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">UPI, GPay, PhonePe, Cards (Razorpay Test)</p>
                </div>
              </button>

              {/* Pay at Parking */}
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_AT_PARKING')}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'CASH_AT_PARKING'
                    ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Banknote className="w-5 h-5" />
                  </div>
                  {paymentMethod === 'CASH_AT_PARKING' && <CheckCircle2 className="w-5 h-5 text-brand-600" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Pay at Parking</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay final amount via Cash/UPI at exit counter</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Summary & Pricing Breakdown */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h2>

            {/* Location & Slot details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">{location?.name}</p>
                  <p className="text-[11px] text-slate-500">{location?.area}, {location?.city}</p>
                </div>
              </div>
            </div>

            {/* Coupon Application Box */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">Apply Discount Coupon</label>
              {appliedCoupon ? (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{appliedCoupon.couponCode} applied</span>
                    <p className="text-[10px] text-emerald-600">{appliedCoupon.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PUNE50, SMART10"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>}
            </div>

            {/* Pricing Breakdown Table */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Duration ({feeBreakdown?.durationHours || 4} hrs):</span>
                <span className="font-bold text-slate-800">{formatCurrency(feeBreakdown?.grossAmount || 80)}</span>
              </div>

              {feeBreakdown?.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Savings:</span>
                  <span>- {formatCurrency(feeBreakdown.discountAmount)}</span>
                </div>
              )}

              {feeBreakdown?.cgstAmount > 0 && (
                <>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>CGST (9%):</span>
                    <span>{formatCurrency(feeBreakdown.cgstAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>SGST (9%):</span>
                    <span>{formatCurrency(feeBreakdown.sgstAmount)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-brand-600 text-lg font-black">
                  {formatCurrency(feeBreakdown?.totalAmount || 80)}
                </span>
              </div>
            </div>

            {/* Confirm Reservation Button */}
            <button
              type="submit"
              disabled={submitting || vehicles.length === 0}
              className="w-full py-4 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Confirming Slot...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMethod.startsWith('ONLINE')
                      ? `Pay ${formatCurrency(feeBreakdown?.totalAmount || 80)} Online`
                      : 'Confirm (Pay at Parking)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              By confirming, you agree to SmartPark cancellation terms (Free cancellation up to 30 mins before entry).
            </p>
          </div>

        </div>

      </form>

      {/* Razorpay Online Sandbox Payment Modal */}
      <RazorpayPaymentModal
        isOpen={!!createdBookingForPayment}
        onClose={() => setCreatedBookingForPayment(null)}
        booking={createdBookingForPayment}
        onSuccess={(payment) => {
          navigate(`/customer/booking-confirmation?bookingId=${createdBookingForPayment.id}&paid=true`);
        }}
      />

    </div>
  );
}
