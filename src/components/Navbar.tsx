import React from 'react';
import { Shield, PhoneCall, PlusCircle, Search, BarChart3, UserCheck, Menu, X, MapPin } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  language: 'en' | 'ta';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  onOpenAdminLogin,
  language,
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs print:hidden no-print">
      {/* Topmost Government Ribbon */}
      <div className="bg-[#174A78] text-white text-[12px] py-1 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-medium tracking-wide">
            {language === 'en' ? 'Government of Tamil Nadu' : 'தமிழ்நாடு அரசு'}
          </span>
          <span className="hidden sm:inline text-blue-200">|</span>
          <span className="hidden sm:inline text-blue-100">
            {language === 'en' ? 'Public Grievance Redressal Portal' : 'பொதுக் குறை தீர்வு இணையதளம்'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-amber-300">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>CM Helpline: <strong>1100</strong> (Toll Free)</span>
          </div>
          <button
            onClick={onToggleLanguage}
            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
            title="Switch Language"
          >
            {language === 'en' ? 'தமிழ்' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Navbar: Strict 3-zone architecture */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand / Emblem Wordmark */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer shrink-0"
        >
          {/* Government of Tamil Nadu Emblem */}
          <div className="w-12 h-12 rounded-full border border-slate-300 bg-slate-50 flex items-center justify-center p-1 shrink-0 shadow-xs">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#174A78]" fill="currentColor">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M50 18 L55 30 L65 30 L65 50 L70 50 L70 75 L30 75 L30 50 L35 50 L35 30 L45 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="50" cy="38" r="4" fill="currentColor" />
              <path d="M40 75 L60 75 L56 60 L44 60 Z" fill="currentColor" opacity="0.3" />
              <text x="50" y="88" fontSize="7" fontWeight="bold" textAnchor="middle" fill="#174A78">GOVT OF TN</text>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-[#174A78] leading-tight whitespace-nowrap">
              Public Complaint Portal
            </span>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              {language === 'en' ? 'Grievance Redressal & Monitoring System' : 'குறைதீர்ப்பு மற்றும் கண்காணிப்பு தளம்'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          <button
            onClick={() => handleNavClick('home')}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'home' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {language === 'en' ? 'Home' : 'முகப்பு'}
          </button>

          <button
            onClick={() => handleNavClick('report')}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'report' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {language === 'en' ? 'Report Complaint' : 'புகார் பதிவு'}
          </button>

          <button
            onClick={() => handleNavClick('track')}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'track' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {language === 'en' ? 'Track Complaint' : 'புகார் நிலை'}
          </button>

          <button
            onClick={() => handleNavClick('map')}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'map' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {language === 'en' ? 'Live Map' : 'நேரடி வரைபடம்'}
          </button>

          <button
            onClick={() => handleNavClick('analytics')}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'analytics' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {language === 'en' ? 'Analytics Dashboard' : 'புள்ளிவிவர பலகை'}
          </button>

          <button
            onClick={() => (isAdminLoggedIn ? handleNavClick('admin') : onOpenAdminLogin())}
            className={`whitespace-nowrap transition-colors hover:text-[#174A78] py-1 cursor-pointer ${
              currentView === 'admin' ? 'text-[#174A78] font-bold border-b-2 border-[#174A78]' : ''
            }`}
          >
            {isAdminLoggedIn ? (language === 'en' ? 'Admin Portal' : 'நிர்வாகப் பலகை') : (language === 'en' ? 'Officer Login' : 'அதிகாரி உள்நுழைவு')}
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('report')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#174A78] hover:bg-[#12395d] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'en' ? 'File Grievance' : 'புகார் அளியுங்கள்'}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {language === 'en' ? 'Home' : 'முகப்பு'}
          </button>
          <button
            onClick={() => handleNavClick('report')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {language === 'en' ? 'Report a Complaint' : 'புகார் பதிவு'}
          </button>
          <button
            onClick={() => handleNavClick('track')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {language === 'en' ? 'Track Your Complaint' : 'புகார் நிலை அறிதல்'}
          </button>
          <button
            onClick={() => handleNavClick('map')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {language === 'en' ? 'Live Map' : 'நேரடி வரைபடம்'}
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {language === 'en' ? 'Analytics Dashboard' : 'புள்ளிவிவர பலகை'}
          </button>
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                handleNavClick('admin');
              } else {
                onOpenAdminLogin();
                setMobileMenuOpen(false);
              }
            }}
            className="w-full text-left py-2.5 px-3 rounded-md text-sm font-semibold text-[#174A78] hover:bg-blue-50"
          >
            {isAdminLoggedIn ? 'Admin Portal' : 'Officer / Admin Login'}
          </button>
        </div>
      )}
    </header>
  );
};
