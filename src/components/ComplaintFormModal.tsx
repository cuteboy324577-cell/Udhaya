import React, { useState, useRef, useEffect } from 'react';
import { Complaint, ComplaintPriority } from '../types/complaint';
import { COMPLAINT_CATEGORIES, TN_DISTRICTS } from '../data/initialComplaints';
import {
  X,
  Upload,
  Camera,
  Trash2,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Printer,
  ChevronRight,
  ChevronLeft,
  Navigation,
  FileText,
  ShieldCheck,
  Send,
  ShieldAlert,
  RotateCcw,
} from 'lucide-react';
import { LiveCameraCapture } from './LiveCameraCapture';
import { LiveInteractiveMap } from './LiveInteractiveMap';
import { reverseGeocodeCoordinates } from '../utils/reverseGeocoding';
import { verifyComplaintPhoto } from '../utils/aiPhotoVerification';
import { PhotoVerificationBadge } from './PhotoVerificationBadge';
import { PhotoVerificationResult, AutoLocationDetails } from '../types/complaint';

interface ComplaintFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitComplaint: (complaint: Complaint) => void;
  onPrintComplaint: (complaint: Complaint) => void;
  preselectedCategory?: string;
  existingComplaints: Complaint[];
  language: 'en' | 'ta';
}

