import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { parkingService } from '../../services/parkingService';
import { SquareParking, Plus, Wrench, Trash2, CheckCircle2, ShieldAlert } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function ManageSlots() {
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [floorId, setFloorId] = useState('');
  const [slotNumber, setSlotNumber] = useState('');
  const [slotType, setSlotType] = useState('CAR');
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

  const fetchSlots = (locId) => {
    if (!locId) return;
    setLoading(true);
    parkingService.getSlotAvailability(locId)
      .then((res) => {
        if (res.data) {
          setAvailability(res.data);
          if (res.data.floors?.length > 0 && !floorId) {
            setFloorId(res.data.floors[0].floorId);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedLocationId) fetchSlots(selectedLocationId);
  }, [selectedLocationId]);

  const handleToggleMaintenance = async (slot) => {
    const nextVal = slot.status !== 'MAINTENANCE';
    try {
      await adminService.toggleSlotMaintenance(slot.id, nextVal);
      fetchSlots(selectedLocationId);
    } catch (err) {
      alert(err.message || 'Failed to toggle maintenance mode.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this parking slot permanently?')) return;
    try {
      await adminService.deleteSlot(id);
      fetchSlots(selectedLocationId);
    } catch (err) {
      alert(err.message || 'Failed to delete slot.');
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminService.createSlot({
        floorId,
        slotNumber,
        slotType
      });
      setShowModal(false);
      setSlotNumber('');
      fetchSlots(selectedLocationId);
    } catch (err) {
      alert(err.message || 'Failed to create slot.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Slots Matrix 🅿️</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure individual slot types, numbers, and maintenance states</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
          >
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading slot layout...</div>
      ) : !availability?.floors?.length ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-500">No floors/slots found. Please add a floor first.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {availability.floors.map((floor) => (
            <div key={floor.floorId} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">{floor.floorName}</h3>
                <span className="text-xs text-slate-500 font-semibold">
                  {floor.availableSlots} of {floor.totalSlots} Slots Free
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {floor.slots?.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between h-28 text-left relative group hover:border-brand-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-500">{slot.slotType}</span>
                      <StatusBadge status={slot.status} />
                    </div>

                    <div>
                      <span className="text-sm font-black text-slate-900">{slot.slotNumber}</span>
                    </div>

                    <div className="flex items-center justify-end gap-1 pt-1 border-t border-slate-200/60">
                      <button
                        onClick={() => handleToggleMaintenance(slot)}
                        className={`p-1 rounded-lg text-xs font-bold ${
                          slot.status === 'MAINTENANCE'
                            ? 'text-emerald-600 hover:bg-emerald-50'
                            : 'text-purple-600 hover:bg-purple-50'
                        }`}
                        title={slot.status === 'MAINTENANCE' ? 'Set Active' : 'Set Maintenance'}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slot.id)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50"
                        title="Delete Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Add Parking Slot</h3>

            <form onSubmit={handleCreateSlot} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Floor</label>
                <select
                  value={floorId}
                  onChange={(e) => setFloorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                >
                  {availability?.floors?.map((f) => (
                    <option key={f.floorId} value={f.floorId}>{f.floorName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slot Identifier</label>
                <input
                  type="text"
                  value={slotNumber}
                  onChange={(e) => setSlotNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. G-C09, B1-B05"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Slot Category</label>
                <select
                  value={slotType}
                  onChange={(e) => setSlotType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="CAR">Car Slot</option>
                  <option value="BIKE">Two-Wheeler Slot</option>
                  <option value="SUV">SUV Wide Bay</option>
                  <option value="EV">EV Charging Bay</option>
                  <option value="DISABLED">Handicapped / Accessible</option>
                </select>
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
                  {submitting ? 'Creating...' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
