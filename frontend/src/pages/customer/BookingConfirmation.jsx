import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  CheckCircle2,
  QrCode,
  FileText,
  MapPin,
  Calendar,
  Car,
  Printer,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import StatusBadge from '../../components/StatusBadge';
import QRTicketModal from '../../components/QRTicketModal';
import ReceiptModal from '../../components/ReceiptModal';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    if (!bookingId) return;

    bookingService.getBookingById(bookingId)
      .then((res) => {
        if (res.data) {
          setBooking(res.data);
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.5 }
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return <div className="p-12 text-center text-slate-500">Booking reference not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-left py-4">
      
      {/* Confirmation Card */}
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
            Booking Confirmed 🇮🇳
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Your Parking Slot is Reserved!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Booking Reference:{' '}
            <span className="font-mono font-bold text-slate-900">{booking.bookingNumber}</span>
          </p>
        </div>

        {/* Ticket Box */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Parking Facility</p>
              <h3 className="text-sm font-extrabold text-slate-900">{booking.locationName}</h3>
              <p className="text-[11px] text-slate-500">{booking.locationAddress}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Reserved Slot</p>
              <p className="text-xl font-black text-brand-600">{booking.slotNumber}</p>
              <p className="text-[10px] text-slate-500 font-semibold">{booking.floorName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Vehicle Number</p>
              <p className="font-bold text-slate-800 font-mono text-sm">{booking.vehicleNumber}</p>
              <p className="text-[10px] text-slate-500 uppercase">{booking.vehicleType}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Payment Status</p>
              <div className="mt-1">
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Time Schedule</p>
              <p className="font-semibold text-slate-800 text-xs mt-0.5">
                {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>View QR Ticket Pass</span>
          </button>

          <Link
            to="/customer/bookings"
            className="py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>My Bookings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* QR Ticket Modal */}
      <QRTicketModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        booking={booking}
      />

    </div>
  );
}
