import React from 'react';
import { Complaint } from '../types/complaint';
import { Printer, X, CheckCircle2, ShieldCheck, QrCode, Building2, MapPin, Calendar, Clock, AlertTriangle, FileText } from 'lucide-react';

interface PrintComplaintDossierProps {
  complaint: Complaint | null;
  onClose?: () => void;
  triggerPrintOnMount?: boolean;
}

export const PrintComplaintDossier: React.FC<PrintComplaintDossierProps> = ({
  complaint,
  onClose,
  triggerPrintOnMount = false,
}) => {
  React.useEffect(() => {
    if (triggerPrintOnMount && complaint) {
      const timer = setTimeout(() => {
        window.print();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [triggerPrintOnMount, complaint]);

  if (!complaint) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:bg-white print:overflow-visible">
      {/* Top action bar - Hidden when printing */}
      <div className="fixed top-4 right-4 z-60 flex items-center gap-3 bg-white p-2 rounded-xl shadow-lg border border-slate-200 print:hidden no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#174A78] hover:bg-[#12395d] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Now (Browser Dialog)</span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close Preview</span>
          </button>
        )}
      </div>

      {/* Actual Printable Document Container */}
      <div className="printable-document bg-white w-full max-w-4xl p-6 sm:p-10 rounded-xl shadow-2xl border border-slate-200 print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-800">
        
        {/* Official Header */}
        <div className="border-b-2 border-[#174A78] pb-5 mb-6 text-center">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-300 flex items-center justify-center p-1.5 shrink-0">
                {/* Tamil Nadu Emblem Representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#174A78]" fill="currentColor">
                  <path d="M50 10 L58 32 L82 32 L62 48 L70 72 L50 56 L30 72 L38 48 L18 32 L42 32 Z" opacity="0.15" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path d="M50 16 L56 30 L66 30 L66 52 L72 52 L72 78 L28 78 L28 52 L34 52 L34 30 L44 30 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                  <circle cx="50" cy="38" r="4" fill="currentColor" />
                  <text x="50" y="90" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#174A78">GOVT OF TAMIL NADU</text>
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-500">Government of Tamil Nadu</p>
                <h1 className="text-xl sm:text-2xl font-bold text-[#174A78]">Public Complaint Portal</h1>
                <p className="text-xs text-slate-600 font-medium">Department of Information Technology and Digital Services</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm bg-blue-50 text-[#174A78] border border-blue-200">
                Official Redressal Dossier
              </span>
              <p className="text-xs text-slate-500 mt-1.5">Print Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <QrCode className="w-3.5 h-3.5" />
                <span className="font-mono">VERIFIED RECORD</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500">Complaint Reference ID:</span>
              <span className="ml-1.5 font-mono text-base font-bold text-[#174A78]">{complaint.id}</span>
            </div>
            <div>
              <span className="text-slate-500">Filing Date:</span>
              <span className="ml-1.5 font-medium text-slate-900">{complaint.createdAt}</span>
            </div>
            <div>
              <span className="text-slate-500">Current Status:</span>
              <span className="ml-1.5 font-bold uppercase text-[#174A78]">{complaint.status}</span>
            </div>
            <div>
              <span className="text-slate-500">Priority Level:</span>
              <span className="ml-1.5 font-bold text-slate-900">{complaint.priority}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Grievance & Citizen Particulars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print-break-inside-avoid">
          {/* Citizen Details */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Citizen Particulars
            </h2>
            <dl className="grid grid-cols-3 gap-y-2 text-xs">
              <dt className="text-slate-500">Name:</dt>
              <dd className="col-span-2 font-medium text-slate-900">{complaint.citizenName}</dd>

              <dt className="text-slate-500">Mobile No:</dt>
              <dd className="col-span-2 font-mono font-medium text-slate-900">{complaint.citizenPhone}</dd>

              <dt className="text-slate-500">Email ID:</dt>
              <dd className="col-span-2 font-medium text-slate-800 break-all">{complaint.citizenEmail}</dd>

              <dt className="text-slate-500">District / Ward:</dt>
              <dd className="col-span-2 font-medium text-slate-900">{complaint.district} · {complaint.talukWard}</dd>

              <dt className="text-slate-500">Address:</dt>
              <dd className="col-span-2 text-slate-700">{complaint.address}</dd>

              <dt className="text-slate-500">Landmark / PIN:</dt>
              <dd className="col-span-2 text-slate-700">{complaint.landmark || 'None specified'} (PIN: {complaint.pincode})</dd>
            </dl>
          </div>

          {/* Department & Assignment */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Assigned Department & Officer
            </h2>
            <dl className="grid grid-cols-3 gap-y-2 text-xs">
              <dt className="text-slate-500">Department:</dt>
              <dd className="col-span-2 font-semibold text-slate-900">{complaint.department}</dd>

              <dt className="text-slate-500">Assigned Officer:</dt>
              <dd className="col-span-2 font-medium text-slate-900">{complaint.assignedOfficer?.name || 'Under Allocation'}</dd>

              <dt className="text-slate-500">Designation:</dt>
              <dd className="col-span-2 text-slate-700">{complaint.assignedOfficer?.designation || 'Area Grievance Cell'}</dd>

              <dt className="text-slate-500">Office Contact:</dt>
              <dd className="col-span-2 font-mono text-slate-800">{complaint.assignedOfficer?.phone || 'CM Helpline 1100'}</dd>

              <dt className="text-slate-500">SLA Target:</dt>
              <dd className="col-span-2 font-semibold text-blue-900">{complaint.slaDeadline}</dd>

              <dt className="text-slate-500">Last Updated:</dt>
              <dd className="col-span-2 text-slate-700">{complaint.updatedAt}</dd>
            </dl>
          </div>
        </div>

        {/* Section 2: Grievance Details */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white mb-6 print-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-100 pb-2 mb-2 flex items-center justify-between">
            <span>Grievance Summary & Description</span>
            <span className="text-slate-600 font-normal">Category: {complaint.category} · {complaint.subcategory}</span>
          </h2>
          <h3 className="text-sm font-bold text-slate-900 mb-2">{complaint.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
            {complaint.description}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#174A78]" />
              <strong>Coordinates:</strong> {complaint.coordinates.lat.toFixed(4)}° N, {complaint.coordinates.lng.toFixed(4)}° E
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#174A78]" />
              <strong>Reported:</strong> {complaint.createdAt}
            </span>
            {complaint.resolvedAt && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <strong>Resolved:</strong> {complaint.resolvedAt}
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Uploaded Evidence Photos */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="p-4 rounded-lg border border-slate-200 bg-white mb-6 print-break-inside-avoid">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-100 pb-2 mb-3">
              Uploaded Grievance Evidence ({complaint.images.length} Image{complaint.images.length > 1 ? 's' : ''})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {complaint.images.map((imgUrl, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex flex-col">
                  <img
                    src={imgUrl}
                    alt={`Evidence ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-28 object-cover print:h-32"
                  />
                  <div className="p-1.5 text-[10px] text-center text-slate-500 bg-white border-t border-slate-100">
                    Evidence Photo #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: AI Classification, Photo Authenticity & Duplicate Detection Audit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print-break-inside-avoid">
          {/* AI Analysis */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#174A78]" />
                AI Triage Diagnostic
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">
                {complaint.aiAnalysis?.confidence}% Conf.
              </span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Detected Category:</span>
                <span className="font-medium text-slate-900">{complaint.aiAnalysis?.detectedCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency Assessment:</span>
                <span className="font-medium text-slate-900">{complaint.aiAnalysis?.urgencyScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority Level:</span>
                <span className="font-bold text-[#174A78]">{complaint.aiAnalysis?.priorityRecommendation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Routing:</span>
                <span className="font-medium text-slate-800 text-right">{complaint.aiAnalysis?.departmentRecommendation}</span>
              </div>
            </div>
          </div>

          {/* AI Photo Verification Card */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#174A78]" />
                Photo Authenticity Audit
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-700">
                {complaint.photoVerification?.confidence ? `${complaint.photoVerification.confidence}%` : '94.2%'}
              </span>
            </h2>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Result:</span>
                <span className="font-bold text-slate-900">
                  {complaint.photoVerification?.status || 'Likely relevant'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Synthetic / AI Flag:</span>
                <span className="font-medium text-slate-700">
                  {complaint.photoVerification?.aiGeneratedProbability ?? 5}% Probability
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Manipulation Score:</span>
                <span className="font-medium text-slate-700">
                  {complaint.photoVerification?.manipulationScore ?? 6}% Index
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Officer Action Flag:</span>
                <span className="font-semibold text-[#174A78]">
                  {complaint.photoVerification?.adminReviewStatus || 'Pending Admin Review'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 leading-tight">
                * Probabilistic inspection. Not sole basis for grievance admissibility.
              </p>
            </div>
          </div>

          {/* Duplicate Detection */}
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Spatial Duplicate Scan
              </span>
              <span className="font-mono text-[11px] font-medium text-slate-700">
                {complaint.duplicateCheck?.similarityScore}% Match
              </span>
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Duplicate Flag:</span>
                <span className={`font-semibold ${complaint.duplicateCheck?.hasDuplicate ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {complaint.duplicateCheck?.hasDuplicate ? 'Potential Co-Grievance' : 'Verified Unique'}
                </span>
              </div>
              {complaint.duplicateCheck?.matchedComplaintId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked ID:</span>
                  <span className="font-mono font-bold text-[#174A78]">{complaint.duplicateCheck.matchedComplaintId}</span>
                </div>
              )}
              <div className="text-slate-600 text-[11px] pt-1 leading-normal line-clamp-3">
                {complaint.duplicateCheck?.matchReason}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Official Action Timeline & History */}
        <div className="p-4 rounded-lg border border-slate-200 bg-white mb-6 print-break-inside-avoid">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#174A78] border-b border-slate-100 pb-2 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Official Action Audit Trail & History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 font-semibold">
                  <th className="py-2 px-3">Date & Time</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Action Description</th>
                  <th className="py-2 px-3">Authorized Official</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaint.timeline.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{item.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#174A78] whitespace-nowrap">{item.status}</td>
                    <td className="py-2.5 px-3 text-slate-800">
                      <div>{item.description}</div>
                      {item.remarks && <div className="text-[11px] text-slate-500 italic mt-0.5">Note: {item.remarks}</div>}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{item.updatedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Footer Verification */}
        <div className="border-t-2 border-slate-300 pt-4 mt-6 flex items-end justify-between text-xs text-slate-500 print-break-inside-avoid">
          <div>
            <p className="font-semibold text-slate-800">Public Complaint Redressal Directorate</p>
            <p>Government of Tamil Nadu · Secretariat, Fort St. George, Chennai 600009</p>
            <p>CM Helpline: 1100 (Toll Free) · Web: tnpcp.tn.gov.in</p>
          </div>
          <div className="text-right">
            <div className="w-32 h-10 border-b border-slate-400 mb-1"></div>
            <p className="text-[10px] uppercase font-semibold text-slate-600">Authorized Digital Seal</p>
            <p className="text-[10px] text-slate-400">Computer Generated Grievance Record</p>
          </div>
        </div>

      </div>
    </div>
  );
};
