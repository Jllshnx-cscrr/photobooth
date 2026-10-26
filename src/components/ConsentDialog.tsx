import React from 'react';

interface ConsentDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentDialog: React.FC<ConsentDialogProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  if (!isOpen) return null;

  const expiryDays = import.meta.env.VITE_SESSION_EXPIRY_DAYS || '30';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 rounded-full p-4">
            <svg
              className="w-12 h-12 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Record Your Photobooth Session?
        </h2>

        {/* Content */}
        <div className="space-y-4 text-gray-600 mb-8">
          <p className="text-center">
            We'd love to create a fun timelapse video of your photobooth experience!
          </p>

          <div className="bg-purple-50 rounded-lg p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              What we'll record:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-7">
              <li>Your camera feed while taking photos</li>
              <li>Reactions and poses between shots</li>
              <li>A sped-up timelapse video (10-20 seconds)</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Privacy:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-7">
              <li>Only you will have access via a unique QR code</li>
              <li>Videos are automatically deleted after {expiryDays} days</li>
              <li>We won't share your recording with anyone</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onDecline}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            No Thanks
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors shadow-lg"
          >
            Yes, Record! 🎬
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your photos will be captured regardless of your choice
        </p>
      </div>
    </div>
  );
};

export default ConsentDialog;
