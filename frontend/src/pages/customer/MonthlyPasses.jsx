import React, { useEffect, useState } from 'react';
import { passService } from '../../services/passService';
import { vehicleService } from '../../services/vehicleService';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Bike, Car, Truck, AlertCircle, Ban, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import StatusBadge from '../../components/StatusBadge';

export default function MonthlyPasses() {
  const [passes, setPasses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const { showToast, refreshNotifications } = useNotification();

  const plans = [
    {
      type: 'BIKE',
      title: 'Two-Wheeler Monthly Pass',
      price: 800,
      icon: Bike,
      features: ['Unlimited 30-day parking', 'Priority two-wheeler bays', 'Contactless QR gate entry', 'Zero surge pricing'],
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700'
    },
    {
      type: 'CAR',
      title: 'Four-Wheeler / Car Pass',
      price: 2000,
      icon: Car,
      popular: true,
      features: ['Unlimited 30-day parking', 'Dedicated covered parking floor', 'Contactless fast QR entry', 'Automated GST billing'],
      color: 'border-brand-300 bg-brand-50/50 text-brand-700'
    },
    {
      type: 'SUV',
      title: 'SUV & Premium Pass',
      price: 2500,
      icon: Truck,
      features: ['Unlimited 30-day parking', 'Spacious wide-bay slots', 'Multi-floor access in Pune', '24/7 security & CCTV'],
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700'
    },
    {
      type: 'EV',
      title: 'EV Fast-Charge Pass',
      price: 1800,
      icon: Zap,
      features: ['Unlimited 30-day parking', 'Dedicated EV charging bays', 'Priority charging access', 'Zero weekend surge'],
      color: 'border-purple-200 bg-purple-50/40 text-purple-700'
    }
  ];

  const fetchPasses = () => {
    setLoading(true);
    Promise.all([passService.getMyPasses(), vehicleService.getMyVehicles()])
      .then(([pRes, vRes]) => {
        if (pRes.data) setPasses(pRes.data);
        if (vRes.data) {
          setVehicles(vRes.data);
          if (vRes.data.length > 0 && !selectedVehicleId) {
            setSelectedVehicleId(vRes.data[0].id);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch passes/vehicles:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handlePurchase = async (plan) => {
    if (!selectedVehicleId) {
      alert('Please add a vehicle first.');
      return;
    }

    setPurchasing(true);
    try {
      await passService.purchasePass({
        vehicleId: selectedVehicleId,
        planName: plan.title,
        vehicleType: plan.type
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast(`${plan.title} activated successfully!`, 'success');
      if (refreshNotifications) refreshNotifications();
      fetchPasses();
    } catch (err) {
      alert(err.message || 'Failed to purchase pass.');
    } finally {
      setPurchasing(false);
    }
  };

  const handleCancelPass = async (pass) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel your ${pass.planName} for ${pass.vehicleNumber}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setCancellingId(pass.id);
    try {
      await passService.cancelPass(pass.id);
      showToast('Monthly subscription pass cancelled successfully.', 'success');
      if (refreshNotifications) refreshNotifications();
      fetchPasses();
    } catch (err) {
      alert(err.message || 'Failed to cancel pass.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-10 text-left">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase text-brand-600 tracking-wider">Subscription Parking</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
          Monthly Parking Passes 🎟️
        </h1>
        <p className="text-xs text-slate-500">
          Save up to 40% with unlimited 30-day smart parking passes across all Pune locations.
        </p>
      </div>

      {/* Passes List Section */}
      {passes.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">Your Subscription Passes</h2>
            <span className="text-xs text-slate-500 font-medium">
              {passes.filter(p => p.status === 'ACTIVE').length} Active
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {passes.map((p) => {
              const isActive = p.status === 'ACTIVE';
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl flex flex-col justify-between shadow-lg transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 border border-slate-200 shadow-none'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          isActive ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {p.vehicleType}
                        </span>
                        <StatusBadge status={p.status} />
                      </div>
                      <h3 className={`font-extrabold text-sm ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {p.planName}
                      </h3>
                      <p className={`text-xs font-mono font-bold mt-1 ${isActive ? 'text-brand-300' : 'text-slate-700'}`}>
                        {p.vehicleNumber}
                      </p>
                      <p className={`text-[11px] mt-1.5 ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                        Valid: {formatDate(p.startDate)} – {formatDate(p.endDate)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-base font-black ${isActive ? 'text-emerald-400' : 'text-slate-900'}`}>
                        {formatCurrency(p.price)}
                      </span>
                      <p className={`text-[10px] ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>30-Day Plan</p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  {isActive && (
                    <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Cancel anytime before expiry</span>
                      <button
                        type="button"
                        disabled={cancellingId === p.id}
                        onClick={() => handleCancelPass(p)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{cancellingId === p.id ? 'Cancelling...' : 'Cancel Subscription'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Select Vehicle Before Purchase */}
      {vehicles.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800">Select Vehicle for Monthly Pass</label>
            <p className="text-[11px] text-slate-500">The pass will be linked to your vehicle number</p>
          </div>
          <select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.vehicleNumber} ({v.vehicleBrand} - {v.vehicleType})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.type}
              className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between shadow-sm relative transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase rounded-full shadow-sm">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${plan.color}`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{plan.title}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{formatCurrency(plan.price)}</span>
                    <span className="text-xs text-slate-500">/ month</span>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-4">
                <button
                  type="button"
                  disabled={purchasing || vehicles.length === 0}
                  onClick={() => handlePurchase(plan)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                    plan.popular
                      ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {purchasing ? 'Activating...' : `Buy ${plan.type} Pass`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
