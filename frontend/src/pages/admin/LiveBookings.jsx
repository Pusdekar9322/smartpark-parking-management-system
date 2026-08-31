import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import QRTicketModal from '../../components/QRTicketModal';
import ReceiptModal from '../../components/ReceiptModal';
import { CalendarCheck, QrCode, FileText, Search } from 'lucide-react';

export default function LiveBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBookingForQr, setSelectedBookingForQr] = useState(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    adminService.getBookings()
      .then((res) => {
        if (res.data) setBookings(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    const matchesSearch =
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleNumber?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Bookings Live 📋</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time log of customer reservations, active parked vehicles, and completed sessions</p>
        </div>

        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold self-start sm:self-auto"
        >
          Refresh Live Feed
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'RESERVED', 'PARKED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking, customer..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Vehicle</th>
                <th className="px-6 py-3.5">Floor & Slot</th>
                <th className="px-6 py-3.5">Schedule</th>
                <th className="px-6 py-3.5">Payment</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Loading bookings...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">No bookings found.</td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400">{b.customerMobile}</p>
                    </td>
                    <td className="px-6 py-4 font-bold font-mono text-slate-800">{b.vehicleNumber}</td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-brand-600">{b.slotNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{b.floorName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDateTime(b.startTime)}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{formatCurrency(b.finalAmount || b.estimatedAmount)}</p>
                      <p className="text-[10px] text-slate-400">{b.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedBookingForQr(b)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg"
                          title="View QR"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        {b.invoiceId && (
                          <button
                            onClick={() => setSelectedInvoiceId(b.invoiceId)}
                            className="p-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg"
                            title="View Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <QRTicketModal isOpen={!!selectedBookingForQr} onClose={() => setSelectedBookingForQr(null)} booking={selectedBookingForQr} />
      <ReceiptModal isOpen={!!selectedInvoiceId} onClose={() => setSelectedInvoiceId(null)} invoiceId={selectedInvoiceId} />

    </div>
  );
}
