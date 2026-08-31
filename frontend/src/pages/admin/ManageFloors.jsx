import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { parkingService } from '../../services/parkingService';
import { Layers, Plus, Edit2, Trash2, Building2 } from 'lucide-react';

export default function ManageFloors() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [floorNumber, setFloorNumber] = useState(0);
  const [floorName, setFloorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    parkingService.getLocations()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setLocations(res.data);
          setSelectedLocationId(res.data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchFloorAvailability = (locId) => {
    if (!locId) return;
    setLoading(true);
    parkingService.getSlotAvailability(locId)
      .then((res) => {
        if (res.data?.floors) {
          setFloors(res.data.floors);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedLocationId) {
      fetchFloorAvailability(selectedLocationId);
    }
  }, [selectedLocationId]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFloorNumber(floors.length);
    setFloorName(`Floor ${floors.length}`);
    setShowModal(true);
  };

  const handleOpenEdit = (f) => {
    setEditingId(f.floorId);
    setFloorNumber(f.floorNumber || 0);
    setFloorName(f.floorName || '');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await adminService.updateFloor(editingId, {
          floorNumber: parseInt(floorNumber),
          floorName
        });
      } else {
        await adminService.createFloor({
          parkingLocationId: selectedLocationId,
          floorNumber: parseInt(floorNumber),
          floorName
        });
      }
      setShowModal(false);
      fetchFloorAvailability(selectedLocationId);
    } catch (err) {
      alert(err.message || 'Failed to save floor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this floor and all associated slots?')) return;
    try {
      await adminService.deleteFloor(id);
      fetchFloorAvailability(selectedLocationId);
    } catch (err) {
      alert(err.message || 'Failed to delete floor.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Floors 📶</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage multi-level floor layout for chosen facility</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
            ))}
          </select>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Level</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading floors...</div>
      ) : floors.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-500">No floors added to this facility yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {floors.map((f) => (
            <div
              key={f.floorId}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                    Level {f.floorNumber}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{f.floorName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {f.totalSlots} Slots ({f.availableSlots} Available)
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(f)}
                  className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(f.floorId)}
                  className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">
              {editingId ? 'Edit Level' : 'Add Parking Floor'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Floor Level Number (e.g. 0 for Ground, 1 for 1st)</label>
                <input
                  type="number"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Floor Display Name</label>
                <input
                  type="text"
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  placeholder="e.g. Ground Floor, Basement B1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Floor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
