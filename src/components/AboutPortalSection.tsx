import React from 'react';
import { ShieldCheck, Cpu, Clock, CheckCircle2, Award, Scale, HelpCircle } from 'lucide-react';

interface AboutPortalSectionProps {
  language: 'en' | 'ta';
}

export const AboutPortalSection: React.FC<AboutPortalSectionProps> = ({ language }) => {
  return (
    <section className="bg-[#F5F7FA] border-b border-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#174A78] mb-1">
            {language === 'en' ? 'Institutional Framework' : 'அமைப்பு மற்றும் கொள்கைகள்'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {language === 'en' ? 'About the Public Complaint Portal' : 'இணையதளத்தின் நோக்கம் மற்றும் கட்டமைப்பு'}
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            {language === 'en'
              ? 'Constituted under the digital governance mandate of the Government of Tamil Nadu, the Public Complaint Portal unifies municipal corporations, electrical utilities, water boards, and revenue bodies into a single transparent citizen redressal infrastructure.'
              : 'தமிழ்நாடு அரசின் மின்னாளுகை திட்டத்தின் கீழ், அனைத்து அரசுத் துறைகளின் பொதுக் குறைகளையும் ஒரே இடத்தில் பெற்று துரிதமாகத் தீர்க்க அமைக்கப்பட்ட தளம்.'}
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Citizen Charter & 72-Hour SLA
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every complaint is governed by legally binding Service Level Agreements (SLAs). Priority grievances such as contaminated drinking water or high-voltage sparks are triaged within 2 hours and routed for immediate intervention.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Triaging & Spatial De-Duplication
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State-of-the-art machine learning models categorize unstructured descriptions and image evidence, predict responsible municipal divisions, and scan for spatial duplicates within a 500-meter radius to prevent fragmented administrative response.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Three-Tier Escalation Hierarchy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Grievances unresolved within the statutory SLA automatically escalate through the grievance ladder: from the Ward Sanitary / Line Inspector to the District Collectorate and the Chief Minister&apos;s Special Cell.
            </p>
          </div>
        </div>

        {/* Redressal Workflow Stepper */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#174A78] mb-6">
            Citizen Grievance Lifecycle: Submission to Verification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#174A78] pl-4 space-y-1">
              <span className="text-xs font-mono font-bold text-[#174A78]">STAGE 01</span>
              <h4 className="text-sm font-bold text-slate-900">Submission & Geotagging</h4>
              <p className="text-xs text-slate-500">Citizen uploads description, evidence photos (up to 4), and GPS coordinates.</p>
            </div>

            <div className="border-l-2 border-[#174A78] pl-4 space-y-1">
              <span className="text-xs font-mono font-bold text-[#174A78]">STAGE 02</span>
              <h4 className="text-sm font-bold text-slate-900">AI Intake & Classification</h4>
              <p className="text-xs text-slate-500">Automated classification, duplicate checking, and immediate dispatch to the ward engineer.</p>
            </div>

            <div className="border-l-2 border-[#174A78] pl-4 space-y-1">
              <span className="text-xs font-mono font-bold text-[#174A78]">STAGE 03</span>
              <h4 className="text-sm font-bold text-slate-900">Field Resolution & SMS</h4>
              <p className="text-xs text-slate-500">Technicians execute on-ground repair work. Citizen receives automated progress SMS alerts.</p>
            </div>

            <div className="border-l-2 border-[#174A78] pl-4 space-y-1">
              <span className="text-xs font-mono font-bold text-[#174A78]">STAGE 04</span>
              <h4 className="text-sm font-bold text-slate-900">Closure & Citizen Audit</h4>
              <p className="text-xs text-slate-500">Citizen verifies resolution through OTP verification before grievance is closed.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
