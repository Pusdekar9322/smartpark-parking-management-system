import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-3xl flex items-center justify-center mx-auto">
          <MapPinOff className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">404 - Page Not Found</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          The parking page or resource you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
