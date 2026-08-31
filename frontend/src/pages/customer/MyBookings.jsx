import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import QRTicketModal from '../../components/QRTicketModal';
import ReceiptModal from '../../components/ReceiptModal';
import {
  CalendarCheck,
  QrCode,
  FileText,
  Search,
  XCircle,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    bookingService.getMyBookings()
      .then((res) => {
        if (res.data) setBookings(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this parking reservation?')) return;
    try {
      await bookingService.cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Could not cancel booking.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === 'ALL' || b.bookingStatus.toUpperCase() === statusFilter;
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Bookings 🎟️</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track live reservations, download GST receipts and access digital QR passes</p>
        </div>
        <Link
          to="/customer/parking"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" />
          <span>New Reservation</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'RESERVED', 'PARKED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ref, vehicle..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>

      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading your reservations...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No bookings match your filter</h3>
          <p className="text-xs text-slate-500">Explore parking locations in Pune to book a slot.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-sm text-slate-900">{b.bookingNumber}</span>
                  <StatusBadge status={b.bookingStatus} />
                  <StatusBadge status={b.paymentStatus} />
                </div>

                <h3 className="text-base font-extrabold text-slate-800">{b.locationName}</h3>
                <p className="text-xs text-slate-500">{b.locationAddress}, {b.locationCity}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1">
                  <span>Slot: <strong className="text-brand-600">{b.slotNumber}</strong> ({b.floorName})</span>
                  <span>•</span>
                  <span>Vehicle: <strong className="font-mono">{b.vehicleNumber}</strong></span>
                  <span>•</span>
                  <span>Time: {formatDateTime(b.startTime)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount</span>
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(b.finalAmount || b.estimatedAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBookingForQr(b)}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>QR Pass</span>
                  </button>

                  {b.invoiceId && (
                    <button
                      onClick={() => setSelectedInvoiceId(b.invoiceId)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      <span>Invoice</span>
                    </button>
                  )}

                  {b.bookingStatus === 'RESERVED' && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <Link
                    to={`/customer/bookings/${b.id}`}
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Pass Modal */}
      <QRTicketModal
        isOpen={!!selectedBookingForQr}
        onClose={() => setSelectedBookingForQr(null)}
        booking={selectedBookingForQr}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedInvoiceId}
        onClose={() => setSelectedInvoiceId(null)}
        invoiceId={selectedInvoiceId}
      />

    </div>
  );
}
