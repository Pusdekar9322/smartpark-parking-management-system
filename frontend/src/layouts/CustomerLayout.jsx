import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LayoutDashboard, Car, CalendarCheck, CreditCard, User, Search } from 'lucide-react';

export default function CustomerLayout() {
  const customerTabs = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/parking', label: 'Find Parking', icon: Search },
    { to: '/customer/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/customer/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/customer/passes', label: 'Monthly Passes', icon: CreditCard },
    { to: '/customer/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      
      {/* Customer Sub-navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {customerTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === '/customer/dashboard'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
