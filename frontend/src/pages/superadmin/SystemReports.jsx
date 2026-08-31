import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatCurrency } from '../../utils/formatters';
import { FileText, Download, Printer, BarChart3, PieChart } from 'lucide-react';

export default function SystemReports() {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Utilization Reports 📊</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit, occupancy rates, and financial reports</p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Report</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Pune Smart Parking Network Telemetry</h2>
            <p className="text-xs text-slate-500">Consolidated Operational Matrix</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            Generated: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Facilities</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{stats?.totalLocations || 4}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase">Total System Slots</span>
            <p className="text-2xl font-black text-brand-600 mt-1">{stats?.totalSlots || 0}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Gross Realization</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(stats?.totalRevenue || 0)}</p>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3">Facility Breakdown Table</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-bold text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Facility</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Slots</th>
                  <th className="p-3.5">Total Bookings</th>
                  <th className="p-3.5">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {stats?.facilityBreakdown?.map((f) => (
                  <tr key={f.locationId} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{f.locationName}</td>
                    <td className="p-3.5">{f.city}</td>
                    <td className="p-3.5 font-bold text-brand-600">{f.totalSlots}</td>
                    <td className="p-3.5">{f.totalBookings}</td>
                    <td className="p-3.5 font-black text-slate-900">{formatCurrency(f.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
