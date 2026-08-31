import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { Shield, Plus, Mail, Phone, CheckCircle2, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('Admin@123');
  const [locationId, setLocationId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    Promise.all([superAdminService.getAllAdmins(), superAdminService.getAllLocations()])
      .then(([aRes, lRes]) => {
        if (aRes.data) setAdmins(aRes.data);
        if (lRes.data) {
          setLocations(lRes.data);
          if (lRes.data.length > 0) setLocationId(lRes.data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await superAdminService.createParkingAdmin({
        fullName,
        email,
        mobileNumber,
        password,
        locationId
      });
      setShowModal(false);
      setFullName('');
      setEmail('');
      setMobileNumber('');
      fetchAdmins();
    } catch (err) {
      alert(err.message || 'Failed to create Parking Admin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facility Administrators 🛡️</h1>
          <p className="text-xs text-slate-500 mt-0.5">Provision and supervise local parking facility operators across India</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-brand-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Facility Admin</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Admin Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Mobile</th>
                <th className="px-6 py-3.5">Assigned Facility</th>
                <th className="px-6 py-3.5">Created At</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">Loading administrators...</td>
                </tr>
              ) : (
                admins.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{a.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">{a.email}</td>
                    <td className="px-6 py-4 font-mono">{a.mobileNumber}</td>
                    <td className="px-6 py-4 font-bold text-brand-600">{a.locationName || 'All Pune'}</td>
                    <td className="px-6 py-4 text-slate-400">{formatDateTime(a.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-4 animate-in zoom-in-95">
            <h3 className="text-base font-black text-slate-900">Provision Parking Facility Admin</h3>

            <form onSubmit={handleCreateAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin.hinjewadi@smartpark.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Indian Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assign Parking Facility</label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold bg-slate-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.name} ({l.city})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Temporary Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Provision Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
