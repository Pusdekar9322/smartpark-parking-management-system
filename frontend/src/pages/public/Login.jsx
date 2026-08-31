import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/customer/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login({ email, password });
      if (user.role === 'ROLE_SUPER_ADMIN') {
        navigate('/super-admin/dashboard');
      } else if (user.role === 'ROLE_PARKING_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/customer/dashboard' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl text-left">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/30 mb-3">
              <Car className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome to SmartPark 🇮🇳
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Enter your credentials to access your smart parking portal
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@smartpark.in"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-extrabold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Accounts (Interview Evaluator)
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('customer@smartpark.in', 'Customer@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-colors text-center"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin.pune@smartpark.in', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-colors text-center"
              >
                Pune Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('superadmin@smartpark.in', 'Admin@123')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 transition-colors text-center"
              >
                Super Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Sign up here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
