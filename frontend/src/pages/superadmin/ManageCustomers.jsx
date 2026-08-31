import React, { useEffect, useState } from 'react';
import { superAdminService } from '../../services/superAdminService';
import { formatDateTime } from '../../utils/formatters';
import { Users, Search, UserCheck, UserX, Shield } from 'lucide-react';

export default function ManageCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    superAdminService.getAllUsers()
      .then((res) => {
        if (res.data) setUsers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    if (!window.confirm(`Are you sure you want to ${user.active ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await superAdminService.toggleUserStatus(user.id);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  const filtered = users.filter((u) => {
    return (
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.mobileNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 text-left">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Registered Motorists 👥</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer profiles, security status, and account activations</p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, mobile..."
            className="w-full px-3.5 py-2 pl-9 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Mobile</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Joined Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Loading motorists...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No users found.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{u.fullName}</td>
                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                    <td className="px-6 py-4 font-mono">{u.mobileNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{formatDateTime(u.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {u.active ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'ROLE_SUPER_ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold ${
                            u.active
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
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
