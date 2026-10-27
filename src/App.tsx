import React, { useState, useEffect } from 'react';
import { Complaint, SmsNotification } from './types/complaint';
import { INITIAL_COMPLAINTS, INITIAL_SMS_LOGS } from './data/initialComplaints';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatisticsSection } from './components/StatisticsSection';
import { CategoryCards } from './components/CategoryCards';
import { RecentComplaintsSection } from './components/RecentComplaintsSection';
import { TrackComplaintSection } from './components/TrackComplaintSection';
import { TamilNaduMapSection } from './components/TamilNaduMapSection';
import { AboutPortalSection } from './components/AboutPortalSection';
import { Footer } from './components/Footer';
import { ComplaintFormModal } from './components/ComplaintFormModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { PrintComplaintDossier } from './components/PrintComplaintDossier';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';

export default function App() {
  // Navigation View: 'home' | 'report' | 'track' | 'map' | 'analytics' | 'admin'
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  // Application Data
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('tn_pcp_complaints');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((c: Complaint) => {
          const match = INITIAL_COMPLAINTS.find((ic) => ic.id === c.id);
          return {
            ...c,
            photoVerification: c.photoVerification || match?.photoVerification || {
              status: 'Likely relevant',
              confidence: 94.2,
              isFlaggedForReview: false,
              relevanceToCategory: `Visual characteristics consistent with reported ${c.category} grievance`,
              aiGeneratedProbability: 4,
              manipulationScore: 6,
              inspectedAt: c.createdAt,
              adminReviewStatus: 'Verified Genuine',
            },
            autoLocation: c.autoLocation || match?.autoLocation || {
              state: 'Tamil Nadu',
              district: c.district,
              cityOrTown: c.district,
              locality: c.talukWard || 'Urban Ward',
              street: c.address || `${c.district} Main Road`,
              pincode: c.pincode || '600001',
              resolvedAddress: `${c.address || c.district}, ${c.talukWard || ''}, ${c.district}, Tamil Nadu - ${c.pincode || '600001'}`,
              source: 'GPS-ReverseGeocoded',
            },
          };
        });
      } catch {
        return INITIAL_COMPLAINTS;
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [smsLogs, setSmsLogs] = useState<SmsNotification[]>(() => {
    const saved = localStorage.getItem('tn_pcp_sms_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SMS_LOGS;
      }
    }
    return INITIAL_SMS_LOGS;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Modals & Active Selections
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [preselectedCategory, setPreselectedCategory] = useState<string>('');
  const [selectedComplaintForDetail, setSelectedComplaintForDetail] = useState<Complaint | null>(null);

  // Dedicated Print Target
  const [printableComplaint, setPrintableComplaint] = useState<Complaint | null>(null);
  const [autoTriggerPrint, setAutoTriggerPrint] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tn_pcp_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('tn_pcp_sms_logs', JSON.stringify(smsLogs));
  }, [smsLogs]);

  // Mandatory Scroll-to-Top on View / Route Changes
  const handleNavigate = (view: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (view === 'report') {
      setIsReportModalOpen(true);
      return;
    }

    if (view === 'admin' && !isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }

    setCurrentView(view);
  };

  // Open Report Modal with Scroll-to-Top
  const handleOpenReportModal = (categoryName?: string) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (categoryName) {
      setPreselectedCategory(categoryName);
    }
    setIsReportModalOpen(true);
  };

  // Open Track View with Scroll-to-Top
  const handleOpenTrackView = () => {
    handleNavigate('track');
  };

  // View Complaint Details Modal
  const handleViewComplaint = (complaint: Complaint) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedComplaintForDetail(complaint);
  };

  // Real Print Complaint Handler
  const handlePrintComplaint = (complaint: Complaint) => {
    setPrintableComplaint(complaint);
    setAutoTriggerPrint(true);
  };

  // Add new complaint
  const handleNewComplaintSubmit = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);

    // Dispatch SMS Log
    const newSms: SmsNotification = {
      id: `SMS-${Math.floor(1000 + Math.random() * 9000)}`,
      complaintId: newComplaint.id,
      recipientPhone: newComplaint.citizenPhone,
      recipientName: newComplaint.citizenName,
      message: `Govt of TN: Your Grievance ID ${newComplaint.id} has been registered under ${newComplaint.category}. Resolution SLA: 72h. Track: tnpcp.tn.gov.in/track`,
      sentAt: newComplaint.createdAt,
      status: 'Delivered',
    };
    setSmsLogs([newSms, ...smsLogs]);
  };

  // Update existing complaint in Admin
  const handleUpdateComplaint = (updated: Complaint, newSms?: SmsNotification) => {
    setComplaints(complaints.map((c) => (c.id === updated.id ? updated : c)));
    if (newSms) {
      setSmsLogs([newSms, ...smsLogs]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#263238] flex flex-col font-sans selection:bg-[#174A78] selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'en' ? 'ta' : 'en')}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        
        {/* VIEW: HOME PAGE */}
        {currentView === 'home' && (
          <>
            {/* 1. Hero Section (Government Building Visual ONLY appears on right side of Hero!) */}
            <HeroSection
              onReportClick={() => handleOpenReportModal()}
              onTrackClick={() => {
                const trackElem = document.getElementById('track-section');
                if (trackElem) {
                  trackElem.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('track');
                }
              }}
              language={language}
            />

            {/* 2. Light-Gray Statistics Section */}
            <StatisticsSection language={language} />

            {/* 3. White Complaint Category Cards */}
            <CategoryCards
              onSelectCategory={(catName) => handleOpenReportModal(catName)}
              language={language}
            />

            {/* 4. Light-Gray Recent Complaints Section */}
            <RecentComplaintsSection
              complaints={complaints}
              onViewComplaint={handleViewComplaint}
              onPrintComplaint={handlePrintComplaint}
              language={language}
            />

            {/* 5. White Complaint Tracking Section */}
            <TrackComplaintSection
              complaints={complaints}
              onPrintComplaint={handlePrintComplaint}
              language={language}
            />

            {/* 6. Map Section with White Container */}
            <TamilNaduMapSection
              complaints={complaints}
              onViewComplaint={handleViewComplaint}
              onPrintComplaint={handlePrintComplaint}
              language={language}
            />

            {/* 7. Light-Gray About the Portal Section */}
            <AboutPortalSection language={language} />
          </>
        )}

        {/* VIEW: TRACK COMPLAINT ONLY PAGE */}
        {currentView === 'track' && (
          <div className="py-6">
            <TrackComplaintSection
              complaints={complaints}
              onPrintComplaint={handlePrintComplaint}
              language={language}
            />
          </div>
        )}

        {/* VIEW: INTERACTIVE MAP ONLY PAGE */}
        {currentView === 'map' && (
          <div className="py-6">
            <TamilNaduMapSection
              complaints={complaints}
              onViewComplaint={handleViewComplaint}
              onPrintComplaint={handlePrintComplaint}
              language={language}
            />
          </div>
        )}

        {/* VIEW: ANALYTICS DASHBOARD PAGE */}
        {currentView === 'analytics' && (
          <AnalyticsDashboard
            complaints={complaints}
            language={language}
          />
        )}

        {/* VIEW: ADMIN PORTAL PAGE */}
        {currentView === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            smsLogs={smsLogs}
            onUpdateComplaint={handleUpdateComplaint}
            onPrintComplaint={handlePrintComplaint}
            onLogout={() => {
              setIsAdminLoggedIn(false);
              handleNavigate('home');
            }}
            language={language}
          />
        )}

      </main>

      {/* Professional Government Footer */}
      <Footer onNavigate={handleNavigate} language={language} />

      {/* Multi-Step Complaint Form Modal */}
      <ComplaintFormModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitComplaint={handleNewComplaintSubmit}
        onPrintComplaint={handlePrintComplaint}
        preselectedCategory={preselectedCategory}
        existingComplaints={complaints}
        language={language}
      />

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaintForDetail}
        onClose={() => setSelectedComplaintForDetail(null)}
        onPrintComplaint={handlePrintComplaint}
      />

      {/* Official Printable Complaint Dossier (renders print layout for window.print()) */}
      {printableComplaint && (
        <PrintComplaintDossier
          complaint={printableComplaint}
          onClose={() => {
            setPrintableComplaint(null);
            setAutoTriggerPrint(false);
          }}
          triggerPrintOnMount={autoTriggerPrint}
        />
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          handleNavigate('admin');
        }}
      />

    </div>
  );
}
