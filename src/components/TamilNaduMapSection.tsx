import React from 'react';
import { Complaint } from '../types/complaint';
import { LiveInteractiveMap } from './LiveInteractiveMap';
import { MapPin, Globe } from 'lucide-react';

interface TamilNaduMapSectionProps {
  complaints: Complaint[];
  onViewComplaint: (complaint: Complaint) => void;
  onPrintComplaint: (complaint: Complaint) => void;
  language: 'en' | 'ta';
}

export const TamilNaduMapSection: React.FC<TamilNaduMapSectionProps> = ({
  complaints,
  onViewComplaint,
  onPrintComplaint,
  language,
}) => {
  return (
    <section id="map-section" className="bg-white border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#174A78] mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Geographic Information System (GIS) & Live Map' : 'புவிசார் தகவல் தளம்'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {language === 'en' ? 'Interactive Tamil Nadu Civic Grievance Map' : 'தமிழ்நாடு பொதுப் புகார் நேரடி வரைபடம்'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'en'
                ? 'Leaflet.js and OpenStreetMap powered real-time visualization of grievances across 38 districts with live GPS positioning and privacy-protected status indicators.'
                : 'தமிழ்நாட்டின் 38 மாவட்டங்களில் உள்ள பொதுப் புகார்களின் நிகழ்நேர வரைபடக் காட்சி.'}
            </p>
          </div>
        </div>

        {/* Live Leaflet Map Component */}
        <LiveInteractiveMap
          complaints={complaints}
          onViewComplaint={onViewComplaint}
          onPrintComplaint={onPrintComplaint}
          language={language}
        />

      </div>
    </section>
  );
};
