import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Car className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SMART<span className="text-brand-400">PARK</span> 🇮🇳
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier smart parking platform enabling contactless advance reservations, dynamic hourly pricing, QR check-in and automated GST billing.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Razorpay Sandbox & Pay at Parking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/customer/parking" className="hover:text-white transition-colors">Find Parking</Link>
              </li>
              <li>
                <Link to="/customer/passes" className="hover:text-white transition-colors">Monthly Passes</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Help & FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Supported Locations */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Demo Cities</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-brand-300 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>Pune, Maharashtra (Primary)</span>
              </li>
              <li className="text-slate-400">Mumbai • Bengaluru • Hyderabad</li>
              <li className="text-slate-400">Delhi NCR • Nagpur • Nashik</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>+91 98765 43210 (Mon-Sat, 9AM - 8PM)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@smartpark.in</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Viman Nagar, Pune, Maharashtra 411014</span>
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartPark Platform. Designed & Built for Indian Smart Cities.</p>
          <p className="flex items-center gap-1">
            Built with Spring Boot 3 + React + MySQL
          </p>
        </div>
      </div>
    </footer>
  );
}
