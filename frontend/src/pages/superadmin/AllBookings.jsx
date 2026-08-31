import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import { CalendarCheck, Search } from 'lucide-react';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    superAdminService.getAllBookings()
      .then((res) => {
        if (res.data) setBookings(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = bookings.filter((b) => {
    return (
      b.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.locationName?.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicleNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Global Reservations History 🌐</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit log of all motorist bookings across the SmartPark platform</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking, user, vehicle..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-6 py-3.5">Facility</th>
                <th className="px-6 py-3.5">Customer & Contact</th>
                <th className="px-6 py-3.5">Vehicle</th>
                <th className="px-6 py-3.5">Slot</th>
                <th className="px-6 py-3.5">Time Interval</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">Loading global bookings...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400">No records found.</td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{b.locationName}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.customerMobile}</p>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{b.vehicleNumber}</td>
                    <td className="px-6 py-4 font-bold text-brand-600">{b.slotNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDateTime(b.startTime)}</td>
                    <td className="px-6 py-4 font-black text-slate-900">{formatCurrency(b.finalAmount || b.estimatedAmount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
