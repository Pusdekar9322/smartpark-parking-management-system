import React, { useEffect, useState } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { VEHICLE_TYPES } from '../../utils/constants';
import { isValidIndianVehicleNumber } from '../../utils/formatters';
import { Car, Bike, Truck, Zap, Plus, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [color, setColor] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = () => {
    setLoading(true);
    vehicleService.getMyVehicles()
      .then((res) => {
        if (res.data) setVehicles(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setVehicleNumber('');
    setVehicleType('CAR');
    setVehicleBrand('');
    setVehicleModel('');
    setColor('');
    setFormError(null);
    setShowModal(true);
  };

  const handleOpenEdit = (v) => {
    setEditingId(v.id);
    setVehicleNumber(v.vehicleNumber);
    setVehicleType(v.vehicleType);
    setVehicleBrand(v.vehicleBrand || '');
    setVehicleModel(v.vehicleModel || '');
    setColor(v.color || '');
    setFormError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!isValidIndianVehicleNumber(vehicleNumber)) {
      setFormError('Please enter a valid Indian vehicle number (e.g. MH 12 AB 1234 or DL 01 CA 5678).');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await vehicleService.updateVehicle(editingId, {
          vehicleNumber,
          vehicleType,
          vehicleBrand,
          vehicleModel,
          color
        });
      } else {
        await vehicleService.addVehicle({
          vehicleNumber,
          vehicleType,
          vehicleBrand,
          vehicleModel,
          color
        });
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      setFormError(err.message || 'Failed to save vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      fetchVehicles();
    } catch (err) {
      alert(err.message || 'Failed to delete vehicle.');
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'BIKE':
        return <Bike className="w-6 h-6 text-emerald-600" />;
      case 'CAR':
        return <Car className="w-6 h-6 text-brand-600" />;
      case 'SUV':
        return <Truck className="w-6 h-6 text-indigo-600" />;
      case 'EV':
        return <Zap className="w-6 h-6 text-emerald-500" />;
      default:
        return <Car className="w-6 h-6 text-brand-600" />;
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Vehicles 🚗</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your registered two-wheelers and four-wheelers for fast slot booking</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Vehicle Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-slate-200 animate-pulse rounded-3xl"></div>
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No vehicles registered yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your car, bike, SUV or EV to unlock seamless booking and monthly parking passes.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    {getVehicleIcon(v.vehicleType)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase">
                    {v.vehicleType}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 tracking-wider font-mono">
                  {v.vehicleNumber}
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-1">
                  {v.vehicleBrand ? `${v.vehicleBrand} ${v.vehicleModel || ''}` : 'Vehicle Details'}
                </p>
                {v.color && (
                  <p className="text-[11px] text-slate-400 mt-0.5">Color: {v.color}</p>
                )}
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                  title="Edit Vehicle"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Vehicle"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? 'Edit Vehicle' : 'Register New Vehicle 🇮🇳'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Number (Indian Format)</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. MH 12 AB 1234"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="CAR">Car (Hatchback / Sedan)</option>
                  <option value="BIKE">Two-Wheeler / Bike</option>
                  <option value="SUV">SUV / Large Vehicle</option>
                  <option value="EV">EV (Electric Vehicle)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    placeholder="e.g. Tata, Honda"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. Nexon, Activa"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Teal Blue, Pearl White"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
