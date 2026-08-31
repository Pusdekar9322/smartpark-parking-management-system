import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { vehicleService } from '../../services/vehicleService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  Car,
  CalendarCheck,
  CreditCard,
  Search,
  PlusCircle,
  QrCode,
  ArrowRight,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import QRTicketModal from '../../components/QRTicketModal';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForQr, setSelectedBookingForQr] = useState(null);

  useEffect(() => {
    Promise.all([bookingService.getMyBookings(), vehicleService.getMyVehicles()])
      .then(([bRes, vRes]) => {
        if (bRes.data) setBookings(bRes.data);
        if (vRes.data) setVehicles(vRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeBooking = bookings.find(
    (b) => b.bookingStatus === 'RESERVED' || b.bookingStatus === 'PARKED'
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Customer Portal 🇮🇳</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Namaste, {user?.fullName || 'Motorist'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Easily manage reservations, vehicles, and QR parking passes across Pune.
          </p>
        </div>

        <Link
          to="/customer/parking"
          className="px-5 py-3 bg-white hover:bg-brand-50 text-brand-900 rounded-2xl font-extrabold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2 flex-shrink-0"
        >
          <Search className="w-4 h-4 text-brand-600" />
          <span>Find & Reserve Parking</span>
        </Link>
      </div>

      {/* Active Trip Notification Widget */}
      {activeBooking && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md shadow-amber-500/20">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  Active Reservation
                </span>
                <StatusBadge status={activeBooking.bookingStatus} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {activeBooking.locationName} (Slot {activeBooking.slotNumber})
              </h3>
              <p className="text-xs text-slate-600">
                Vehicle: <strong>{activeBooking.vehicleNumber}</strong> • Schedule: {formatDateTime(activeBooking.startTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBookingForQr(activeBooking)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Show QR Ticket</span>
            </button>
            <Link
              to={`/customer/bookings/${activeBooking.id}`}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      )}

      {/* Quick Action & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Vehicles */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">My Garage</span>
              <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Car className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{vehicles.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Registered Vehicles</p>
          </div>
          <Link
            to="/customer/vehicles"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between"
          >
            <span>Manage Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Bookings</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900">{bookings.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Total Parking Sessions</p>
          </div>
          <Link
            to="/customer/bookings"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between"
          >
            <span>Booking History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Monthly Passes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Monthly Passes</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Passes</h3>
            <p className="text-xs text-slate-500 mt-1">Save up to 40% with passes</p>
          </div>
          <Link
            to="/customer/passes"
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between"
          >
            <span>View Pass Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Recent Parking Activity</h2>
            <p className="text-xs text-slate-500">Your latest parking sessions in Pune</p>
          </div>
          <Link
            to="/customer/bookings"
            className="text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No reservations created yet</p>
            <Link
              to="/customer/parking"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Reserve First Slot
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Booking No</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Vehicle</th>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="px-6 py-4 font-semibold">{b.locationName}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{b.vehicleNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDateTime(b.startTime)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(b.finalAmount || b.estimatedAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedBookingForQr(b)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-bold"
                      >
                        QR Ticket
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Ticket Modal */}
      <QRTicketModal
        isOpen={!!selectedBookingForQr}
        onClose={() => setSelectedBookingForQr(null)}
        booking={selectedBookingForQr}
      />

    </div>
  );
}
