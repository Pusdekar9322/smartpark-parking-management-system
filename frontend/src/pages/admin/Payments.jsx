import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../../components/StatusBadge';
import { CreditCard, IndianRupee, Search } from 'lucide-react';

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPayments = () => {
    setLoading(true);
    adminService.getPayments()
      .then((res) => {
        if (res.data) setPayments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    return (
      p.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payments & Receipts 💳</h1>
          <p className="text-xs text-slate-500 mt-0.5">Audit log of online Razorpay transactions and on-counter collections</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search txn ID, booking..."
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
                <th className="px-6 py-3.5">Txn Reference</th>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Paid At</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Loading payment ledger...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No payment records found.</td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">{p.transactionId}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{p.bookingNumber}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{p.customerName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{formatDateTime(p.paymentDate || p.createdAt)}</td>
                    <td className="px-6 py-4 font-black text-slate-900">{formatCurrency(p.amount)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
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
