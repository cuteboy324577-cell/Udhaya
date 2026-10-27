import React from 'react';
import { Phone, Shield, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  language: 'en' | 'ta';
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, language }) => {
  return (
    <footer className="bg-[#0f2742] text-slate-300 border-t-4 border-[#174A78] print:hidden no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Government Authority */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="currentColor">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path d="M50 18 L55 30 L65 30 L65 50 L70 50 L70 75 L30 75 L30 50 L35 50 L35 30 L45 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="50" cy="38" r="4" fill="currentColor" />
                  <text x="50" y="88" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">GOVT OF TN</text>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">
                  Government of Tamil Nadu
                </h3>
                <p className="text-xs text-slate-400">Public Complaint Portal</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Maintained by the Department of Information Technology and Digital Services, Government of Tamil Nadu, in technical partnership with the National Informatics Centre (NIC).
            </p>
            <div className="text-xs text-slate-400">
              Secretariat, Fort St. George, Chennai, Tamil Nadu - 600009
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Citizen Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home / Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('report')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  File a New Complaint
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Grievance Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Live Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Analytics Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Orders & Acts */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Policy & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Citizen&apos;s Charter (G.O. Ms No. 41)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Right to Information (RTI Act 2005)
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  TN Digital Grievance Norms 2024
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy & Data Security
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Public Service Delivery
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: State Emergency & Helplines */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              Important Helplines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-white font-semibold">
                  <span>CM Helpline (Toll Free):</span>
                  <span className="text-amber-400 font-bold text-sm">1100</span>
                </div>
                <div className="text-[11px] text-slate-400">24x7 Round-the-clock grievance support</div>
              </div>

              <div className="flex justify-between py-1 border-b border-white/10 text-[11px]">
                <span>State Police Control:</span>
                <span className="text-white font-mono">100</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10 text-[11px]">
                <span>Fire & Rescue Services:</span>
                <span className="text-white font-mono">101</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10 text-[11px]">
                <span>Emergency Ambulance:</span>
                <span className="text-white font-mono">108</span>
              </div>
              <div className="flex justify-between py-1 text-[11px]">
                <span>Women in Distress Helpline:</span>
                <span className="text-white font-mono">1091</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © 2026 Government of Tamil Nadu. All Rights Reserved. Content owned by Public Grievance Directorate.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Designed for Standard WCAG 2.1 AA Accessibility</span>
            <span>·</span>
            <span>NIC Server Ver 2.4</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
