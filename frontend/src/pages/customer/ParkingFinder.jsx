import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { parkingService } from '../../services/parkingService';
import { formatCurrency } from '../../utils/formatters';
import {
  Search,
  MapPin,
  Clock,
  Car,
  Bike,
  Truck,
  Zap,
  ArrowRight,
  Filter
} from 'lucide-react';

export default function ParkingFinder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const cityParam = searchParams.get('city') || 'Pune';
  const vehicleTypeParam = searchParams.get('vehicleType') || 'CAR';
  const startTimeParam = searchParams.get('startTime') || '';
  const endTimeParam = searchParams.get('endTime') || '';

  const [city, setCity] = useState(cityParam);
  const [vehicleType, setVehicleType] = useState(vehicleTypeParam);

  const fetchLocations = () => {
    setLoading(true);
    const params = {
      city: city || undefined,
      vehicleType: vehicleType || undefined,
      startTime: startTimeParam || undefined,
      endTime: endTimeParam || undefined
    };

    parkingService.getLocations(params)
      .then((res) => {
        if (res.data) setLocations(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, [searchParams]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      city,
      vehicleType,
      ...(startTimeParam && { startTime: startTimeParam }),
      ...(endTimeParam && { endTime: endTimeParam })
    });
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Find Parking Facilities 📍
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Browse verified automated parking lots with live space availability in {city}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">City</label>
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

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Vehicle Category</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="CAR">Car</option>
              <option value="BIKE">Two-Wheeler</option>
              <option value="SUV">SUV</option>
              <option value="EV">EV (Electric)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No parking facilities found in {city}</h3>
          <p className="text-xs text-slate-500">Try switching to Pune for available demo facilities.</p>
          <button
            onClick={() => {
              setCity('Pune');
              setSearchParams({ city: 'Pune' });
            }}
            className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            Show Pune Parking
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img
                    src={loc.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"}
                    alt={loc.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black text-emerald-700 shadow-sm">
                    {loc.availableSlots} Free
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    {loc.area}, {loc.city}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{loc.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{loc.address}</p>
                  
                  <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{loc.openingTime} - {loc.closingTime}</span>
                    </span>
                    <span>•</span>
                    <span>{loc.totalFloors} Multi-Levels</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 mt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Rate from</span>
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(loc.startingPrice || 40)}
                  </span>
                </div>

                <Link
                  to={`/customer/parking/${loc.id}`}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
                >
                  <span>Select Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
