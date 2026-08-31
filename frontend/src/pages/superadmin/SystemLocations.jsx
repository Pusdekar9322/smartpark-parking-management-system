import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatCurrency } from '../../utils/formatters';
import { MapPin, Building2, SquareParking, Clock } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function SystemLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superAdminService.getAllLocations()
      .then((res) => {
        if (res.data) setLocations(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-left">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">All System Facilities 📍</h1>
        <p className="text-xs text-slate-500 mt-0.5">Enterprise network of automated smart parking facilities</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Facility</th>
                <th className="px-6 py-3.5">City / State</th>
                <th className="px-6 py-3.5">Total Levels</th>
                <th className="px-6 py-3.5">Capacity</th>
                <th className="px-6 py-3.5">Hours</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Loading system facilities...</td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{loc.name}</p>
                      <p className="text-[11px] text-slate-500">{loc.address}, {loc.area}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{loc.city}, Maharashtra</td>
                    <td className="px-6 py-4 font-bold">{loc.totalFloors} Floors</td>
                    <td className="px-6 py-4 font-black text-brand-600">{loc.totalSlots} Slots</td>
                    <td className="px-6 py-4 text-slate-500">{loc.openingTime} - {loc.closingTime}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loc.status} />
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
