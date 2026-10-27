import React from 'react';
import { COMPLAINT_CATEGORIES } from '../data/initialComplaints';
import {
  Car,
  Droplets,
  Zap,
  Trash2,
  Lightbulb,
  FileText,
  Activity,
  Shield,
  ArrowRight,
  Clock,
} from 'lucide-react';

interface CategoryCardsProps {
  onSelectCategory: (categoryName: string) => void;
  language: 'en' | 'ta';
}

const ICON_MAP: Record<string, React.ElementType> = {
  Road: Car,
  Droplets: Droplets,
  Zap: Zap,
  Trash2: Trash2,
  Lightbulb: Lightbulb,
  FileText: FileText,
  Activity: Activity,
  Shield: Shield,
};

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  onSelectCategory,
  language,
}) => {
  return (
    <section className="bg-white border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#174A78] mb-1">
              {language === 'en' ? 'Grievance Classification' : 'புகார் வகைகள்'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {language === 'en' ? 'Complaint Categories & Citizen Services' : 'துறைசார் புகார் பிரிவுகள்'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              {language === 'en'
                ? 'Select a department category to register a specific complaint with automatic AI triaging to designated district officers.'
                : 'உங்கள் புகாருக்கான பொருத்தமான பிரிவைத் தேர்ந்தெடுத்து எளிதாகப் பதிவு செய்யுங்கள்.'}
            </p>
          </div>
        </div>

        {/* Categories Grid: 8 balanced cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COMPLAINT_CATEGORIES.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || FileText;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-[#174A78] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center group-hover:bg-[#174A78] group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#267C78]" />
                      <span>{cat.slaHours}h SLA</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#174A78] transition-colors leading-snug">
                    {language === 'en' ? cat.name : cat.nameTamil}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {cat.department}
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    <strong className="text-slate-900 tabular-nums">{cat.activeCount.toLocaleString('en-IN')}</strong> active cases
                  </span>
                  <button
                    onClick={() => onSelectCategory(cat.name)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#174A78] group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>File</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
