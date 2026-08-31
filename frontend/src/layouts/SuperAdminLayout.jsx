import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminLayout() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isSuper={true} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Super Admin Topbar */}
        <header className="bg-slate-900 text-white border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-[10px] font-extrabold uppercase tracking-wider">
              Super Admin Mode 🇮🇳
            </span>
            <span className="text-xs text-slate-400 font-medium">All Multi-City Parking Facilities</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{user?.fullName}</p>
              <p className="text-[10px] text-brand-400 font-semibold uppercase">Platform Administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
              {user?.fullName ? user.fullName[0] : 'S'}
            </div>
          </div>
        </header>

        {/* Super Admin Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
