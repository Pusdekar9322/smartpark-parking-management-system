import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Car,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  Layers,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export default function Navbar() {
  const { user, isAuthenticated, isCustomer, isParkingAdmin, isSuperAdmin, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isSuperAdmin) return '/super-admin/dashboard';
    if (isParkingAdmin) return '/admin/dashboard';
    return '/customer/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    SMART<span className="text-brand-600">PARK</span>
                  </span>
                  <span className="text-sm" title="India">🇮🇳</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase -mt-1">
                  Smart Parking Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/customer/parking"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/customer/parking')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Find Parking
              </Link>
              <Link
                to="/about"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/about')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/contact')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Support
              </Link>
            </nav>
          </div>

          {/* Right Action Icons & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Dashboard Quick Link */}
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-600" />
                  <span>Dashboard</span>
                </Link>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length > 0 ? (
                          notifications.slice(0, 6).map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markAsRead(n.id)}
                              className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                                !n.isRead ? 'bg-brand-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                                  {formatDateTime(n.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications yet
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                      {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                        {user?.fullName?.split(' ')[0]}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium capitalize">
                        {user?.role?.replace('ROLE_', '').toLowerCase()}
                      </p>
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-bold text-sm text-slate-900 truncate">{user?.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isCustomer && (
                        <>
                          <Link
                            to="/customer/bookings"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <CalendarCheck className="w-4 h-4 text-brand-600" />
                            My Bookings
                          </Link>
                          <Link
                            to="/customer/vehicles"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <Car className="w-4 h-4 text-brand-600" />
                            My Vehicles
                          </Link>
                          <Link
                            to="/customer/passes"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            <CreditCard className="w-4 h-4 text-brand-600" />
                            Monthly Passes
                          </Link>
                        </>
                      )}

                      {isParkingAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Layers className="w-4 h-4 text-brand-600" />
                          Admin Console
                        </Link>
                      )}

                      {isSuperAdmin && (
                        <Link
                          to="/super-admin/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <Shield className="w-4 h-4 text-brand-600" />
                          Super Admin Portal
                        </Link>
                      )}

                      <Link
                        to="/customer/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <User className="w-4 h-4 text-brand-600" />
                        Account Settings
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/customer/parking"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Find Parking
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-brand-600"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left py-2 text-sm font-bold text-rose-600"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-4 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-600 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
