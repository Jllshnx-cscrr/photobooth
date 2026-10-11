import React, { useState } from 'react';
import { useSession } from '../contexts/SessionContext';

const PHOTOS_TO_SELECT = 4;

export const PhotoSelection: React.FC = () => {
  const { session, setSelectedPhotos, goToStep } = useSession();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!session) return null;

  const toggleSelection = (photoId: string) => {
    if (selectedIds.includes(photoId)) {
      setSelectedIds(selectedIds.filter((id) => id !== photoId));
    } else {
      if (selectedIds.length < PHOTOS_TO_SELECT) {
        setSelectedIds([...selectedIds, photoId]);
      }
    }
  };

  const handleContinue = () => {
    setSelectedPhotos(selectedIds);
    goToStep('editor');
  };

  const canContinue = selectedIds.length === PHOTOS_TO_SELECT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Choose Your Favorites
          </h1>
          <p className="text-2xl text-white opacity-90 drop-shadow">
            Select exactly {PHOTOS_TO_SELECT} photos for your layout
          </p>
          <div className="mt-4 inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-8 py-3">
            <span className="text-3xl font-bold text-white">
              {selectedIds.length} OF {PHOTOS_TO_SELECT} SELECTED
            </span>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {session.capturedPhotos.map((photo, index) => {
            const isSelected = selectedIds.includes(photo.id);
            const selectionOrder = selectedIds.indexOf(photo.id) + 1;

            return (
              <div
                key={photo.id}
                onClick={() => toggleSelection(photo.id)}
                className={`
                  relative aspect-square rounded-xl overflow-hidden cursor-pointer
                  transform transition-all duration-200 hover:scale-105
                  ${isSelected 
                    ? 'ring-8 ring-yellow-400 shadow-2xl scale-105' 
                    : 'ring-4 ring-white ring-opacity-50 hover:ring-opacity-100'
                  }
                `}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-yellow-400 rounded-full w-20 h-20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {selectionOrder}
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Photo Number */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-60 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => goToStep('capture')}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-opacity-30 transition-all"
          >
            ← Back to Camera
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              px-12 py-4 rounded-full text-xl font-bold transition-all
              ${canContinue
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 shadow-2xl'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            CUSTOMIZE MY PHOTOS →
          </button>
        </div>

        {/* Instruction */}
        {!canContinue && (
          <p className="text-center text-white text-lg mt-4 opacity-75">
            {selectedIds.length < PHOTOS_TO_SELECT
              ? `Select ${PHOTOS_TO_SELECT - selectedIds.length} more photo${PHOTOS_TO_SELECT - selectedIds.length !== 1 ? 's' : ''}`
              : 'Click Continue to proceed'}
          </p>
        )}
      </div>
    </div>
  );
};
