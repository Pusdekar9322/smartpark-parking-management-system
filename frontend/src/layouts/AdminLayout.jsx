import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import QRScannerTerminalModal from '../components/QRScannerTerminalModal';
import { QrCode, Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user } = useAuth();
  const [showTerminal, setShowTerminal] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar isSuper={false} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTerminal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <QrCode className="w-4 h-4" />
              <span>Gate Terminal (Scan QR)</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
              <p className="text-[10px] text-brand-600 font-semibold uppercase">Parking Facility Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {user?.fullName ? user.fullName[0] : 'A'}
            </div>
          </div>
        </header>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full">
          <Outlet />
        </main>
      </div>

      {/* Terminal Modal for Gate Check-In/Out */}
      <QRScannerTerminalModal
        isOpen={showTerminal}
        onClose={() => setShowTerminal(false)}
        onRefresh={() => window.location.reload()}
      />
    </div>
  );
}
