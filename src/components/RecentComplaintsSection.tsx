import React from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { Printer, Eye, MapPin, Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RecentComplaintsSectionProps {
  complaints: Complaint[];
  onViewComplaint: (complaint: Complaint) => void;
  onPrintComplaint: (complaint: Complaint) => void;
  language: 'en' | 'ta';
}

export const RecentComplaintsSection: React.FC<RecentComplaintsSectionProps> = ({
  complaints,
  onViewComplaint,
  onPrintComplaint,
  language,
}) => {
  const [statusFilter, setStatusFilter] = React.useState<string>('All');
  const [districtFilter, setDistrictFilter] = React.useState<string>('All');

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (districtFilter !== 'All' && c.district !== districtFilter) return false;
    return true;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Verified & Assigned':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Under Review':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Medium':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <section className="bg-[#F5F7FA] border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Interactive Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#174A78] mb-1">
              {language === 'en' ? 'Public Transparency Stream' : 'நேரடி மக்கள் புகார்கள்'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {language === 'en' ? 'Recent Grievances & Live Action' : 'சமீபத்திய புகார்கள் மற்றும் நடவடிக்கைகள்'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'en' ? 'Transparent tracking of registered public complaints across Tamil Nadu municipal and rural divisions' : 'தமிழ்நாடு முழுவதும் பதிவு செய்யப்பட்ட சமீபத்திய பொதுப் புகார்கள்'}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
              {['All', 'In Progress', 'Verified & Assigned', 'Resolved'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#174A78] text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg px-3 py-2 shadow-2xs focus:outline-hidden focus:border-[#174A78]"
            >
              <option value="All">All Districts</option>
              <option value="Chennai">Chennai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
              <option value="Salem">Salem</option>
              <option value="Tirunelveli">Tirunelveli</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                {/* ID, Category, Priority */}
                <div className="flex items-center justify-between text-xs mb-2.5">
                  <span className="font-mono font-bold text-[#174A78] bg-blue-50/70 px-2 py-0.5 rounded border border-blue-100">
                    {item.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Category & Location metadata */}
                <div className="text-xs text-slate-500 space-y-1 mb-3">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{item.subcategory}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.district} · {item.talukWard}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Filed: {item.createdAt}</span>
                  </div>
                </div>

                {/* Evidence Thumbnail if any */}
                {item.images && item.images.length > 0 && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-50 relative group">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                      {item.images.length} Photo{item.images.length > 1 ? 's' : ''}
                    </div>
                  </div>
                )}

                {/* AI Triage Snippet */}
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mb-4">
                  <div className="flex items-center justify-between font-semibold text-slate-700 mb-0.5">
                    <span>AI Classification:</span>
                    <span className="font-mono text-[#174A78]">{item.aiAnalysis.confidence}% Conf.</span>
                  </div>
                  <div className="truncate text-slate-500">
                    Route: {item.department}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View Details & Print Complaint */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewComplaint(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#174A78] hover:bg-blue-50 border border-[#174A78]/30 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => onPrintComplaint(item)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-[#174A78] hover:bg-[#12395d] rounded-lg transition-colors cursor-pointer shadow-2xs"
                  title="Print Official Complaint Record"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
