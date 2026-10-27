import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { TN_DISTRICTS } from '../data/initialComplaints';
import {
  MapPin,
  Navigation,
  Layers,
  Filter,
  Search,
  RotateCcw,
  Eye,
  Printer,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface LiveInteractiveMapProps {
  complaints: Complaint[];
  onViewComplaint: (complaint: Complaint) => void;
  onPrintComplaint: (complaint: Complaint) => void;
  // Optional mode for picking location in complaint form
  isPickerMode?: boolean;
  selectedLocation?: { lat: number; lng: number };
  onLocationSelect?: (coords: { lat: number; lng: number }) => void;
  language: 'en' | 'ta';
}

export const LiveInteractiveMap: React.FC<LiveInteractiveMapProps> = ({
  complaints,
  onViewComplaint,
  onPrintComplaint,
  isPickerMode = false,
  selectedLocation,
  onLocationSelect,
  language,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // GPS State
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'granted' | 'denied'>('idle');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  // Inspector card for active marker
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(complaints[0] || null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on central Tamil Nadu (Trichy/Salem latitude)
      const map = L.map(mapContainerRef.current, {
        center: selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [11.1271, 78.6569],
        zoom: isPickerMode ? 12 : 7,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors · Govt of Tamil Nadu PCP GIS',
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Picker mode click handler
      if (isPickerMode && onLocationSelect) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({
            lat: Number(lat.toFixed(4)),
            lng: Number(lng.toFixed(4)),
          });
        });
      }
    }

    return () => {
      // Leaflet cleanup
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Picker marker if in picker mode
  useEffect(() => {
    if (!isPickerMode || !mapInstanceRef.current || !selectedLocation) return;
    const map = mapInstanceRef.current;

    if (pickerMarkerRef.current) {
      pickerMarkerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
    } else {
      const pinIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `<div style="background-color:#174A78; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.3); font-size:14px; font-weight:bold;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        if (onLocationSelect) {
          onLocationSelect({
            lat: Number(pos.lat.toFixed(4)),
            lng: Number(pos.lng.toFixed(4)),
          });
        }
      });

      pickerMarkerRef.current = marker;
    }
  }, [isPickerMode, selectedLocation]);

  // Render complaint markers
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    const layer = markersLayerRef.current;
    layer.clearLayers();

    // Filter complaints
    const filtered = complaints.filter((c) => {
      if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
      if (selectedDistrict !== 'All' && c.district !== selectedDistrict) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
        );
      }
      return true;
    });

    filtered.forEach((complaint) => {
      const { lat, lng } = complaint.coordinates;
      if (!lat || !lng) return;

      // Status-based marker color
      let markerColor = '#174A78'; // In Progress
      if (complaint.status === 'Resolved') markerColor = '#059669'; // Green
      else if (complaint.status === 'Verified & Assigned') markerColor = '#D97706'; // Amber
      else if (complaint.status === 'Under Review') markerColor = '#64748B'; // Slate

      const iconHtml = `
        <div style="background-color: ${markerColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); color: white; font-size: 11px; font-weight: bold;">
          ${complaint.status === 'Resolved' ? '✓' : '•'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-complaint-marker',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Privacy-safe popup content: NO citizen phone or email is exposed publicly
      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; min-width: 200px; color: #263238;">
          <div style="font-family: monospace; font-weight: bold; color: #174A78; margin-bottom: 2px;">${complaint.id}</div>
          <div style="font-weight: bold; margin-bottom: 4px; line-height: 1.3;">${complaint.title}</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 4px;">📍 ${complaint.district} · ${complaint.talukWard}</div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px solid #E2E8F0; padding-top: 4px; margin-top: 4px;">
            <span>Status: <strong>${complaint.status}</strong></span>
            <span>Priority: <strong>${complaint.priority}</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActiveComplaint(complaint);
      });

      layer.addLayer(marker);
    });
  }, [complaints, selectedCategory, selectedStatus, selectedDistrict, searchQuery]);

  // Request GPS Location
  const handleUseMyLocation = () => {
    setGpsStatus('locating');

    if (!navigator.geolocation) {
      setGpsStatus('denied');
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
        };
        setUserLocation(coords);
        setGpsStatus('granted');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 13);

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          } else {
            const userPin = L.circleMarker([coords.lat, coords.lng], {
              radius: 9,
              fillColor: '#2563EB',
              color: '#ffffff',
              weight: 3,
              opacity: 1,
              fillOpacity: 0.9,
            }).addTo(mapInstanceRef.current);
            userPin.bindPopup('<b>Your Current Location (Live GPS)</b>');
            userMarkerRef.current = userPin;
          }
        }

        if (isPickerMode && onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (err) => {
        console.warn('GPS error:', err);
        setGpsStatus('denied');
        alert('Could not access live GPS location. Please check location permissions in your browser or select manually on the map.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Reset to Tamil Nadu view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([11.1271, 78.6569], 7);
    }
  };

  const categories = [
    'All',
    'Water Supply & Drainage',
    'Electricity & Power',
    'Roads & Transport',
    'Waste Management & Sanitation',
    'Street Lights & Public Safety',
  ];

  return (
    <div className="space-y-4">
      {/* Map Control Ribbon */}
      {!isPickerMode && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search by district or keyword */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district (e.g. Madurai, Chennai) or complaint ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:border-[#174A78]"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Verified & Assigned">Verified & Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Under Review">Under Review</option>
            </select>

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700"
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
      )}

      {/* Main Map Box & Inspector Grid */}
      <div className={`grid ${isPickerMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'} gap-6 items-start`}>
        
        {/* Leaflet Map Canvas */}
        <div className={`${isPickerMode ? 'w-full' : 'lg:col-span-8'} bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative`}>
          
          {/* Floating GPS & Center Controls Bar */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
            <button
              type="button"
              onClick={handleUseMyLocation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                gpsStatus === 'granted'
                  ? 'bg-emerald-600 text-white'
                  : gpsStatus === 'locating'
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-[#174A78] hover:bg-[#12395d] text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>
                {gpsStatus === 'granted'
                  ? 'GPS Active'
                  : gpsStatus === 'locating'
                  ? 'Locating...'
                  : 'Use My Location'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResetView}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors cursor-pointer"
              title="Reset view to Tamil Nadu state center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Target DIV */}
          <div
            ref={mapContainerRef}
            className={`w-full ${isPickerMode ? 'h-64 sm:h-80' : 'h-[500px] sm:h-[560px]'} z-0`}
          />

          {/* Map Footer Bar with Privacy Statement & Legend */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800">Status Legend:</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                <span>Resolved</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#174A78]"></span>
                <span>In Progress</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                <span>Verified</span>
              </span>
            </div>

            <div className="text-slate-500 font-medium">
              🔒 Privacy Protected: Citizen personal phone/email are kept strictly confidential.
            </div>
          </div>
        </div>

        {/* Selected Complaint Inspector Card (Only in full map view) */}
        {!isPickerMode && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#174A78]">
                Grievance Inspector
              </span>
              {activeComplaint && (
                <span className="font-mono text-xs font-bold text-[#174A78] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {activeComplaint.id}
                </span>
              )}
            </div>

            {activeComplaint ? (
              <div className="space-y-3.5 text-xs text-slate-700">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {activeComplaint.title}
                  </h3>
                  <div className="flex items-center gap-1 text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#174A78]" />
                    <span>{activeComplaint.district} · {activeComplaint.talukWard}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 leading-relaxed line-clamp-3">
                  {activeComplaint.description}
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold text-slate-800">{activeComplaint.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Status:</span>
                    <span className="font-bold text-[#174A78]">{activeComplaint.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Priority:</span>
                    <span className="font-bold text-slate-800">{activeComplaint.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-medium text-slate-800 text-right">{activeComplaint.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="font-mono text-slate-700">
                      {activeComplaint.coordinates.lat.toFixed(4)}°N, {activeComplaint.coordinates.lng.toFixed(4)}°E
                    </span>
                  </div>
                </div>

                {/* Evidence Thumbnail */}
                {activeComplaint.images && activeComplaint.images.length > 0 && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 h-28 bg-slate-100">
                    <img
                      src={activeComplaint.images[0]}
                      alt="Grievance evidence"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={() => onViewComplaint(activeComplaint)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-lg border border-slate-300 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    onClick={() => onPrintComplaint(activeComplaint)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#174A78] hover:bg-[#12395d] text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Click any marker on the map to inspect complaint details.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
