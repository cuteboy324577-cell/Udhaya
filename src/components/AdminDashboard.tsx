import React, { useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  SmsNotification,
  PhotoVerificationResult,
} from '../types/complaint';
import { TN_DISTRICTS } from '../data/initialComplaints';
import {
  Printer,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  MessageSquare,
  Shield,
  Building2,
  AlertCircle,
  FileText,
  UserCheck,
  Send,
  LogOut,
  ChevronDown,
  Sparkles,
  MapPin,
  Navigation,
  Camera,
  Check,
} from 'lucide-react';
import { PhotoVerificationBadge } from './PhotoVerificationBadge';

interface AdminDashboardProps {
  complaints: Complaint[];
  smsLogs: SmsNotification[];
  onUpdateComplaint: (updated: Complaint, newSms?: SmsNotification) => void;
  onPrintComplaint: (complaint: Complaint) => void;
  onLogout: () => void;
  language: 'en' | 'ta';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  complaints,
  smsLogs,
  onUpdateComplaint,
  onPrintComplaint,
  onLogout,
  language,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(complaints[0] || null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSmsModal, setShowSmsModal] = useState<boolean>(false);

  // Status update state for selected complaint
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('High');
  const [officialRemark, setOfficialRemark] = useState<string>('');
  const [reassignDept, setReassignDept] = useState<string>('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handlePhotoReviewDecision = (decision: 'Verified Genuine' | 'Flagged Suspicious') => {
    if (!selectedComplaint) return;

    const timeStr = '2026-10-24 09:35 AM';
    const existingPv = selectedComplaint.photoVerification || {
      status: 'Likely relevant',
      confidence: 94.2,
      isFlaggedForReview: false,
      inspectedAt: timeStr,
    };

    const updatedVerification: PhotoVerificationResult = {
      ...existingPv,
      adminReviewStatus: decision,
      isFlaggedForReview: decision === 'Flagged Suspicious',
    };

    const updatedTimeline = [
      ...selectedComplaint.timeline,
      {
        status: selectedComplaint.status,
        timestamp: timeStr,
        description: `Officer Photo Inspection: Visual evidence reviewed and marked as [${decision}].`,
        updatedBy: 'Thiru. K. Rajagopalan (Special Grievance Officer)',
        remarks: decision === 'Verified Genuine' ? 'Visual evidence verified against field location.' : 'Flagged for on-site physical field confirmation.',
      },
    ];

    const updatedComplaint: Complaint = {
      ...selectedComplaint,
      photoVerification: updatedVerification,
      updatedAt: timeStr,
      timeline: updatedTimeline,
    };

    onUpdateComplaint(updatedComplaint);
    setSelectedComplaint(updatedComplaint);
  };

