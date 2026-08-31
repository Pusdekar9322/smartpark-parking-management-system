import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toUpperCase();

  const config = {
    // Booking Statuses
    RESERVED: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Reserved' },
    CHECKED_IN: { bg: 'bg-sky-50 text-sky-700 border-sky-200', label: 'Checked In' },
    PARKED: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Parked' },
    COMPLETED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' },
    CANCELLED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Cancelled' },
    EXPIRED: { bg: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Expired' },

    // Slot / Facility Statuses
    AVAILABLE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Available' },
    OCCUPIED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Occupied' },
    MAINTENANCE: { bg: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Maintenance' },
    ACTIVE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Active' },
    INACTIVE: { bg: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Inactive' },

    // Payment Statuses
    SUCCESS: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Paid' },
    PENDING: { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' },
    FAILED: { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Failed' },
    REFUNDED: { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Refunded' }
  };

  const current = config[normalized] || { bg: 'bg-slate-100 text-slate-700 border-slate-200', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${current.bg}`}>
      {current.label}
    </span>
  );
}
