import React, { useState } from 'react';
import { X, Lock, Shield, User, ArrowRight } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('officer.chennai@tn.gov.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Please provide valid officer credentials.');
    }
  };

  const handleQuickDemoLogin = () => {
    setEmail('officer.chennai@tn.gov.in');
    setPassword('admin123');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden no-print">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#174A78] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-blue-200" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Government of Tamil Nadu
              </span>
              <h3 className="text-base font-bold">Grievance Officer Portal</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Authorized administrative access for District Collectors, Municipal Commissioners, and Grievance Redressal Officers.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Official Email ID (.tn.gov.in)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@tn.gov.in"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Officer Passcode / Token
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
              />
            </div>
          </div>

          {error && <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded">{error}</div>}

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Authenticate Officer Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              1-Click Demo Login (Pre-filled Officer Credentials)
            </button>
          </div>
        </form>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
          State Grievance Network · NIC Secured 256-bit SSL
        </div>
      </div>
    </div>
  );
};
