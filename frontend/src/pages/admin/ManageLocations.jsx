import React, { useEffect, useState } from 'react';
import { parkingService } from '../../services/parkingService';
import { adminService } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatters';
import { MapPin, Plus, Edit2, Trash2, Clock, Layers, SquareParking } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('Pune');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:59');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchLocations = () => {
    setLoading(true);
    parkingService.getLocations()
      .then((res) => {
        if (res.data) setLocations(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCity('Pune');
    setArea('');
    setAddress('');
    setPincode('');
    setOpeningTime('06:00');
    setClosingTime('23:59');
    setImageUrl('');
    setShowModal(true);
  };

  const handleOpenEdit = (loc) => {
    setEditingId(loc.id);
    setName(loc.name);
    setCity(loc.city);
    setArea(loc.area || '');
    setAddress(loc.address || '');
    setPincode(loc.pincode || '');
    setOpeningTime(loc.openingTime || '06:00');
    setClosingTime(loc.closingTime || '23:59');
    setImageUrl(loc.imageUrl || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        city,
        area,
        address,
        pincode,
        openingTime,
        closingTime,
        imageUrl
      };
      if (editingId) {
        await adminService.updateLocation(editingId, payload);
      } else {
        await adminService.createLocation(payload);
      }
      setShowModal(false);
      fetchLocations();
    } catch (err) {
      alert(err.message || 'Failed to save facility.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this facility?')) return;
    try {
      await adminService.deleteLocation(id);
      fetchLocations();
    } catch (err) {
      alert(err.message || 'Failed to delete location.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parking Facilities 🏢</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage automated multi-level parking locations, hours, and addresses</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading facilities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <img
                    src={loc.imageUrl || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80"}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={loc.status} />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-base text-slate-900">{loc.name}</h3>
                  <p className="text-xs text-slate-500">{loc.address}, {loc.area}, {loc.city} - {loc.pincode}</p>

                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-600" />
                      <span>{loc.openingTime} - {loc.closingTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <SquareParking className="w-3.5 h-3.5 text-brand-600" />
                      <span>{loc.totalSlots} Slots</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-end gap-2 mt-4">
                <button
                  onClick={() => handleOpenEdit(loc)}
                  className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50"
                  title="Edit Facility"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete Facility"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Facility Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {editingId ? 'Edit Parking Facility' : 'Create Parking Facility 🇮🇳'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Phoenix Marketcity Parking"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Viman Nagar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Viman Nagar Road, Pune"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="411014"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Time</label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Closing Time</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
