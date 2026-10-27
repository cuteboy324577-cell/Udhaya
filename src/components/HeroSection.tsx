import React from 'react';
import { PlusCircle, Search, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onReportClick: () => void;
  onTrackClick: () => void;
  language: 'en' | 'ta';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onReportClick,
  onTrackClick,
  language,
}) => {
  return (
    <section className="relative bg-white border-b border-slate-200 overflow-hidden py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description, Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Trust Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#174A78] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#174A78]"></span>
              <span>{language === 'en' ? 'Official Citizen Grievance Redressal System' : 'அதிகாரப்பூர்வ மக்கள் குறைதீர்ப்பு தளம்'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#174A78] leading-tight">
              {language === 'en' ? (
                <>
                  Public Complaint Portal <br />
                  <span className="text-slate-800 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    Government of Tamil Nadu
                  </span>
                </>
              ) : (
                <>
                  பொதுக் குறை தீர்வு இணையதளம் <br />
                  <span className="text-slate-800 text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    தமிழ்நாடு அரசு
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {language === 'en'
                ? 'An integrated digital governance platform enabling citizens of Tamil Nadu to register civic grievances, track resolutions in real-time, and experience transparent, time-bound service delivery powered by AI triaging and GIS mapping.'
                : 'தமிழ்நாடு குடிமக்கள் தங்களின் நகராட்சி, குடிநீர், மின்சாரம் மற்றும் சாலை புகார்களை உடனடியாகப் பதிவு செய்து, நேரடி கண்காணிப்புடன் விரைவான தீர்வுகளைப் பெற உதவும் வெளிப்படையான பொது சேவை தளம்.'}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onReportClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#174A78] hover:bg-[#12395d] text-white font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Report a Complaint' : 'புதிய புகார் பதிவு செய்'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTrackClick}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#174A78] font-semibold text-sm rounded-lg border-2 border-[#174A78] shadow-xs transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{language === 'en' ? 'Track Your Complaint' : 'புகார் நிலையை அறியவும்'}</span>
              </button>
            </div>

            {/* Citizen Service Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 max-w-xl">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#267C78] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">72-Hour SLA</h4>
                  <p className="text-[11px] text-slate-500">Guaranteed review</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#267C78] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">AI Verified</h4>
                  <p className="text-[11px] text-slate-500">Auto department routing</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#267C78] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">SMS Alerts</h4>
                  <p className="text-[11px] text-slate-500">Live phone updates</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Government Building Visual - HOMEPAGE HERO ONLY */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white">
              <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                <img
                  src="/src/assets/images/tn_government_secretariat_1792857963647.jpg"
                  alt="Government of Tamil Nadu Secretariat Building, Fort St. George, Chennai"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {/* Subtle gradient overlay to enhance legibility and polish */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Caption badge at the base */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="text-xs font-semibold drop-shadow-sm">Fort St. George · Chennai</div>
                  <div className="text-[11px] text-slate-200 drop-shadow-xs">Secretariat of Tamil Nadu Administrative Headquarters</div>
                </div>
              </div>

              {/* Sub-strip with civic authority badge */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="font-medium text-slate-800">State Grievance Cell Active</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">38 Districts Connected</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
