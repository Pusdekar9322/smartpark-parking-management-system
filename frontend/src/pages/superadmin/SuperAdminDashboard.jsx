import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatCurrency } from '../../utils/formatters';
import StatCard from '../../components/StatCard';
import {
  Shield,
  Building2,
  Users,
  CalendarCheck,
  IndianRupee,
  SquareParking,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superAdminService.getDashboardStats()
      .then((res) => {
        if (res.data) setStats(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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
      
      {/* Super Admin Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-brand-950 p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-extrabold uppercase tracking-wider">
            <span>Enterprise System Governance 🇮🇳</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SmartPark Platform Super Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Multi-facility telemetry, revenue auditing, parking admin provisioning and motorist accounts.
          </p>
        </div>

        <Link
          to="/super-admin/admins"
          className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-brand-500/20 flex items-center gap-2 flex-shrink-0"
        >
          <Shield className="w-4 h-4" />
          <span>Provision Parking Admin</span>
        </Link>
      </div>

      {/* Global KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Facilities"
          value={stats?.totalLocations || 0}
          subtitle={`${stats?.totalSlots || 0} Total Slots Hosted`}
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Registered Motorists"
          value={stats?.totalUsers || 0}
          subtitle={`${stats?.totalAdmins || 0} Facility Admins`}
          icon={Users}
          color="sky"
        />
        <StatCard
          title="System Bookings"
          value={stats?.totalBookings || 0}
          subtitle="All Pune Locations"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Total Gross Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          subtitle="Platform Wide Collection"
          icon={IndianRupee}
          color="emerald"
        />
      </div>

      {/* Facility Revenue & Occupancy Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Facilities Telemetry & Collections</h2>
            <p className="text-xs text-slate-500">Live operational snapshot by parking facility</p>
          </div>
          <Link
            to="/super-admin/locations"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Facility Name</th>
                <th className="px-6 py-3.5">City / Area</th>
                <th className="px-6 py-3.5">Slots Capacity</th>
                <th className="px-6 py-3.5">Bookings</th>
                <th className="px-6 py-3.5">Gross Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {stats?.facilityBreakdown?.length > 0 ? (
                stats.facilityBreakdown.map((f) => (
                  <tr key={f.locationId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{f.locationName}</td>
                    <td className="px-6 py-4 text-slate-500">{f.city}</td>
                    <td className="px-6 py-4 font-extrabold text-brand-600">{f.totalSlots} Slots</td>
                    <td className="px-6 py-4 font-semibold">{f.totalBookings}</td>
                    <td className="px-6 py-4 font-black text-slate-900">{formatCurrency(f.revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No facility data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
