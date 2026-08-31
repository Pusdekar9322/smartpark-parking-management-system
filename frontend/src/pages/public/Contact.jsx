import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">Customer Care</span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          We're Here to Help You 🇮🇳
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Have questions about your booking, parking passes, or enterprise parking facility onboarding in Pune? Contact our team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Coordinates */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-black">Pune Headquarters</h2>
          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">SmartPark Operations Center</p>
                <p className="mt-0.5">Phoenix Marketcity Corporate Wing, Viman Nagar Road, Pune, Maharashtra 411014</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">+91 98765 43210</p>
                <p className="text-[11px] text-slate-400">Monday – Saturday (9:00 AM – 8:00 PM IST)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">support@smartpark.in</p>
                <p className="text-[11px] text-slate-400">Response within 2 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl text-emerald-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base">Message Sent Successfully!</h3>
              <p className="text-xs text-emerald-700">Thank you for reaching out. Our Pune support team will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message / Inquiry</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we assist you with parking?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-600/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
