import React, { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useTemplates } from '../contexts/TemplateContext';

export const PhotoSelection: React.FC = () => {
  const { session, setSelectedPhotos, assignPhotoToSlot, setTemplateId, goToStep } = useSession();
  const { templates } = useTemplates();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!session) return null;

  // Get active template to determine how many photos to select
  const activeTemplate = templates.find(t => t.isDefault);
  
  // Determine photos to select:
  // 1. If uniquePhotosNeeded is set (dual strip), use that
  // 2. Otherwise count only PRIMARY slots (exclude mirror slots that have sourceSlotId)
  const primarySlotCount = activeTemplate 
    ? activeTemplate.photoSlots.filter(slot => !slot.sourceSlotId).length 
    : 4;
  
  const PHOTOS_TO_SELECT = activeTemplate?.uniquePhotosNeeded || primarySlotCount;

  // Auto-select all photos if captured count matches slot count (exact mode)
  useEffect(() => {
    if (activeTemplate?.captureMode === 'exact' && session.capturedPhotos.length === PHOTOS_TO_SELECT) {
      // Automatically select all photos
      const allPhotoIds = session.capturedPhotos.map(p => p.id);
      setSelectedPhotos(allPhotoIds);
      
      // Set template ID
      setTemplateId(activeTemplate.id);
      
      // Auto-assign photos to PRIMARY slots
      const primarySlots = activeTemplate.photoSlots
        .filter(s => !s.sourceSlotId)
        .sort((a, b) => a.y - b.y);
      
      primarySlots.forEach((slot, index) => {
        if (session.capturedPhotos[index]) {
          assignPhotoToSlot(slot.id, session.capturedPhotos[index].id);
        }
      });
      
      // Auto-assign photos to MIRROR slots (same photos as their source slots)
      const mirrorSlots = activeTemplate.photoSlots.filter(s => s.sourceSlotId);
      mirrorSlots.forEach((mirrorSlot) => {
        if (mirrorSlot.sourceSlotId) {
          const sourcePrimaryIndex = primarySlots.findIndex(s => s.id === mirrorSlot.sourceSlotId);
          if (sourcePrimaryIndex !== -1 && session.capturedPhotos[sourcePrimaryIndex]) {
            assignPhotoToSlot(mirrorSlot.id, session.capturedPhotos[sourcePrimaryIndex].id);
          }
        }
      });
      
      // Skip editor and go directly to preview
      goToStep('preview');
    }
  }, [activeTemplate, session.capturedPhotos, PHOTOS_TO_SELECT, setSelectedPhotos, setTemplateId, assignPhotoToSlot, goToStep]);

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
    
    // Set template ID and auto-assign photos
    if (activeTemplate) {
      setTemplateId(activeTemplate.id);
      
      // Get PRIMARY slots only (exclude mirrors)
      const primarySlots = activeTemplate.photoSlots
        .filter(s => !s.sourceSlotId)
        .sort((a, b) => a.y - b.y);
      
      // Auto-assign selected photos to primary slots
      const selectedPhotos = session.capturedPhotos.filter(p => selectedIds.includes(p.id));
      primarySlots.forEach((slot, index) => {
        if (selectedPhotos[index]) {
          assignPhotoToSlot(slot.id, selectedPhotos[index].id);
        }
      });
      
      // Auto-assign photos to MIRROR slots (same photos as their source slots)
      const mirrorSlots = activeTemplate.photoSlots.filter(s => s.sourceSlotId);
      mirrorSlots.forEach((mirrorSlot) => {
        if (mirrorSlot.sourceSlotId) {
          const sourcePrimaryIndex = primarySlots.findIndex(s => s.id === mirrorSlot.sourceSlotId);
          if (sourcePrimaryIndex !== -1 && selectedPhotos[sourcePrimaryIndex]) {
            assignPhotoToSlot(mirrorSlot.id, selectedPhotos[sourcePrimaryIndex].id);
          }
        }
      });
    }
    
    // Skip editor and go directly to preview
    goToStep('preview');
  };

  const canContinue = selectedIds.length === PHOTOS_TO_SELECT;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Header - Compact */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            Choose Your Favorites
          </h1>
          <p className="text-sm text-white opacity-90 drop-shadow mb-2">
            Select exactly {PHOTOS_TO_SELECT} photos for your layout
          </p>
          <div className="inline-block bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="text-lg font-bold text-white">
              {selectedIds.length} OF {PHOTOS_TO_SELECT} SELECTED
            </span>
          </div>
        </div>

        {/* Photo Grid - Smaller and Compact */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {session.capturedPhotos.map((photo, index) => {
            const isSelected = selectedIds.includes(photo.id);
            const selectionOrder = selectedIds.indexOf(photo.id) + 1;

            return (
              <div
                key={photo.id}
                onClick={() => toggleSelection(photo.id)}
                className={`
                  relative aspect-square rounded-lg overflow-hidden cursor-pointer
                  transform transition-all duration-200 hover:scale-105
                  ${isSelected 
                    ? 'ring-4 ring-yellow-400 shadow-xl scale-105' 
                    : 'ring-2 ring-white ring-opacity-50 hover:ring-opacity-100'
                  }
                `}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Selection Indicator - Smaller */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {selectionOrder}
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkmark - Smaller */}
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                    <svg
                      className="w-4 h-4 text-white"
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

                {/* Photo Number - Smaller */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-60 rounded-full w-6 h-6 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons - Compact */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => goToStep('capture')}
            className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-30 transition-all"
          >
            ← Back to Camera
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={`
              px-8 py-2.5 rounded-full text-sm font-bold transition-all
              ${canContinue
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:scale-105 shadow-xl'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
          >
            PREVIEW FINAL IMAGE →
          </button>
        </div>

        {/* Instruction - Compact */}
        {!canContinue && (
          <p className="text-center text-white text-sm mt-3 opacity-75">
            {selectedIds.length < PHOTOS_TO_SELECT
              ? `Select ${PHOTOS_TO_SELECT - selectedIds.length} more photo${PHOTOS_TO_SELECT - selectedIds.length !== 1 ? 's' : ''}`
              : 'Click Continue to proceed'}
          </p>
        )}
      </div>
    </div>
  );
};
