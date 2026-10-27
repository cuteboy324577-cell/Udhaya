import React, { useState } from 'react';
import { Complaint } from '../types/complaint';
import { Search, Printer, CheckCircle, Clock, AlertCircle, Building2, Phone, MapPin, Calendar, FileText, ChevronRight } from 'lucide-react';

interface TrackComplaintSectionProps {
  complaints: Complaint[];
  onPrintComplaint: (complaint: Complaint) => void;
  language: 'en' | 'ta';
}

export const TrackComplaintSection: React.FC<TrackComplaintSectionProps> = ({
  complaints,
  onPrintComplaint,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('TN-CMP-2026-78421');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    complaints.find((c) => c.id === 'TN-CMP-2026-78421') || complaints[0] || null
  );
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchError('Please enter a valid Complaint ID or 10-digit Mobile Number');
      return;
    }

    const matched = complaints.find(
      (c) =>
        c.id.toLowerCase() === query ||
        c.id.toLowerCase().includes(query) ||
        c.citizenPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
    );

    if (matched) {
      setSelectedComplaint(matched);
      setSearchError('');
    } else {
      setSearchError(`No grievance record found for "${searchQuery}". Please verify ID or try one of the demo samples.`);
    }
  };

  const STEPS = [
    { key: 'Under Review', label: 'Registered & Triaged', desc: 'AI logged & verified' },
    { key: 'Verified & Assigned', label: 'Officer Assigned', desc: 'Department acknowledged' },
    { key: 'In Progress', label: 'Action In Progress', desc: 'Field crew mobilized' },
    { key: 'Resolved', label: 'Resolved & Closed', desc: 'Citizen confirmation' },
  ];

  const getStepStatus = (stepIndex: number, currentStatus: string) => {
    const statusMap: Record<string, number> = {
      'Under Review': 0,
      'Verified & Assigned': 1,
      'In Progress': 2,
      'Resolved': 3,
      'Rejected': -1,
    };
    const currentIdx = statusMap[currentStatus] ?? 0;
    if (currentStatus === 'Rejected') {
      return stepIndex === 0 ? 'completed' : 'rejected';
    }
    if (stepIndex < currentIdx) return 'completed';
    if (stepIndex === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <section id="track-section" className="bg-white border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#174A78] mb-1">
            {language === 'en' ? 'Real-Time Grievance Tracker' : 'நேரடி புகார் கண்காணிப்பு'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {language === 'en' ? 'Track Your Complaint Status' : 'புகாரின் தற்போதைய நிலையை அறியுங்கள்'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {language === 'en'
              ? 'Enter your Complaint Reference ID (e.g. TN-CMP-2026-78421) or registered 10-digit mobile number to view live progress, assigned officer details, and print an official dossier.'
              : 'உங்கள் புகார் எண் அல்லது பதிவு செய்த அலைபேசி எண்ணை உள்ளிட்டு நிலையை அறியலாம்.'}
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchError('');
                }}
                placeholder="Enter Complaint ID (e.g. TN-CMP-2026-78421) or Mobile"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#174A78] shadow-2xs font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#174A78] hover:bg-[#12395d] text-white font-semibold text-sm rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              Track Status
            </button>
          </form>

          {/* Sample Chips */}
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500 flex-wrap">
            <span>Try sample complaints:</span>
            {complaints.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSearchQuery(c.id);
                  setSelectedComplaint(c);
                  setSearchError('');
                }}
                className="text-[#174A78] hover:underline font-mono bg-blue-50 px-2 py-0.5 rounded cursor-pointer border border-blue-100"
              >
                {c.id}
              </button>
            ))}
          </div>

          {searchError && (
            <div className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-lg max-w-xl mx-auto">
              {searchError}
            </div>
          )}
        </div>

        {/* Selected Complaint Live Details Card */}
        {selectedComplaint && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 sm:p-8 max-w-4xl mx-auto">
            
            {/* Top Bar of the Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-[#174A78]">
                    {selectedComplaint.id}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-blue-50 text-[#174A78] border border-blue-200">
                    {selectedComplaint.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {selectedComplaint.priority} Priority
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h3>
              </div>

              {/* Functional Print Button */}
              <button
                onClick={() => onPrintComplaint(selectedComplaint)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>Print Complaint</span>
              </button>
            </div>

            {/* Stepper Tracking Visual */}
            <div className="py-4 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                {STEPS.map((step, idx) => {
                  const state = getStepStatus(idx, selectedComplaint.status);
                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'current'
                            ? 'bg-[#174A78] text-white ring-4 ring-blue-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}
                      >
                        {state === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span>0{idx + 1}</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800">{step.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complaint Detail Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs text-slate-700">
              
              {/* Column 1: Location & Citizen */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#174A78] uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Incident & Citizen Location
                </h4>
                <div>
                  <span className="text-slate-500">Citizen: </span>
                  <span className="font-semibold text-slate-900">{selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</span>
                </div>
                <div>
                  <span className="text-slate-500">District: </span>
                  <span className="font-medium text-slate-900">{selectedComplaint.district} (Ward: {selectedComplaint.talukWard})</span>
                </div>
                <div>
                  <span className="text-slate-500">Address: </span>
                  <span className="text-slate-800">{selectedComplaint.address}</span>
                </div>
                <div>
                  <span className="text-slate-500">GPS Coordinates: </span>
                  <span className="font-mono text-slate-800">{selectedComplaint.coordinates.lat.toFixed(4)}°N, {selectedComplaint.coordinates.lng.toFixed(4)}°E</span>
                </div>
              </div>

              {/* Column 2: Assigned Department */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#174A78] uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Responsible Authority & SLA
                </h4>
                <div>
                  <span className="text-slate-500">Department: </span>
                  <span className="font-semibold text-slate-900">{selectedComplaint.department}</span>
                </div>
                <div>
                  <span className="text-slate-500">Assigned Officer: </span>
                  <span className="font-medium text-slate-900">{selectedComplaint.assignedOfficer.name}</span>
                </div>
                <div>
                  <span className="text-slate-500">Officer Contact: </span>
                  <span className="font-mono text-slate-900">{selectedComplaint.assignedOfficer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500">Target SLA: </span>
                  <span className="font-semibold text-blue-900">{selectedComplaint.slaDeadline}</span>
                </div>
              </div>

            </div>

            {/* Description Box */}
            <div className="mt-5 p-4 rounded-lg bg-white border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Grievance Description:</span>
              <p className="text-slate-600 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            {/* Recent Timeline Trail */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Action Log & Audit Trail
              </h4>
              <div className="space-y-2">
                {selectedComplaint.timeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-mono text-[11px] text-slate-500 shrink-0 w-32">{entry.timestamp}</span>
                    <div className="flex-1">
                      <span className="font-semibold text-[#174A78]">{entry.status}: </span>
                      <span className="text-slate-700">{entry.description}</span>
                      {entry.remarks && (
                        <p className="text-slate-500 text-[11px] italic mt-0.5">Remarks: {entry.remarks}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
