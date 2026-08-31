import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import NotFound from '../pages/public/NotFound';
import Unauthorized from '../pages/public/Unauthorized';

// Customer Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import Vehicles from '../pages/customer/Vehicles';
import ParkingFinder from '../pages/customer/ParkingFinder';
import ParkingDetails from '../pages/customer/ParkingDetails';
import SlotBooking from '../pages/customer/SlotBooking';
import BookingConfirmation from '../pages/customer/BookingConfirmation';
import MyBookings from '../pages/customer/MyBookings';
import BookingDetail from '../pages/customer/BookingDetail';
import MonthlyPasses from '../pages/customer/MonthlyPasses';
import Profile from '../pages/customer/Profile';
import Notifications from '../pages/customer/Notifications';

// Parking Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import CheckInOutTerminal from '../pages/admin/CheckInOutTerminal';
import LiveBookings from '../pages/admin/LiveBookings';
import ManageLocations from '../pages/admin/ManageLocations';
import ManageFloors from '../pages/admin/ManageFloors';
import ManageSlots from '../pages/admin/ManageSlots';
import ManagePricing from '../pages/admin/ManagePricing';
import ManageCoupons from '../pages/admin/ManageCoupons';
import Payments from '../pages/admin/Payments';

// Super Admin Pages
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import ManageAdmins from '../pages/superadmin/ManageAdmins';
import ManageCustomers from '../pages/superadmin/ManageCustomers';
import SystemLocations from '../pages/superadmin/SystemLocations';
import AllBookings from '../pages/superadmin/AllBookings';
import SystemRevenue from '../pages/superadmin/SystemRevenue';
import SystemReports from '../pages/superadmin/SystemReports';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_PARKING_ADMIN', 'ROLE_SUPER_ADMIN']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="parking" element={<ParkingFinder />} />
        <Route path="parking/:id" element={<ParkingDetails />} />
        <Route path="booking" element={<SlotBooking />} />
        <Route path="booking-confirmation" element={<BookingConfirmation />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="passes" element={<MonthlyPasses />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Parking Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_PARKING_ADMIN', 'ROLE_SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="terminal" element={<CheckInOutTerminal />} />
        <Route path="bookings" element={<LiveBookings />} />
        <Route path="locations" element={<ManageLocations />} />
        <Route path="floors" element={<ManageFloors />} />
        <Route path="slots" element={<ManageSlots />} />
        <Route path="pricing" element={<ManagePricing />} />
        <Route path="coupons" element={<ManageCoupons />} />
        <Route path="payments" element={<Payments />} />
      </Route>

      {/* Super Admin Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="users" element={<ManageCustomers />} />
        <Route path="locations" element={<SystemLocations />} />
        <Route path="bookings" element={<AllBookings />} />
        <Route path="payments" element={<SystemRevenue />} />
        <Route path="reports" element={<SystemReports />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
