import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSession } from '../contexts/SessionContext';

const PHOTOS_TO_CAPTURE = 8;

export const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  const { session, addCapturedPhoto, goToStep, countdownSeconds } = useSession();

  const [countdown, setCountdown] = useState<number>(countdownSeconds);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [error, setError] = useState<string>('');
  const [cameraReady, setCameraReady] = useState(false);

  const capturedCount = session?.capturedPhotos.length || 0;

  // Initialize camera
  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
          setError('');
        };
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(
        'Could not access camera. Please grant camera permission and try again.'
      );
    }
  }, []);

  // Capture photo from video stream
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const dataUrl = canvas.toDataURL('image/png');

    // Show flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);

    // Add photo to session
    addCapturedPhoto(dataUrl);

    // Check if we've captured all photos
    if (capturedCount + 1 >= PHOTOS_TO_CAPTURE) {
      setIsCapturing(false);
      // Move to selection after a brief delay
      setTimeout(() => {
        goToStep('selection');
      }, 1000);
    } else {
      // Reset countdown for next photo
      setCountdown(countdownSeconds);
    }
  }, [cameraReady, capturedCount, addCapturedPhoto, goToStep, countdownSeconds]);

  // Countdown timer
  useEffect(() => {
    if (!isCapturing || !cameraReady || capturedCount >= PHOTOS_TO_CAPTURE) {
      return;
    }

    if (countdown === 0) {
      capturePhoto();
      return;
    }

    timerRef.current = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown, isCapturing, cameraReady, capturedCount, capturePhoto]);

  // Start capture sequence when camera is ready
  useEffect(() => {
    if (cameraReady && !isCapturing && capturedCount < PHOTOS_TO_CAPTURE) {
      setIsCapturing(true);
      setCountdown(countdownSeconds);
    }
  }, [cameraReady, isCapturing, capturedCount, countdownSeconds]);

  // Initialize camera on mount
  useEffect(() => {
    initCamera();

    return () => {
      // Cleanup camera stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [initCamera]);

  const handleRetry = () => {
    setError('');
    initCamera();
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart? All photos will be lost.')) {
      window.location.reload();
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Camera Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-50 animate-flash pointer-events-none" />
      )}

      {/* Fullscreen Video Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top Header Bar - Floating */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-lg font-bold drop-shadow-lg">Photo Capture</h1>
            <p className="text-white/80 text-xs drop-shadow">
              Timer: {countdownSeconds}s | Photo {capturedCount + 1} of {PHOTOS_TO_CAPTURE}
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="bg-red-600/90 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Countdown Overlay - Center */}
      {isCapturing && countdown > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
          <div className="text-white text-9xl font-bold drop-shadow-2xl animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      {/* Progress Bar - Just Above Thumbnails */}
      <div className="absolute bottom-32 left-0 right-0 z-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-black/50 rounded-full h-2 shadow-lg">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(capturedCount / PHOTOS_TO_CAPTURE) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating Thumbnails - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 justify-center items-center overflow-x-auto pb-2">
            {/* Captured Photos */}
            {session?.capturedPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="flex-shrink-0 w-20 h-20 bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-green-500 transform hover:scale-110 transition-transform"
              >
                <img
                  src={photo.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            
            {/* Empty Slots */}
            {Array.from({ length: PHOTOS_TO_CAPTURE - capturedCount }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex-shrink-0 w-20 h-20 bg-black/50 rounded-lg flex items-center justify-center border-2 border-white/30 shadow-lg"
              >
                <span className="text-white/50 text-xl font-bold">
                  {capturedCount + i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
