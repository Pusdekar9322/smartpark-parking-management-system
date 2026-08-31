import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import QRScannerTerminalModal from '../../components/QRScannerTerminalModal';
import {
  SquareParking,
  IndianRupee,
  CalendarCheck,
  Percent,
  QrCode,
  ArrowRight,
  TrendingUp,
  Clock,
  Car
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);

  const fetchStats = () => {
    setLoading(true);
    adminService.getDashboardStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner with Quick Terminal Action */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Live Facility Terminal 🇮🇳</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Pune Central Parking Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time occupancy monitoring, gate barrier operations, and automated billing.
          </p>
        </div>

        <button
          onClick={() => setShowTerminal(true)}
          className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 flex-shrink-0 transition-transform active:scale-95"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Gate Scanner Terminal</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Slots"
          value={stats?.totalSlots || 0}
          subtitle={`${stats?.availableSlots || 0} currently free`}
          icon={SquareParking}
          color="indigo"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          subtitle={`${stats?.activeParkings || 0} vehicles parked now`}
          icon={Percent}
          color="amber"
        />
        <StatCard
          title="Today's Bookings"
          value={stats?.todayBookingsCount || 0}
          subtitle="New online & gate entries"
          icon={CalendarCheck}
          color="sky"
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats?.todayRevenue || 0)}
          subtitle="Online UPI + Counter Cash"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Live Vehicle Sessions</h2>
            <p className="text-xs text-slate-500">Recent check-ins and active parking slots</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-6 py-3.5">Customer & Vehicle</th>
                <th className="px-6 py-3.5">Floor & Slot</th>
                <th className="px-6 py-3.5">Entry Schedule</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {stats?.recentBookings?.length > 0 ? (
                stats.recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{b.vehicleNumber} ({b.vehicleType})</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-brand-600">{b.slotNumber}</span>
                      <span className="text-slate-400 block text-[11px]">{b.floorName}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{formatDateTime(b.startTime)}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {formatCurrency(b.finalAmount || b.estimatedAmount)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={b.bookingStatus} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No active sessions recorded yet today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Modal */}
      <QRScannerTerminalModal
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
        onRefresh={fetchStats}
      />

    </div>
  );
}
