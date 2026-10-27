import React, { useEffect, useRef } from 'react';
import { Complaint } from '../types/complaint';
import {
  X,
  Printer,
  MapPin,
  Calendar,
  Building2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  User,
  Phone,
  Mail,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import { PhotoVerificationBadge } from './PhotoVerificationBadge';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onPrintComplaint: (complaint: Complaint) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onPrintComplaint,
}) => {
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (complaint) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTop = 0;
      }
    }
  }, [complaint]);

  if (!complaint) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden no-print">
      <div
        ref={modalScrollRef}
        className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-[#174A78] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold bg-white/10 px-2.5 py-1 rounded">
              {complaint.id}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-[#174A78]">
              {complaint.status}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
              {complaint.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintComplaint(complaint)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-[#174A78] hover:bg-blue-50 text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Complaint</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
          
          {/* Title & Metadata */}
          <div>
            <div className="text-xs font-bold text-[#174A78] uppercase tracking-wider mb-1">
              {complaint.category} · {complaint.subcategory}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {complaint.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#174A78]" />
                {complaint.district} ({complaint.talukWard})
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#174A78]" />
                Filed on: {complaint.createdAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#174A78]" />
                SLA Target: {complaint.slaDeadline}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            <h4 className="font-bold text-slate-900 text-xs uppercase mb-1">Detailed Description:</h4>
            {complaint.description}
          </div>

          {/* Photo Gallery & AI Photo Verification */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Attached Grievance Photographs ({complaint.images.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {complaint.images.map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100 shadow-2xs">
                    <img
                      src={img}
                      alt={`Evidence ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* AI Photo Verification Result Badge */}
              {complaint.photoVerification && (
                <div className="pt-1">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#174A78]" />
                    AI Photo Verification & Authenticity Report
                  </div>
                  <PhotoVerificationBadge result={complaint.photoVerification} />
                </div>
              )}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Citizen Particulars */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-[#174A78] uppercase text-[11px] border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Citizen Particulars
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-900">{complaint.citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-slate-900">{complaint.citizenPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-800">{complaint.citizenEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Street Address:</span>
                <span className="text-slate-800 text-right">{complaint.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Landmark / PIN:</span>
                <span className="text-slate-800">{complaint.landmark || 'None'} ({complaint.pincode})</span>
              </div>
              {complaint.autoLocation && (
                <div className="flex justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">Geocoding Source:</span>
                  <span className="font-medium text-[#174A78] flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {complaint.autoLocation.source}
                  </span>
                </div>
              )}
            </div>

            {/* Department Assignment */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-[#174A78] uppercase text-[11px] border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                Responsible Administrative Authority
              </h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-900 text-right">{complaint.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Officer In-Charge:</span>
                <span className="font-medium text-slate-900">{complaint.assignedOfficer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Designation:</span>
                <span className="text-slate-700">{complaint.assignedOfficer.designation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Official Phone:</span>
                <span className="font-mono text-slate-900">{complaint.assignedOfficer.phone}</span>
              </div>
            </div>

          </div>

          {/* AI & Duplicate Audit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-[#174A78] border-b border-slate-200 pb-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AI Triage Verification
                </span>
                <span className="font-mono text-emerald-700">{complaint.aiAnalysis.confidence}% Conf.</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Urgency Index:</span>
                <span className="font-medium text-slate-900">{complaint.aiAnalysis.urgencyScore}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Priority:</span>
                <span className="font-bold text-[#174A78]">{complaint.aiAnalysis.priorityRecommendation}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-1">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Spatial Duplicate Check
                </span>
                <span className="font-mono text-slate-600">{complaint.duplicateCheck.similarityScore}% Match</span>
              </div>
              <div className="text-slate-600 leading-normal">
                {complaint.duplicateCheck.matchReason}
              </div>
            </div>
          </div>

          {/* Timeline Audit Trail */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Action Timeline & Investigation Audit Trail
            </h4>
            <div className="space-y-2.5">
              {complaint.timeline.map((entry, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-mono text-slate-500 shrink-0 w-32">{entry.timestamp}</span>
                  <div className="flex-1">
                    <div className="font-bold text-[#174A78]">{entry.status}</div>
                    <div className="text-slate-700 mt-0.5">{entry.description}</div>
                    {entry.remarks && (
                      <div className="text-[11px] text-slate-500 italic mt-0.5">Note: {entry.remarks}</div>
                    )}
                    <div className="text-[10px] text-slate-400 mt-1">Authorized by: {entry.updatedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => onPrintComplaint(complaint)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
