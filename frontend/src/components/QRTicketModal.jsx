import React from 'react';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { Car, MapPin, Calendar, Clock, Download, Printer, QrCode } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function QRTicketModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Header Ticket Band */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-900 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-base font-bold"
          >
            ✕
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-extrabold uppercase tracking-widest text-brand-300 mb-2">
            SmartPark Digital Pass 🇮🇳
          </div>
          <h3 className="text-xl font-black">{booking.locationName}</h3>
          <p className="text-xs text-slate-300 mt-0.5">{booking.locationArea}, {booking.locationCity}</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-5 text-left">
          
          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            {booking.qrCodeBase64 ? (
              <img
                src={booking.qrCodeBase64}
                alt="QR Code"
                className="w-44 h-44 object-contain rounded-xl shadow-sm bg-white p-2"
              />
            ) : (
              <div className="w-44 h-44 bg-slate-200 flex items-center justify-center rounded-xl">
                <QrCode className="w-16 h-16 text-slate-400" />
              </div>
            )}
            <p className="text-xs font-mono font-bold text-slate-800 mt-2.5 tracking-wider">
              {booking.bookingNumber}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">Scan at Parking Entry / Exit Barrier</p>
          </div>

          {/* Booking Meta Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Slot</span>
              <p className="text-base font-black text-brand-600 mt-0.5">{booking.slotNumber}</p>
              <p className="text-[10px] text-slate-500 font-medium">{booking.floorName}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicle</span>
              <p className="text-sm font-extrabold text-slate-800 mt-0.5">{booking.vehicleNumber}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase">{booking.vehicleType}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl col-span-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Reservation Schedule</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                {formatDateTime(booking.startTime)}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                To: {formatDateTime(booking.endTime)}
              </p>
            </div>
          </div>

          {/* Status & Amount */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <div className="mt-0.5">
                <StatusBadge status={booking.bookingStatus} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Total</span>
              <span className="text-base font-black text-slate-900">
                {formatCurrency(booking.finalAmount || booking.estimatedAmount)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center transition-colors"
            >
              Done
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
