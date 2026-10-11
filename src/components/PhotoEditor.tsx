import React, { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useTemplates } from '../contexts/TemplateContext';
import { PhotoEdit, Template } from '../types';
import { getDefaultPhotoEdit } from '../utils/storage';

export const PhotoEditor: React.FC = () => {
  const { session, updatePhotoEdits, setTemplateId, assignPhotoToSlot, goToStep } = useSession();
  const { getEnabledTemplates } = useTemplates();

  const [selectedPhotoId, setSelectedPhotoId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [photoEdits, setPhotoEdits] = useState<PhotoEdit>(getDefaultPhotoEdit());

  const templates = getEnabledTemplates();
  const selectedPhotos = session?.capturedPhotos.filter((p) =>
    session.selectedPhotoIds.includes(p.id)
  ) || [];

  useEffect(() => {
    if (selectedPhotos.length > 0 && !selectedPhotoId) {
      setSelectedPhotoId(selectedPhotos[0].id);
    }
  }, [selectedPhotos, selectedPhotoId]);

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      const defaultTemplate = templates.find((t) => t.isDefault) || templates[0];
      setSelectedTemplate(defaultTemplate);
      setTemplateId(defaultTemplate.id);
      
      // Auto-assign photos to slots
      const slots = defaultTemplate.photoSlots;
      
      // Check if this is a dual strip layout (slots with Left/Right naming)
      const hasLeftRightSlots = slots.some(s => s.name.includes('(Left)') || s.name.includes('(Right)'));
      
      if (hasLeftRightSlots) {
        // Dual strip: assign same photos to left and right
        const leftSlots = slots.filter(s => s.name.includes('(Left)')).sort((a, b) => a.y - b.y);
        const rightSlots = slots.filter(s => s.name.includes('(Right)')).sort((a, b) => a.y - b.y);
        
        leftSlots.forEach((slot, index) => {
          if (selectedPhotos[index]) {
            assignPhotoToSlot(slot.id, selectedPhotos[index].id);
          }
        });
        
        rightSlots.forEach((slot, index) => {
          if (selectedPhotos[index]) {
            assignPhotoToSlot(slot.id, selectedPhotos[index].id);
          }
        });
      } else {
        // Regular layout: assign to first 4 slots
        slots.slice(0, 4).forEach((slot, index) => {
          if (selectedPhotos[index]) {
            assignPhotoToSlot(slot.id, selectedPhotos[index].id);
          }
        });
      }
    }
  }, [templates, selectedTemplate, selectedPhotos, setTemplateId, assignPhotoToSlot]);

  useEffect(() => {
    const currentPhoto = selectedPhotos.find((p) => p.id === selectedPhotoId);
    if (currentPhoto?.edits) {
      setPhotoEdits(currentPhoto.edits);
    } else {
      setPhotoEdits(getDefaultPhotoEdit());
    }
  }, [selectedPhotoId, selectedPhotos]);

  const handleEditChange = (key: keyof PhotoEdit, value: any) => {
    const newEdits = { ...photoEdits, [key]: value };
    setPhotoEdits(newEdits);
    updatePhotoEdits(selectedPhotoId, newEdits);
  };

  const resetEdits = () => {
    const defaultEdits = getDefaultPhotoEdit();
    setPhotoEdits(defaultEdits);
    updatePhotoEdits(selectedPhotoId, defaultEdits);
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateId(template.id);
    
    // Check if this is a dual strip layout
    const hasLeftRightSlots = template.photoSlots.some(s => 
      s.name.includes('(Left)') || s.name.includes('(Right)')
    );
    
    if (hasLeftRightSlots) {
      // Dual strip: assign same photos to left and right
      const leftSlots = template.photoSlots
        .filter(s => s.name.includes('(Left)'))
        .sort((a, b) => a.y - b.y);
      const rightSlots = template.photoSlots
        .filter(s => s.name.includes('(Right)'))
        .sort((a, b) => a.y - b.y);
      
      leftSlots.forEach((slot, index) => {
        if (selectedPhotos[index]) {
          assignPhotoToSlot(slot.id, selectedPhotos[index].id);
        }
      });
      
      rightSlots.forEach((slot, index) => {
        if (selectedPhotos[index]) {
          assignPhotoToSlot(slot.id, selectedPhotos[index].id);
        }
      });
    } else {
      // Regular layout: assign to first 4 slots
      template.photoSlots.slice(0, 4).forEach((slot, index) => {
        if (selectedPhotos[index]) {
          assignPhotoToSlot(slot.id, selectedPhotos[index].id);
        }
      });
    }
  };

  const handleContinue = () => {
    goToStep('preview');
  };

  const selectedPhoto = selectedPhotos.find((p) => p.id === selectedPhotoId);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-6 border-b">
        <h1 className="text-3xl font-bold text-gray-800">Customize Your Photos</h1>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-88px)]">
        {/* Left Panel - Photo Preview */}
        <div className="lg:w-2/3 bg-gray-200 p-8 flex items-center justify-center">
          {selectedPhoto && (
            <div className="max-w-2xl w-full">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <img
                  src={selectedPhoto.dataUrl}
                  alt="Selected"
                  className="w-full h-auto"
                  style={{
                    filter: `
                      brightness(${100 + photoEdits.brightness}%)
                      contrast(${100 + photoEdits.contrast}%)
                      saturate(${100 + photoEdits.saturation}%)
                      ${photoEdits.filter === 'bw' ? 'grayscale(100%)' : ''}
                      ${photoEdits.filter === 'sepia' ? 'sepia(100%)' : ''}
                    `,
                    transform: `
                      rotate(${photoEdits.rotation}deg)
                      scaleX(${photoEdits.flipH ? -1 : 1})
                      scaleY(${photoEdits.flipV ? -1 : 1})
                      scale(${photoEdits.zoom})
                    `,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Controls */}
        <div className="lg:w-1/3 bg-white p-6 overflow-y-auto">
          {/* Photo Selector */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Select Photo</h2>
            <div className="grid grid-cols-4 gap-2">
              {selectedPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedPhotoId(photo.id)}
                  className={`
                    aspect-square rounded-lg overflow-hidden border-4 transition-all
                    ${photo.id === selectedPhotoId
                      ? 'border-purple-500 ring-4 ring-purple-200'
                      : 'border-gray-300 hover:border-purple-300'
                    }
                  `}
                >
                  <img
                    src={photo.dataUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Adjustments</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Brightness</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={photoEdits.brightness}
                  onChange={(e) => handleEditChange('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contrast</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={photoEdits.contrast}
                  onChange={(e) => handleEditChange('contrast', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Saturation</label>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={photoEdits.saturation}
                  onChange={(e) => handleEditChange('saturation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Warmth</label>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={photoEdits.warmth}
                  onChange={(e) => handleEditChange('warmth', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Zoom</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={photoEdits.zoom}
                  onChange={(e) => handleEditChange('zoom', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Filters</h2>
            <div className="grid grid-cols-2 gap-2">
              {(['none', 'bw', 'sepia', 'vintage'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleEditChange('filter', filter)}
                  className={`
                    px-4 py-2 rounded-lg font-medium capitalize transition-colors
                    ${photoEdits.filter === filter
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {filter === 'bw' ? 'B&W' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Transform */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Transform</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleEditChange('rotation', photoEdits.rotation - 90)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                ↶ Rotate Left
              </button>
              <button
                onClick={() => handleEditChange('rotation', photoEdits.rotation + 90)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                ↷ Rotate Right
              </button>
              <button
                onClick={() => handleEditChange('flipH', !photoEdits.flipH)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                ⇄ Flip H
              </button>
              <button
                onClick={() => handleEditChange('flipV', !photoEdits.flipV)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium"
              >
                ⇅ Flip V
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Layout</h2>
            <div className="space-y-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateChange(template)}
                  className={`
                    w-full p-3 rounded-lg text-left font-medium transition-colors
                    ${selectedTemplate?.id === template.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={resetEdits}
              className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Reset Edits
            </button>
            <button
              onClick={handleContinue}
              className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg"
            >
              Preview Final →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
