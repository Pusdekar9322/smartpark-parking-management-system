import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  SquareParking,
  IndianRupee,
  TicketPercent,
  CalendarCheck,
  CreditCard,
  Users,
  QrCode,
  LogOut,
  Shield,
  FileText
} from 'lucide-react';

export default function Sidebar({ isSuper = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/terminal', label: 'Check-In / Out Terminal', icon: QrCode, highlight: true },
    { to: '/admin/bookings', label: 'Live Bookings', icon: CalendarCheck },
    { to: '/admin/locations', label: 'Facilities', icon: MapPin },
    { to: '/admin/floors', label: 'Floors', icon: Layers },
    { to: '/admin/slots', label: 'Slots Matrix', icon: SquareParking },
    { to: '/admin/pricing', label: 'Pricing Rules', icon: IndianRupee },
    { to: '/admin/coupons', label: 'Discount Coupons', icon: TicketPercent },
    { to: '/admin/payments', label: 'Payment Logs', icon: CreditCard },
  ];

  const superAdminLinks = [
    { to: '/super-admin/dashboard', label: 'System Dashboard', icon: LayoutDashboard },
    { to: '/super-admin/admins', label: 'Manage Parking Admins', icon: Shield, highlight: true },
    { to: '/super-admin/users', label: 'All Customers', icon: Users },
    { to: '/super-admin/locations', label: 'All Locations', icon: MapPin },
    { to: '/super-admin/bookings', label: 'Global Bookings', icon: CalendarCheck },
    { to: '/super-admin/payments', label: 'Revenue & Payments', icon: CreditCard },
    { to: '/super-admin/reports', label: 'System Reports', icon: FileText },
  ];

  const links = isSuper ? superAdminLinks : adminLinks;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col flex-shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
            {isSuper ? <Shield className="w-5 h-5" /> : <SquareParking className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base tracking-tight leading-tight">
              {isSuper ? 'SUPER ADMIN' : 'PARKING ADMIN'}
            </h2>
            <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider">
              {isSuper ? 'System Control' : 'Facility Console'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : link.highlight
                    ? 'text-emerald-400 hover:bg-slate-800/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Admin User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-3 bg-slate-800/40 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
            {user?.fullName ? user.fullName[0] : 'A'}
          </div>
          <div className="flex-1 truncate text-left">
            <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
