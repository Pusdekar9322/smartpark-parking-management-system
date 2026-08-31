import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { IndianRupee, TrendingUp, CreditCard, ShieldCheck } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function SystemRevenue() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    superAdminService.getAllPayments()
      .then((res) => {
        if (res.data) setPayments(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalCollected = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const onlineCollected = payments
    .filter((p) => p.status === 'SUCCESS' && p.paymentMethod.startsWith('ONLINE'))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const counterCollected = payments
    .filter((p) => p.status === 'SUCCESS' && !p.paymentMethod.startsWith('ONLINE'))
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-8 text-left">
      
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Analytics 💳</h1>
        <p className="text-xs text-slate-500 mt-0.5">Platform collections ledger, Razorpay sandbox settlements and counter cash flow</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue Collected</span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{formatCurrency(totalCollected)}</h2>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Platform Gross Collection</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Online UPI & Cards (Razorpay)</span>
          <h2 className="text-3xl font-black text-blue-600 mt-1">{formatCurrency(onlineCollected)}</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">Instant Sandbox Settlements</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Pay at Parking Counter</span>
          <h2 className="text-3xl font-black text-brand-600 mt-1">{formatCurrency(counterCollected)}</h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">On-Gate Barrier Collections</p>
        </div>
      </div>

      {/* Payment Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-base">Global Transaction Audit Feed</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Txn ID</th>
                <th className="px-6 py-3.5">Booking Ref</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Loading ledger...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No payment transactions.</td>
                </tr>
              ) : (
                payments.map((p) => (
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
