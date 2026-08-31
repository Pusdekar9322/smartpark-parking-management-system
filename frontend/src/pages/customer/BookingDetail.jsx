import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import QRTicketModal from '../../components/QRTicketModal';
import ReceiptModal from '../../components/ReceiptModal';
import {
  CalendarCheck,
  QrCode,
  FileText,
  MapPin,
  Car,
  Clock,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQr, setShowQr] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    bookingService.getBookingById(id)
      .then((res) => {
        if (res.data) setBooking(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return <div className="p-12 text-center text-slate-500">Booking not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      
      <Link
        to="/customer/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Bookings</span>
      </Link>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 font-mono">{booking.bookingNumber}</h1>
              <StatusBadge status={booking.bookingStatus} />
              <StatusBadge status={booking.paymentStatus} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Created on {formatDateTime(booking.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQr(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Ticket</span>
            </button>

            {booking.invoiceId && (
              <button
                onClick={() => setShowReceipt(true)}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>GST Receipt</span>
              </button>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Facility & Slot</h3>
            <p className="text-sm font-bold text-slate-800">{booking.locationName}</p>
            <p className="text-slate-500">{booking.locationAddress}</p>
            <div className="pt-2 border-t border-slate-200 flex justify-between">
              <span className="text-slate-500">Assigned Slot:</span>
              <span className="font-extrabold text-brand-600">{booking.slotNumber} ({booking.floorName})</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Vehicle & User</h3>
            <p className="text-sm font-bold font-mono text-slate-800">{booking.vehicleNumber}</p>
            <p className="text-slate-500">Category: {booking.vehicleType}</p>
            <div className="pt-2 border-t border-slate-200 flex justify-between">
              <span className="text-slate-500">Customer:</span>
              <span className="font-bold text-slate-800">{booking.customerName}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl space-y-2 col-span-1 sm:col-span-2">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">Schedule & Timestamps</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Scheduled Start</span>
                <span className="font-bold text-slate-800">{formatDateTime(booking.startTime)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Scheduled End</span>
                <span className="font-bold text-slate-800">{formatDateTime(booking.endTime)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Actual Entry</span>
                <span className="font-bold text-emerald-600">{formatDateTime(booking.actualEntryTime) || 'Pending'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Actual Exit</span>
                <span className="font-bold text-slate-800">{formatDateTime(booking.actualExitTime) || 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Payment Mode</span>
            <p className="font-bold text-slate-800 text-xs">{booking.paymentMethod}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-500">Total Billed</span>
            <p className="text-2xl font-black text-brand-600">{formatCurrency(booking.finalAmount || booking.estimatedAmount)}</p>
          </div>
        </div>

      </div>

      <QRTicketModal isOpen={showQr} onClose={() => setShowQr(false)} booking={booking} />
      <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} invoiceId={booking.invoiceId} />

    </div>
  );
}