  useEffect(() => {
    if (selectedComplaint) {
      setNewStatus(selectedComplaint.status);
      setNewPriority(selectedComplaint.priority);
      setReassignDept(selectedComplaint.department);
      setOfficialRemark('');
    }
  }, [selectedComplaint]);

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (districtFilter !== 'All' && c.district !== districtFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApplyStatusChange = () => {
    if (!selectedComplaint) return;

    const timeStr = '2026-10-24 09:30 AM';
    const isResolved = newStatus === 'Resolved';

    const updatedTimeline = [
      ...selectedComplaint.timeline,
      {
        status: newStatus,
        timestamp: timeStr,
        description: `Official status update: Changed to ${newStatus}. Priority: ${newPriority}. Department: ${reassignDept}.`,
        updatedBy: 'Thiru. K. Rajagopalan (Special Grievance Officer)',
        remarks: officialRemark || 'Standard procedural review completed.',
      },
    ];

    const updatedComplaint: Complaint = {
      ...selectedComplaint,
      status: newStatus,
      priority: newPriority,
      department: reassignDept || selectedComplaint.department,
      updatedAt: timeStr,
      resolvedAt: isResolved ? timeStr : selectedComplaint.resolvedAt,
      timeline: updatedTimeline,
    };

    // Simulated SMS dispatch to citizen
    const newSms: SmsNotification = {
      id: `SMS-${Math.floor(100 + Math.random() * 900)}`,
      complaintId: selectedComplaint.id,
      recipientPhone: selectedComplaint.citizenPhone,
      recipientName: selectedComplaint.citizenName,
      message: `Govt of TN: Your Grievance ${selectedComplaint.id} status updated to [${newStatus}]. Note: ${officialRemark || 'Action initiated'}. Track: tnpcp.tn.gov.in`,
      sentAt: timeStr,
      status: 'Delivered',
    };

    onUpdateComplaint(updatedComplaint, newSms);
    setSelectedComplaint(updatedComplaint);
    alert(`Status updated to "${newStatus}". SMS alert dispatched to ${selectedComplaint.citizenPhone}`);
  };

  return (
    <div className="bg-[#F5F7FA] min-h-screen pb-16 print:hidden no-print">
      
      {/* Admin Top Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center border border-blue-200">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#174A78]">
                  State Grievance Administration Console
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Officer Authenticated
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Tamil Nadu Grievance Redressal Officer Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-4 h-4 text-[#174A78]" />
              <span>SMS Dispatch Log ({smsLogs.length})</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Complaint ID, citizen name, or keywords..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#174A78]"
            >
              <option value="All">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Verified & Assigned">Verified & Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#174A78]"
            >
              <option value="All">All Districts</option>
              {TN_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Column Split: Table List + Action Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table List */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Grievance Queue ({filtered.length} Records)
              </h3>
              <span className="text-[11px] text-slate-500">Click a record to inspect & process</span>
            </div>

            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Complaint ID</th>
                    <th className="py-2.5 px-3">Category & Title</th>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Photo AI</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => {
                    const isSelected = selectedComplaint?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedComplaint(item)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/80 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-3 font-mono font-bold text-[#174A78] whitespace-nowrap">
                          {item.id}
                        </td>
                        <td className="py-3 px-3 max-w-[200px]">
                          <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{item.category}</div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                          {item.district}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          {item.photoVerification ? (
                            <PhotoVerificationBadge result={item.photoVerification} compact={true} />
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Likely relevant
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              item.status === 'Resolved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : item.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : item.status === 'Verified & Assigned'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPrintComplaint(item);
                            }}
                            className="p-1.5 rounded hover:bg-slate-200 text-[#174A78] transition-colors cursor-pointer"
                            title="Print this complaint record"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Action & Verification Panel */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-md p-5 sm:p-6 space-y-5">
            {selectedComplaint ? (
              <>
                {/* Header of Inspector */}
                <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#174A78] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {selectedComplaint.id}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {selectedComplaint.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => onPrintComplaint(selectedComplaint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                </div>

                {/* Grievance Facts */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Citizen:</span>
                    <span className="font-semibold text-slate-900">{selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-900">{selectedComplaint.district} · {selectedComplaint.talukWard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target SLA:</span>
                    <span className="font-bold text-blue-900">{selectedComplaint.slaDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">AI Triage Conf:</span>
                    <span className="font-mono font-bold text-[#174A78]">{selectedComplaint.aiAnalysis.confidence}%</span>
                  </div>
                </div>

                {/* Attached Evidence Photographs */}
                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-[#174A78]" />
                      Uploaded Grievance Evidence ({selectedComplaint.images.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedComplaint.images.map((img, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 h-20 bg-slate-100 group shadow-2xs">
                          <img
                            src={img}
                            alt={`Evidence ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded text-[8px] font-bold bg-slate-900/75 text-white">
                            Photo #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Photo Verification & Officer Decision Card */}
                {selectedComplaint.photoVerification && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#174A78] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#174A78]" />
                        AI Photo Verification Diagnostic
                      </h4>
                      <span className="text-[11px] font-mono font-bold text-slate-600">
                        {selectedComplaint.photoVerification.confidence}% Conf.
                      </span>
                    </div>

                    <PhotoVerificationBadge result={selectedComplaint.photoVerification} />

                    {/* Officer Visual Evidence Determination Buttons */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-700">Officer Verification Status:</span>
                        <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          selectedComplaint.photoVerification.adminReviewStatus === 'Verified Genuine'
                            ? 'bg-emerald-100 text-emerald-800'
                            : selectedComplaint.photoVerification.adminReviewStatus === 'Flagged Suspicious'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedComplaint.photoVerification.adminReviewStatus || 'Pending Admin Review'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePhotoReviewDecision('Verified Genuine')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark Verified Genuine</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePhotoReviewDecision('Flagged Suspicious')}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-700 hover:bg-rose-800 text-white rounded text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Flag Suspicious</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-Location Geocoding Card */}
                {selectedComplaint.autoLocation && (
                  <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[#174A78] border-b border-blue-200/60 pb-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Incident Geocoded Location
                      </span>
                      <span className="font-mono text-[10px] bg-blue-100 text-[#174A78] px-1.5 py-0.5 rounded">
                        {selectedComplaint.autoLocation.source}
                      </span>
                    </div>
                    <div className="text-slate-800 pt-0.5 font-medium">
                      {selectedComplaint.autoLocation.resolvedAddress}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Coordinates: {selectedComplaint.coordinates.lat.toFixed(4)}°N, {selectedComplaint.coordinates.lng.toFixed(4)}°E
                    </div>
                  </div>
                )}

                {/* Status Update Form */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#174A78]">
                    Officer Administrative Action
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Update Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white"
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="Verified & Assigned">Verified & Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Priority Level
                      </label>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Assigned Department / Agency
                    </label>
                    <input
                      type="text"
                      value={reassignDept}
                      onChange={(e) => setReassignDept(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Remarks / Work Order Details
                    </label>
                    <textarea
                      rows={3}
                      value={officialRemark}
                      onChange={(e) => setOfficialRemark(e.target.value)}
                      placeholder="e.g. Field crew dispatched with drainage suction vehicle. Expected completion in 4 hours."
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                    />
                  </div>

                  {/* Submit Update Button */}
                  <button
                    onClick={handleApplyStatusChange}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#174A78] hover:bg-[#12395d] text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Apply Action & Send SMS to Citizen</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">
                Select a grievance from the queue to process.
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SMS Logs Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#174A78]" />
                <h3 className="text-base font-bold text-slate-900">
                  Citizen SMS Notification Dispatch Trail
                </h3>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {smsLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1.5 font-semibold">
                    <span className="font-mono text-[#174A78]">{log.complaintId}</span>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.status} · {log.sentAt}
                    </span>
                  </div>
                  <div className="text-slate-700 mb-1">
                    To: <strong>{log.recipientName}</strong> ({log.recipientPhone})
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 text-slate-600 font-mono text-[11px] leading-relaxed">
                    &ldquo;{log.message}&rdquo;
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
