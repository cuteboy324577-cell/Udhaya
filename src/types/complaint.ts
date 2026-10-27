export type ComplaintStatus =
  | 'Under Review'
  | 'Verified & Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export type ComplaintPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type PhotoVerificationStatus =
  | 'Likely relevant'
  | 'Possible duplicate'
  | 'Possible manipulation or AI-generated image'
  | 'Irrelevant or unclear image'
  | 'Manual review required';

export interface PhotoVerificationResult {
  status: PhotoVerificationStatus;
  confidence: number; // e.g. 94.2
  isFlaggedForReview: boolean;
  flagReason?: string;
  duplicateMatchedId?: string;
  aiGeneratedProbability?: number; // 0 to 100
  manipulationScore?: number; // 0 to 100
  relevanceToCategory?: string;
  inspectedAt: string;
  adminReviewStatus?: 'Pending Admin Review' | 'Verified Genuine' | 'Flagged Suspicious';
}

export interface AutoLocationDetails {
  state: string; // e.g. "Tamil Nadu"
  district: string;
  cityOrTown: string;
  locality: string;
  street: string;
  pincode: string;
  resolvedAddress: string;
  source: 'GPS-ReverseGeocoded' | 'MapPin-Geocoded' | 'ManualEntry';
  accuracyMeters?: number;
  geocodedAt?: string;
}

export interface TimelineEntry {
  status: ComplaintStatus | string;
  timestamp: string;
  description: string;
  updatedBy: string;
  remarks?: string;
}

export interface Complaint {
  id: string; // e.g. TN-CMP-2026-78421
  title: string;
  category: string;
  subcategory: string;
  description: string;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  district: string;
  talukWard: string;
  address: string;
  landmark: string;
  pincode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  status: ComplaintStatus;
  priority: ComplaintPriority;
  department: string;
  assignedOfficer: {
    name: string;
    designation: string;
    phone: string;
    department: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionHours?: number;
  satisfactionRating?: number;
  slaDeadline: string;
  aiAnalysis: {
    detectedCategory: string;
    confidence: number; // e.g. 96.8
    urgencyScore: string;
    extractedKeywords: string[];
    departmentRecommendation: string;
    priorityRecommendation: ComplaintPriority;
  };
  duplicateCheck: {
    hasDuplicate: boolean;
    similarityScore: number; // percentage
    matchedComplaintId?: string;
    matchReason?: string;
  };
  photoVerification?: PhotoVerificationResult;
  autoLocation?: AutoLocationDetails;
  timeline: TimelineEntry[];
}

export interface SmsNotification {
  id: string;
  complaintId: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  sentAt: string;
  status: 'Delivered' | 'Sent';
}
