import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { formatCurrency } from '../../utils/formatters';
import SlotGrid from '../../components/SlotGrid';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Car,
  Bike,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function ParkingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Time & Vehicle Filters for interactive slot map
  const [selectedVehicleType, setSelectedVehicleType] = useState('CAR');
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      parkingService.getLocationById(id),
      parkingService.getSlotAvailability(id, { vehicleType: selectedVehicleType }),
      parkingService.getPricingRules()
    ])
      .then(([locRes, availRes, priceRes]) => {
        if (locRes.data) setLocation(locRes.data);
        if (availRes.data) setAvailability(availRes.data);
        if (priceRes.data) setPricingRules(priceRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, selectedVehicleType]);

  const handleProceedToBooking = () => {
    if (!selectedSlot) {
      alert('Please select an available parking slot from the layout below.');
      return;
    }
    navigate(`/customer/booking?locationId=${id}&slotId=${selectedSlot.id}&vehicleType=${selectedVehicleType}`);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!location) {
    return <div className="p-12 text-center text-slate-500">Location not found.</div>;
  }

  return (
    <div className="space-y-8 text-left">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 bg-slate-900 overflow-hidden">
          <img
            src={location.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80"}
            alt={location.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                  {location.status}
                </span>
                <span className="text-xs text-slate-300">
                  {availability?.totalAvailableForTime || location.availableSlots} of {location.totalSlots} Slots Available
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">{location.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{location.address}, {location.area}, {location.city} - {location.pincode}</span>
              </p>
            </div>

            <button
              onClick={handleProceedToBooking}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-600/30 flex items-center gap-2 flex-shrink-0 transition-transform active:scale-95"
            >
              <span>Book Selected Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Overview Bar */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Operating Hours</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-brand-600" />
              <span>{location.openingTime} – {location.closingTime}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Multi-Level Floors</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{location.totalFloors} Covered Levels</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Payment Gateways</span>
            <span className="font-bold text-emerald-600 mt-0.5 block">Razorpay & Pay at Counter</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Security</span>
            <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>24/7 CCTV & Automated Gates</span>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Table & Vehicle Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Tariff Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900">Standard Parking Tariff 🇮🇳</h2>
          <div className="space-y-3">
            {pricingRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{rule.vehicleType}</span>
                  <p className="text-[10px] text-slate-400">First {rule.baseHours} hrs included</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-brand-600">{formatCurrency(rule.basePrice)}</span>
                  <p className="text-[10px] text-slate-500">+{formatCurrency(rule.extraHourPrice)}/extra hr</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Slot Layout Selector */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Select Your Parking Slot</h2>
              <p className="text-xs text-slate-500">Choose a compatible slot for your vehicle type</p>
            </div>

            {/* Vehicle Type Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {['CAR', 'BIKE', 'SUV', 'EV'].map((vt) => (
                <button
                  key={vt}
                  type="button"
                  onClick={() => {
                    setSelectedVehicleType(vt);
                    setSelectedSlot(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedVehicleType === vt
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {vt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Slot Grid */}
          <SlotGrid
            floors={availability?.floors || []}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
            selectedVehicleType={selectedVehicleType}
          />

          {selectedSlot && (
            <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-brand-600">Selected Slot</span>
                <p className="text-sm font-black text-brand-900">
                  {selectedSlot.slotNumber} ({selectedSlot.floorName})
                </p>
              </div>
              <button
                onClick={handleProceedToBooking}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-500/20"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