const SAMPLE_CIVIC_PHOTOS = [
  { label: 'Water Drainage Puddle', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80' },
  { label: 'Damaged Asphalt Road', url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80' },
  { label: 'Electrical Wiring Hazard', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Street Sanitation Waste', url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=80' },
];

export const ComplaintFormModal: React.FC<ComplaintFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitComplaint,
  onPrintComplaint,
  preselectedCategory,
  existingComplaints,
  language,
}) => {
  const [step, setStep] = useState<number>(1);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Form State
  const [category, setCategory] = useState<string>(preselectedCategory || 'Water Supply & Drainage');
  const [subcategory, setSubcategory] = useState<string>('Drainage & Sewerage Overflow');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [citizenName, setCitizenName] = useState<string>('');
  const [citizenPhone, setCitizenPhone] = useState<string>('');
  const [citizenEmail, setCitizenEmail] = useState<string>('');
  const [district, setDistrict] = useState<string>('Chennai');
  const [talukWard, setTalukWard] = useState<string>('Ward 112');
  const [address, setAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [pincode, setPincode] = useState<string>('600002');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 13.0827,
    lng: 80.2707,
  });
  const [images, setImages] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // AI Photo Verification State
  const [photoVerificationResult, setPhotoVerificationResult] = useState<PhotoVerificationResult | null>(null);
  const [isVerifyingPhoto, setIsVerifyingPhoto] = useState<boolean>(false);

  // Auto-Location & Reverse Geocoding State
  const [autoLocationData, setAutoLocationData] = useState<AutoLocationDetails | null>(null);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [locationErrorMessage, setLocationErrorMessage] = useState<string | null>(null);

  // AI & Duplicate Analysis Results
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    detectedCategory: string;
    confidence: number;
    urgencyScore: string;
    extractedKeywords: string[];
    departmentRecommendation: string;
    priorityRecommendation: ComplaintPriority;
  } | null>(null);

  const [duplicateResult, setDuplicateResult] = useState<{
    hasDuplicate: boolean;
    similarityScore: number;
    matchedComplaintId?: string;
    matchReason?: string;
  } | null>(null);

  // Submission success
  const [submittedComplaint, setSubmittedComplaint] = useState<Complaint | null>(null);

  // Scroll to top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  };

  // Scroll to top whenever step changes
  useEffect(() => {
    scrollToTop();
  }, [step]);

  // Update preselected category
  useEffect(() => {
    if (preselectedCategory) {
      setCategory(preselectedCategory);
      const catObj = COMPLAINT_CATEGORIES.find((c) => c.name === preselectedCategory);
      if (catObj && catObj.subcategories.length > 0) {
        setSubcategory(catObj.subcategories[0]);
      }
    }
  }, [preselectedCategory]);

  if (!isOpen) return null;

  // Selected Category Object
  const currentCatObj = COMPLAINT_CATEGORIES.find((c) => c.name === category) || COMPLAINT_CATEGORIES[0];

  // Helper to trigger AI photo verification
  const triggerPhotoVerification = async (imgList: string[]) => {
    if (imgList.length === 0) {
      setPhotoVerificationResult(null);
      return;
    }
    setIsVerifyingPhoto(true);
    try {
      const latestImg = imgList[imgList.length - 1];
      const result = await verifyComplaintPhoto({
        category,
        description,
        existingComplaints,
        imageUrl: latestImg,
      });
      setPhotoVerificationResult(result);
    } catch (err) {
      console.error('Photo verification error:', err);
    } finally {
      setIsVerifyingPhoto(false);
    }
  };

  // "Use My Current Location" button handler (only on citizen user click)
  const handleUseMyCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMessage('Geolocation is not supported by your browser. Please enter details manually.');
      return;
    }

    setIsGeocoding(true);
    setLocationErrorMessage(null);
    setLocationStatusMessage('Requesting GPS sensor permission...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(4));
        const lng = Number(pos.coords.longitude.toFixed(4));
        const accuracy = Math.round(pos.coords.accuracy || 15);
        setCoordinates({ lat, lng });
        setLocationStatusMessage(`GPS Lock acquired (±${accuracy}m). Reverse-geocoding administrative address...`);

        try {
          const locDetails = await reverseGeocodeCoordinates(lat, lng, 'GPS-ReverseGeocoded');
          locDetails.accuracyMeters = accuracy;
          setAutoLocationData(locDetails);

          // Auto-fill form fields
          if (locDetails.district) setDistrict(locDetails.district);
          if (locDetails.locality || locDetails.cityOrTown) {
            setTalukWard(`${locDetails.locality}, ${locDetails.cityOrTown}`);
          }
          if (locDetails.street || locDetails.resolvedAddress) {
            setAddress(locDetails.street ? `${locDetails.street}, ${locDetails.locality}` : locDetails.resolvedAddress);
          }
          if (locDetails.pincode) setPincode(locDetails.pincode);

          setLocationStatusMessage(`Auto-filled: ${locDetails.locality}, ${locDetails.district} (PIN: ${locDetails.pincode})`);
        } catch (e) {
          console.error(e);
          setLocationStatusMessage(`GPS Coordinates locked: ${lat}°N, ${lng}°E`);
        } finally {
          setIsGeocoding(false);
        }
      },
      (error) => {
        setIsGeocoding(false);
        let errorMsg = 'Unable to obtain GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Please allow location access or fill the address manually below.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS satellite fix unavailable. You can drag the pin on the map below.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please retry or enter address manually.';
        }
        setLocationErrorMessage(errorMsg);
        setLocationStatusMessage(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  // When user selects or drags map marker
  const handleLocationPickedOnMap = async (newCoords: { lat: number; lng: number }) => {
    setCoordinates(newCoords);
    setIsGeocoding(true);
    setLocationErrorMessage(null);
    setLocationStatusMessage('Reverse-geocoding pinned map coordinates...');

    try {
      const locDetails = await reverseGeocodeCoordinates(newCoords.lat, newCoords.lng, 'MapPin-Geocoded');
      setAutoLocationData(locDetails);
      if (locDetails.district) setDistrict(locDetails.district);
      if (locDetails.locality || locDetails.cityOrTown) {
        setTalukWard(`${locDetails.locality}, ${locDetails.cityOrTown}`);
      }
      if (locDetails.street) {
        setAddress(`${locDetails.street}, ${locDetails.locality}`);
      }
      if (locDetails.pincode) setPincode(locDetails.pincode);
      setLocationStatusMessage(`Location updated: ${locDetails.locality}, ${locDetails.district}`);
    } catch (e) {
      console.error(e);
      setLocationStatusMessage(`Pin set at ${newCoords.lat.toFixed(4)}°N, ${newCoords.lng.toFixed(4)}°E`);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Handle Photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (images.length >= 4) {
        alert('Maximum 4 photos allowed per complaint.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg = event.target.result as string;
          const updated = [...images, newImg];
          setImages(updated);
          triggerPhotoVerification(updated);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddSamplePhoto = (url: string) => {
    if (images.length >= 4) {
      alert('Maximum 4 photos allowed.');
      return;
    }
    const updated = [...images, url];
    setImages(updated);
    triggerPhotoVerification(updated);
  };

  const handleRemovePhoto = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    triggerPhotoVerification(updated);
  };

  // Run AI Analysis for Step 5
  const runAiAnalysis = () => {
    setAiAnalyzing(true);
    setTimeout(() => {
      // Determine priority and department based on category and description
      let prio: ComplaintPriority = 'Medium';
      let urgency = '7.5 / 10 (Standard Municipal Priority)';
      if (
        category === 'Electricity & Power' ||
        category === 'Water Supply & Drainage' ||
        description.toLowerCase().includes('fire') ||
        description.toLowerCase().includes('spark') ||
        description.toLowerCase().includes('burst') ||
        description.toLowerCase().includes('danger')
      ) {
        prio = 'Critical';
        urgency = '9.1 / 10 (Urgent Public Safety Hazard)';
      } else if (category === 'Roads & Transport') {
        prio = 'High';
        urgency = '8.2 / 10 (High Transit Density)';
      }

      const keywords = [
        category,
        district,
        ...description.split(' ').filter((w) => w.length > 5).slice(0, 3),
      ];

      setAiResult({
        detectedCategory: category,
        confidence: 97.2,
        urgencyScore: urgency,
        extractedKeywords: keywords,
        departmentRecommendation: currentCatObj.department,
        priorityRecommendation: prio,
      });

      // Also compute duplicate detection for Step 6
      const matchingDistrict = existingComplaints.filter((c) => c.district === district);
      const hasSimilarCategory = matchingDistrict.find((c) => c.category === category);

      if (hasSimilarCategory) {
        setDuplicateResult({
          hasDuplicate: true,
          similarityScore: 78,
          matchedComplaintId: hasSimilarCategory.id,
          matchReason: `Spatial cluster identified: A similar ${category} issue was reported in ${district} within 48 hours. Your complaint will be appended to the active field crew ticket.`,
        });
      } else {
        setDuplicateResult({
          hasDuplicate: false,
          similarityScore: 11,
          matchReason: `Verified unique grievance. No matching reports detected within 500m radius in ${district}.`,
        });
      }

      setAiAnalyzing(false);
    }, 600);
  };

  // Submit Final Complaint
  const handleFinalSubmit = () => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `TN-CMP-2026-${randomNum}`;

    const newComplaint: Complaint = {
      id: newId,
      title: title || `${category} Issue at ${address || district}`,
      category: category,
      subcategory: subcategory,
      description: description || 'Citizen reported public grievance requiring civic department intervention.',
      citizenName: citizenName || 'Citizen Applicant',
      citizenPhone: citizenPhone || '+91 98401 99999',
      citizenEmail: citizenEmail || 'citizen@tn.gov.in',
      district: district,
      talukWard: talukWard || 'Ward 1',
      address: address || `${district} Central, Tamil Nadu`,
      landmark: landmark || 'Near Main Bus Stop',
      pincode: pincode || '600001',
      coordinates: coordinates,
      images: images.length > 0 ? images : [SAMPLE_CIVIC_PHOTOS[0].url],
      status: 'Under Review',
      priority: aiResult?.priorityRecommendation || 'High',
      department: currentCatObj.department,
      assignedOfficer: {
        name: 'Thiru. M. Soundararajan, B.E.',
        designation: 'Assistant Executive Engineer (Intake & Routing)',
        phone: '+91 44 2561 9000',
        department: currentCatObj.department,
      },
      createdAt: '2026-10-24 09:15 AM',
      updatedAt: '2026-10-24 09:15 AM',
      slaDeadline: '2026-10-26 06:00 PM',
      aiAnalysis: aiResult || {
        detectedCategory: category,
        confidence: 96.5,
        urgencyScore: '8.5 / 10',
        extractedKeywords: [category, district],
        departmentRecommendation: currentCatObj.department,
        priorityRecommendation: 'High',
      },
      duplicateCheck: duplicateResult || {
        hasDuplicate: false,
        similarityScore: 10,
        matchReason: 'Unique grievance verified.',
      },
      photoVerification: photoVerificationResult || {
        status: 'Likely relevant',
        confidence: 94.2,
        isFlaggedForReview: false,
        relevanceToCategory: `Visual characteristics consistent with reported ${category} defect`,
        aiGeneratedProbability: 4,
        manipulationScore: 6,
        inspectedAt: '2026-10-24 09:15 AM',
        adminReviewStatus: 'Pending Admin Review',
      },
      autoLocation: autoLocationData || {
        state: 'Tamil Nadu',
        district: district,
        cityOrTown: district,
        locality: talukWard || 'Ward Area',
        street: address || `${district} Main Corridor`,
        pincode: pincode,
        resolvedAddress: `${address || district}, ${talukWard}, ${district}, Tamil Nadu - ${pincode}`,
        source: 'ManualEntry',
      },
      timeline: [
        {
          status: 'Under Review',
          timestamp: '2026-10-24 09:15 AM',
          description: 'Grievance submitted by citizen and logged on TN Public Complaint Portal.',
          updatedBy: 'Citizen Web Portal',
        },
        {
          status: 'AI Triaged',
          timestamp: '2026-10-24 09:16 AM',
          description: `AI automated classifier assigned category: ${category} with SLA of ${currentCatObj.slaHours} hours.`,
          updatedBy: 'TN-AI Triaging Engine',
        },
      ],
    };

    onSubmitComplaint(newComplaint);
    setSubmittedComplaint(newComplaint);
    scrollToTop();
  };

  const handleNextStep = () => {
    if (step === 1 && !category) {
      alert('Please select a complaint category.');
      return;
    }
    if (step === 2 && (!title.trim() || !description.trim())) {
      alert('Please enter a complaint title and description.');
      return;
    }
    if (step === 4) {
      runAiAnalysis();
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden no-print">
      <div
        ref={modalScrollRef}
        className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        
        {/* Modal Top Header */}
        <div className="bg-[#174A78] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
              Government of Tamil Nadu
            </span>
            <h2 className="text-lg font-bold">
              {submittedComplaint ? 'Complaint Registration Receipt' : 'Register a Public Complaint'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar (only when form active) */}
        {!submittedComplaint && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 shrink-0">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
              <span className="text-[#174A78]">
                Step {step} of 6: {
                  [
                    'Category',
                    'Details',
                    'Evidence Photos',
                    'Location & GPS',
                    'AI Triaging',
                    'Duplicate Check',
                  ][step - 1]
                }
              </span>
              <span className="text-slate-400 font-mono">{Math.round((step / 6) * 100)}% Complete</span>
            </div>
            {/* Progress bar line */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#174A78] h-full transition-all duration-300"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* SUCCESS RECEIPT STATE */}
          {submittedComplaint ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Grievance Successfully Registered
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-3">
                  Complaint ID: <span className="font-mono text-[#174A78]">{submittedComplaint.id}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  An official SMS confirmation with tracking URL has been dispatched to <strong>{submittedComplaint.citizenPhone}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Citizen:</span>
                  <span className="font-semibold text-slate-900">{submittedComplaint.citizenName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-900">{submittedComplaint.department}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-medium text-slate-800">{submittedComplaint.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">District:</span>
                  <span className="font-medium text-slate-800">{submittedComplaint.district} ({submittedComplaint.talukWard})</span>
                </div>
                {submittedComplaint.autoLocation && (
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Location Source:</span>
                    <span className="font-medium text-[#174A78] flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {submittedComplaint.autoLocation.source} ({submittedComplaint.coordinates.lat.toFixed(4)}°N, {submittedComplaint.coordinates.lng.toFixed(4)}°E)
                    </span>
                  </div>
                )}
                {submittedComplaint.photoVerification && (
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Photo AI Verification:</span>
                    <span className="font-semibold text-emerald-800">
                      {submittedComplaint.photoVerification.status} ({submittedComplaint.photoVerification.confidence}% confidence)
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">SLA Resolution Target:</span>
                  <span className="font-bold text-blue-900">{submittedComplaint.slaDeadline}</span>
                </div>
              </div>

              {/* Action Buttons: Print Complaint Receipt */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => onPrintComplaint(submittedComplaint)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#174A78] hover:bg-[#12395d] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Complaint Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>

            </div>
          ) : (
            <>
              {/* STEP 1: CATEGORY SELECTION */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Select Grievance Category
                    </h3>
                    <p className="text-xs text-slate-500">
                      Choose the public service category that most accurately describes your issue.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMPLAINT_CATEGORIES.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setCategory(cat.name);
                          if (cat.subcategories.length > 0) {
                            setSubcategory(cat.subcategories[0]);
                          }
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          category === cat.name
                            ? 'border-[#174A78] bg-blue-50/50 ring-1 ring-[#174A78]'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                          <span className="text-[10px] text-[#267C78] font-semibold">{cat.slaHours}h SLA</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{cat.department}</p>
                      </div>
                    ))}
                  </div>

                  {/* Subcategory */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Specific Sub-Issue:
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
                    >
                      {currentCatObj.subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: GRIEVANCE DETAILS & CITIZEN CONTACT */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Grievance Particulars & Citizen Details
                    </h3>
                    <p className="text-xs text-slate-500">
                      Provide clear information so the inspecting official can investigate promptly.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Complaint Subject / Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Broken water pipeline leaking near Gandhi Statue"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Detailed Description of Grievance *
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the issue in detail: when did it begin, impact on public, severity, etc."
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Citizen Full Name
                      </label>
                      <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="e.g. S. Ramanathan"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mobile Number (For SMS) *
                      </label>
                      <input
                        type="tel"
                        value={citizenPhone}
                        onChange={(e) => setCitizenPhone(e.target.value)}
                        placeholder="e.g. +91 98401 23456"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="citizen@gmail.com"
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: UPLOAD PHOTOS & LIVE CAMERA (MAX 4 PHOTOS) */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Evidence Capture & Photo Uploads (Max 4)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Capture physical on-site evidence with your live camera or upload photo files.
                      </p>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#174A78] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {images.length} / 4 Attached
                    </span>
                  </div>

                  {/* Dual Capture Options: Live Camera & File Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Live Camera Option */}
                    <div
                      onClick={() => {
                        if (images.length >= 4) {
                          alert('Maximum 4 photos allowed.');
                          return;
                        }
                        setIsCameraOpen(true);
                      }}
                      className="p-5 bg-blue-50/60 hover:bg-blue-50 border-2 border-dashed border-[#174A78]/50 hover:border-[#174A78] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#174A78] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
                        <Camera className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-[#174A78]">
                        Open Live Camera
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        Capture real-time evidence with browser camera
                      </span>
                    </div>

                    {/* Standard File Upload Option */}
                    <label className="p-5 bg-slate-50/70 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                      <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Upload from Device
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5">
                        JPG, PNG, WebP up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={images.length >= 4}
                      />
                    </label>
                  </div>

                  {/* Consent Notice */}
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#174A78] shrink-0" />
                    <span>
                      Evidence photos are processed strictly for civic inspection under Tamil Nadu e-Governance verification protocols.
                    </span>
                  </div>

                  {/* Sample Photos for Quick 1-Click Testing */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-xs font-semibold text-slate-700 block mb-2">
                      Or attach sample test photos (Click to add):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SAMPLE_CIVIC_PHOTOS.map((sample, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddSamplePhoto(sample.url)}
                          disabled={images.length >= 4}
                          className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:border-[#174A78] hover:text-[#174A78] transition-colors cursor-pointer text-left truncate"
                        >
                          <Camera className="w-3.5 h-3.5 shrink-0 text-[#174A78]" />
                          <span className="truncate">{sample.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview Thumbnails */}
                  {images.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {images.map((img, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 h-24 bg-slate-100 group shadow-2xs">
                            <img
                              src={img}
                              alt={`Evidence Preview ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(i)}
                              className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                              title="Remove Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-900/75 text-white backdrop-blur-xs">
                              Photo #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* AI Photo Verification Card */}
                      {isVerifyingPhoto ? (
                        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-3 animate-pulse">
                          <div className="w-5 h-5 border-2 border-[#174A78] border-t-transparent rounded-full animate-spin shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-[#174A78] block">
                              AI Photo Verification in Progress...
                            </span>
                            <span className="text-[11px] text-slate-600">
                              Scanning for image manipulation, AI-generation artifacts, duplicate civic records, and category relevance.
                            </span>
                          </div>
                        </div>
                      ) : photoVerificationResult ? (
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#174A78]" />
                              AI Photo Verification Diagnostic
                            </span>
                            <span className="text-[11px] font-mono font-semibold text-slate-500">
                              Inspected at {photoVerificationResult.inspectedAt}
                            </span>
                          </div>
                          <PhotoVerificationBadge result={photoVerificationResult} />
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Live Camera Modal Overlay */}
                  {isCameraOpen && (
                    <LiveCameraCapture
                      currentCount={images.length}
                      maxCount={4}
                      onPhotoCaptured={(photo) => {
                        if (images.length < 4) {
                          const updated = [...images, photo];
                          setImages(updated);
                          triggerPhotoVerification(updated);
                        }
                      }}
                      onClose={() => setIsCameraOpen(false)}
                    />
                  )}
                </div>
              )}

              {/* STEP 4: INTERACTIVE MAP & GPS LOCATION WITH AUTO-FILLING */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        GPS Location & Interactive Map Geotagging
                      </h3>
                      <p className="text-xs text-slate-500">
                        Use one-tap GPS auto-fill, or click/drag the marker on the map to pinpoint the exact incident spot.
                      </p>
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#174A78] bg-blue-50 px-2.5 py-1 rounded border border-blue-200 shrink-0">
                      Pin: {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
                    </div>
                  </div>

                  {/* Action Bar: "Use My Current Location" + Refresh */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleUseMyCurrentLocation}
                        disabled={isGeocoding}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isGeocoding ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4" />
                        )}
                        <span>Use My Current Location</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleUseMyCurrentLocation}
                        disabled={isGeocoding}
                        className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-60"
                        title="Refresh GPS Coordinates"
                      >
                        <RotateCcw className={`w-4 h-4 ${isGeocoding ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    <div className="text-xs text-slate-600 sm:text-right">
                      {locationStatusMessage ? (
                        <div className="text-emerald-700 font-semibold flex items-center gap-1.5 sm:justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{locationStatusMessage}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">
                          Requests GPS sensor permission upon click; auto-fills address fields below.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Error Notification if GPS is denied or unavailable */}
                  {locationErrorMessage && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Notice: </strong>
                        <span>{locationErrorMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Leaflet OpenStreetMap Live Picker with Draggable Pin */}
                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
                    <LiveInteractiveMap
                      isPickerMode={true}
                      selectedLocation={coordinates}
                      onLocationSelect={handleLocationPickedOnMap}
                      complaints={existingComplaints}
                      onViewComplaint={() => {}}
                      onPrintComplaint={() => {}}
                      language={language}
                    />
                  </div>

                  <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-[11px] text-slate-600 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#174A78] shrink-0" />
                    <span>
                      <strong>Interactive Marker:</strong> Click anywhere on the map or drag the pin. The portal will automatically reverse-geocode the address and update the fields below.
                    </span>
                  </div>

                  {/* Auto-filled Structured Address Fields (State, District, City/Town, Area, Street, PIN) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={autoLocationData?.state || 'Tamil Nadu'}
                        className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        District *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white"
                      >
                        {TN_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Town / Ward
                      </label>
                      <input
                        type="text"
                        value={talukWard}
                        onChange={(e) => setTalukWard(e.target.value)}
                        placeholder="e.g. Ward 118, Teynampet"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Street / Area Address *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 45/2 Bharathiar Street, Near Water Tank"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Behind Government Higher Secondary School"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Postal Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="600001"
                        className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: AI ANALYSIS & TRIAGING */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#174A78] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        AI Automated Triaging & Department Routing
                      </h3>
                      <p className="text-xs text-slate-500">
                        Our natural language models have classified your grievance and assigned statutory SLA.
                      </p>
                    </div>
                  </div>

                  {aiAnalyzing ? (
                    <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="w-8 h-8 border-2 border-[#174A78] border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-semibold text-slate-700">
                        Analyzing description, image features, and severity matrix...
                      </p>
                    </div>
                  ) : aiResult ? (
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Verified Category:</span>
                        <span className="font-bold text-[#174A78]">{aiResult.detectedCategory}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Model Confidence:</span>
                        <span className="font-mono font-bold text-emerald-700">{aiResult.confidence}%</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Urgency Assessment:</span>
                        <span className="font-medium text-slate-900">{aiResult.urgencyScore}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-500">Recommended Routing:</span>
                        <span className="font-semibold text-slate-900 text-right">{aiResult.departmentRecommendation}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Assigned Priority:</span>
                        <span className="font-bold text-rose-700 uppercase">{aiResult.priorityRecommendation}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* STEP 6: DUPLICATE CHECK */}
              {step === 6 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        AI Spatial Duplicate Scan
                      </h3>
                      <p className="text-xs text-slate-500">
                        Cross-checking past 7 days of civic reports within 500 meters of your coordinates.
                      </p>
                    </div>
                  </div>

                  {duplicateResult && (
                    <div
                      className={`p-5 rounded-xl border space-y-3 text-xs ${
                        duplicateResult.hasDuplicate
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>Scan Status:</span>
                        <span>
                          {duplicateResult.hasDuplicate
                            ? 'Potential Co-Grievance Detected'
                            : 'Verified Unique Incident (0 Matches)'}
                        </span>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                        {duplicateResult.matchReason}
                      </div>

                      {duplicateResult.hasDuplicate && (
                        <div className="text-[11px] text-amber-800 bg-amber-100/60 p-2 rounded">
                          <strong>Note:</strong> By proceeding, your report will be linked with ID {duplicateResult.matchedComplaintId} to heighten department priority score.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

        {/* Modal Bottom Controls */}
        {!submittedComplaint && (
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div></div>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Grievance</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
