import React from 'react';
import { Car, ShieldCheck, QrCode, IndianRupee, Layers, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">About SmartPark</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Next-Generation Smart Parking for India 🇮🇳
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          SmartPark is a full-stack smart parking reservation, dynamic pricing, and gate management platform built specifically for Indian urban infrastructure.
        </p>
      </div>

      {/* Tech Stack Matrix */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900">Technology Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-brand-600 mb-2">Backend (Java 22)</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• Spring Boot 3.3 Layered Architecture</li>
              <li>• Spring Security 6 + JWT RBAC</li>
              <li>• Spring Data JPA + Hibernate</li>
              <li>• Double-Booking Overlap Prevention</li>
              <li>• ZXing QR & OpenPDF Invoice Engine</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-emerald-600 mb-2">Database (MySQL 8.0)</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• 12 JPA Entities with strict constraints</li>
              <li>• Pessimistic Locking Interval Queries</li>
              <li>• Full Indian timezone support (IST)</li>
              <li>• Seeded with realistic Pune facilities</li>
            </ul>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-extrabold text-sm text-indigo-600 mb-2">Frontend (React + Vite)</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>• React 18 with Vite & Tailwind CSS</li>
              <li>• Interactive visual floor & slot grid</li>
              <li>• Razorpay Sandbox + Pay at Parking</li>
              <li>• Gate Terminal & In-app Notifications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Indian Localization Highlights */}
      <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-4">
        <h2 className="text-xl font-black">Indian Localization Features 🇮🇳</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>Indian Rupee (₹ INR)</strong>: Fully native formatting and calculation rules.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>Vehicle Number Validation</strong>: Matches Indian RTO registration patterns (e.g. MH 12 AB 1234).</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>Dual Payments</strong>: Razorpay UPI/Cards online checkout and counter Pay at Parking.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span><strong>GST-Compliant Invoices</strong>: Automated CGST (9%) and SGST (9%) breakdown.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
