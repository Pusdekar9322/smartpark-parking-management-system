import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Car,
  Bike,
  Zap,
  ShieldCheck,
  QrCode,
  IndianRupee,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Form State
  const [city, setCity] = useState('Pune');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('13:00');

  useEffect(() => {
    parkingService.getLocations()
      .then((res) => {
        if (res.data) setLocations(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const startIso = `${date}T${startTime}:00`;
    const endIso = `${date}T${endTime}:00`;
    navigate(`/customer/parking?city=${encodeURIComponent(city)}&startTime=${startIso}&endTime=${endIso}&vehicleType=${vehicleType}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-brand-950 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-extrabold uppercase tracking-wider animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Smart Parking Reservation & Payment Platform 🇮🇳</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Never Circle For Parking in <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-indigo-300 to-sky-300">Pune</span> Again.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Reserve verified parking slots in advance across shopping malls, commercial hubs, and tech parks. Seamless payments with Razorpay or Pay at Counter.
          </p>

          {/* Quick Search Widget */}
          <div className="mt-8 bg-white text-slate-900 p-4 sm:p-6 rounded-3xl shadow-2xl border border-slate-100 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-left">
              
              {/* City */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  City
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="Pune">Pune, Maharashtra</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi NCR</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="CAR">Car (Sedan/Hatchback)</option>
                  <option value="BIKE">Two-Wheeler / Bike</option>
                  <option value="SUV">SUV / Large Vehicle</option>
                  <option value="EV">EV (Fast Charging)</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Time Slot
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-bold">-</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 text-[11px] font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Slots</span>
                </button>
              </div>

            </form>
          </div>

          {/* Quick stats pills */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Slot Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-400" />
              <span>Contactless QR Ticket</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              <span>Starting at ₹20/2-hrs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pune Parking Facilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>Pune Facilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Popular Smart Garages in Pune
            </h2>
          </div>
          <Link
            to="/customer/parking"
            className="mt-3 sm:mt-0 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all locations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.slice(0, 4).map((loc) => (
              <div
                key={loc.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={loc.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"}
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-700 shadow-sm">
                    {loc.availableSlots} Slots Free
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    {loc.area}, {loc.city}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between text-left">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-brand-600 transition-colors line-clamp-1">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {loc.address}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">Starting From</span>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(loc.startingPrice || 40)}
                      </span>
                    </div>

                    <Link
                      to={`/customer/parking/${loc.id}`}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <span>Book Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works Steps */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Step-By-Step Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            How SmartPark Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Seamless 4-step digital parking experience from discovery to exit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          {[
            {
              step: '01',
              title: 'Search & Pick Slot',
              desc: 'Select Pune location, date, hours, and choose compatible visual parking slot.',
              icon: Search,
              color: 'text-brand-600 bg-brand-50'
            },
            {
              step: '02',
              title: 'Pay Online or at Gate',
              desc: 'Use Razorpay test UPI/Cards with coupons or choose Cash/UPI at Parking Exit.',
              icon: IndianRupee,
              color: 'text-emerald-600 bg-emerald-50'
            },
            {
              step: '03',
              title: 'Scan QR at Entry',
              desc: 'Show digital ticket pass at entrance gate barrier for instant automated check-in.',
              icon: QrCode,
              color: 'text-indigo-600 bg-indigo-50'
            },
            {
              step: '04',
              title: 'Exit & GST Receipt',
              desc: 'Exit smoothly with duration calculated and instant GST-compliant PDF invoice.',
              icon: ShieldCheck,
              color: 'text-purple-600 bg-purple-50'
            }
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{s.step}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black">Ready to park hassle-free?</h2>
            <p className="text-xs sm:text-sm text-brand-100 leading-relaxed">
              Create an account in 30 seconds, register your vehicle, and get ₹50 off with coupon code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">PUNE50</span>.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-white text-brand-700 hover:bg-brand-50 rounded-2xl font-extrabold text-xs shadow-lg transition-transform active:scale-95"
            >
              Sign Up Now
            </Link>
            <Link
              to="/customer/parking"
              className="px-6 py-3.5 bg-brand-800/60 hover:bg-brand-800 text-white rounded-2xl font-extrabold text-xs border border-white/20 transition-colors"
            >
              Explore Parking
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
