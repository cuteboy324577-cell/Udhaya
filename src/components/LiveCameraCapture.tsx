import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle, ShieldAlert, Image as ImageIcon } from 'lucide-react';

interface LiveCameraCaptureProps {
  onPhotoCaptured: (dataUrl: string) => void;
  onClose: () => void;
  currentCount: number;
  maxCount: number;
}

export const LiveCameraCapture: React.FC<LiveCameraCaptureProps> = ({
  onPhotoCaptured,
  onClose,
  currentCount,
  maxCount,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasConsent, setHasConsent] = useState<boolean>(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stop stream helper
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  // Start Camera
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access API is not supported in this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: unknown) {
      console.warn('Camera permission or device error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Camera permission was denied or device is unavailable.';
      setCameraError(
        `${errorMessage} You can take a photo using your standard file browser or select an existing evidence image below.`
      );
      setIsCameraActive(false);
    }
  };

  // Flip Camera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap Photo
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Optional stamp: Official Timestamp & Grievance Watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, canvas.height - 35, canvas.width - 20, 25);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px monospace';
    const timestamp = `Govt of TN PCP Evidence · ${new Date().toLocaleString('en-IN')}`;
    ctx.fillText(timestamp, 20, canvas.height - 18);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(dataUrl);
    stopStream();
  };

  // Retake
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  // Accept and use photo
  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoCaptured(capturedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#174A78] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-200" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                Live Evidence Capture
              </span>
              <h3 className="text-sm font-bold">On-Site Citizen Camera</h3>
            </div>
          </div>
          <button
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Viewport */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* Explicit Consent Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-slate-700 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#174A78] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-900">Privacy & Consent Notice:</span>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Camera access is requested strictly to capture live physical evidence of public civic hazards (potholes, water leaks, wiring faults). Photos are stamped with official timestamps and attached to your complaint.
              </p>
            </div>
          </div>

          {/* Error / Fallback display */}
          {cameraError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertCircle className="w-4 h-4" />
                <span>Camera Unavailable / Permission Denied</span>
              </div>
              <p className="text-rose-700 text-[11px] leading-relaxed">
                {cameraError}
              </p>
              <div className="pt-2 border-t border-rose-200">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#174A78] text-white text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#12395d]">
                  <ImageIcon className="w-4 h-4" />
                  <span>Choose Photo from Device Instead</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            onPhotoCaptured(evt.target.result as string);
                            onClose();
                          }
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* Viewport Area */}
          <div className="relative aspect-4/3 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300">
            {/* Captured Still Preview */}
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured live evidence"
                className="w-full h-full object-cover"
              />
            ) : isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6 text-slate-400 space-y-3">
                <Camera className="w-12 h-12 mx-auto text-slate-600" />
                <p className="text-xs">
                  Camera is currently off. Click below to request permission and start the live stream.
                </p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-5 py-2.5 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Start Live Camera
                </button>
              </div>
            )}

            {/* In-viewport Switch camera button */}
            {isCameraActive && (
              <button
                type="button"
                onClick={toggleFacingMode}
                className="absolute top-3 right-3 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors cursor-pointer"
                title="Switch front/back camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Counter info */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Evidence Slots: <strong>{currentCount} of {maxCount}</strong> used</span>
            <span>Resolution: 720p HD</span>
          </div>

        </div>

        {/* Action Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {capturedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
                <button
                  type="button"
                  onClick={handleUsePhoto}
                  className="flex items-center gap-1.5 px-5 py-2 bg-[#174A78] hover:bg-[#12395d] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use Photo</span>
                </button>
              </>
            ) : isCameraActive ? (
              <button
                type="button"
                onClick={handleCapture}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Photo</span>
              </button>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};
