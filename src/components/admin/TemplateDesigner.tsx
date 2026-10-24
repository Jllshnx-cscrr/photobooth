import React, { useRef, useState } from 'react';
import { Template, PhotoSlot } from '../../types';

interface TemplateDesignerProps {
  template: Template | null;
  onSave: (template: Template) => void;
  onCancel: () => void;
}

export const TemplateDesigner: React.FC<TemplateDesignerProps> = ({
  template,
  onSave,
  onCancel
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template>(
    template || {
      id: `template-${Date.now()}`,
      name: 'New Template',
      width: 1200,
      height: 1800,
      backgroundAsset: '',
      photoSlots: [],
      enabled: true,
      isDefault: false,
      allowUserCustomization: true,
      captureMode: 'extra',  // Default to always capture 8 photos
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [useInches, setUseInches] = useState(false);
  const [dpi, setDpi] = useState(300); // Default 300 DPI for print quality

  const selectedSlot = currentTemplate.photoSlots.find((s) => s.id === selectedSlotId);

  // Conversion helpers
  const pxToInches = (px: number) => (px / dpi).toFixed(2);
  const inchesToPx = (inches: number) => Math.round(inches * dpi);

  const formatDimension = (px: number) => {
    if (useInches) {
      return `${pxToInches(px)}"`;
    }
    return `${Math.round(px)}px`;
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      alert('Please upload a PNG, JPEG, or WebP image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentTemplate({
        ...currentTemplate,
        backgroundAsset: file.name,
        backgroundDataUrl: dataUrl,
        updatedAt: Date.now()
      });
    };
    reader.readAsDataURL(file);
  };

  const handleForegroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
      alert('Please upload a PNG, JPEG, or WebP image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCurrentTemplate({
        ...currentTemplate,
        foregroundAsset: file.name,
        foregroundDataUrl: dataUrl,
        updatedAt: Date.now()
      });
    };
    reader.readAsDataURL(file);
  };

  const addPhotoSlot = () => {
    const newSlot: PhotoSlot = {
      id: `slot-${Date.now()}`,
      x: 100,
      y: 100,
      width: 300,
      height: 300,
      rotation: 0,
      fit: 'cover',
      cornerRadius: 0,
      zIndex: currentTemplate.photoSlots.length,
      name: `Photo ${currentTemplate.photoSlots.length + 1}`
    };

    setCurrentTemplate({
      ...currentTemplate,
      photoSlots: [...currentTemplate.photoSlots, newSlot],
      updatedAt: Date.now()
    });
    setSelectedSlotId(newSlot.id);
  };

  const updateSlot = (slotId: string, updates: Partial<PhotoSlot>) => {
    setCurrentTemplate({
      ...currentTemplate,
      photoSlots: currentTemplate.photoSlots.map((slot) =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      ),
      updatedAt: Date.now()
    });
  };

  const deleteSlot = (slotId: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      photoSlots: currentTemplate.photoSlots.filter((s) => s.id !== slotId),
      updatedAt: Date.now()
    });
    if (selectedSlotId === slotId) {
      setSelectedSlotId('');
    }
  };

  const duplicateSlot = (slotId: string) => {
    const slot = currentTemplate.photoSlots.find((s) => s.id === slotId);
    if (!slot) return;

    const newSlot: PhotoSlot = {
      ...slot,
      id: `slot-${Date.now()}`,
      x: slot.x + 20,
      y: slot.y + 20,
      name: `${slot.name} Copy`
    };

    setCurrentTemplate({
      ...currentTemplate,
      photoSlots: [...currentTemplate.photoSlots, newSlot],
      updatedAt: Date.now()
    });
  };

  const createDualStripLayout = () => {
    if (!window.confirm('This will replace all current slots with a dual photo strip layout (4 unique photos mirrored on both sides). Continue?')) {
      return;
    }

    const width = currentTemplate.width;
    const height = currentTemplate.height;
    
    // Calculate dimensions for dual strip (2 columns, 4 rows)
    const margin = Math.round(width * 0.05); // 5% margin
    const gapBetween = Math.round(width * 0.08); // 8% gap between columns
    const slotWidth = Math.round((width - (2 * margin) - gapBetween) / 2);
    const slotHeight = Math.round((height - (2 * margin) - (3 * margin * 0.5)) / 4); // 4 rows with gaps

    const newSlots: PhotoSlot[] = [];
    
    // Create 4 PRIMARY slots on the left (these capture the actual photos)
    for (let i = 0; i < 4; i++) {
      const slotId = `slot-primary-${i + 1}`;
      newSlots.push({
        id: slotId,
        x: margin,
        y: margin + i * (slotHeight + margin * 0.5),
        width: slotWidth,
        height: slotHeight,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 0,
        zIndex: i,
        name: `Photo ${i + 1}`
      });
    }
    
    // Create 4 MIRROR slots on the right (these reference the left slots)
    for (let i = 0; i < 4; i++) {
      newSlots.push({
        id: `slot-mirror-${i + 1}`,
        x: margin + slotWidth + gapBetween,
        y: margin + i * (slotHeight + margin * 0.5),
        width: slotWidth,
        height: slotHeight,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 0,
        zIndex: i + 4,
        name: `Photo ${i + 1} (Mirror)`,
        sourceSlotId: `slot-primary-${i + 1}`  // Link to the primary slot
      });
    }

    setCurrentTemplate({
      ...currentTemplate,
      photoSlots: newSlots,
      captureMode: 'exact',  // Automatically set to exact mode
      uniquePhotosNeeded: 4,  // Only 4 unique photos needed (mirrored to create 8 slots)
      updatedAt: Date.now()
    });
  };

  const handleMouseDown = (e: React.MouseEvent, slotId: string, action: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSlotId(slotId);

    if (action === 'move') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!selectedSlot || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const scale = rect.width / currentTemplate.width;

    if (isDragging) {
      const deltaX = (currentX - dragStart.x) / scale;
      const deltaY = (currentY - dragStart.y) / scale;

      updateSlot(selectedSlotId, {
        x: Math.max(0, Math.min(currentTemplate.width - selectedSlot.width, selectedSlot.x + deltaX)),
        y: Math.max(0, Math.min(currentTemplate.height - selectedSlot.height, selectedSlot.y + deltaY))
      });

      setDragStart({ x: currentX, y: currentY });
    } else if (isResizing) {
      const newWidth = Math.max(50, (currentX / scale) - selectedSlot.x);
      const newHeight = Math.max(50, (currentY / scale) - selectedSlot.y);

      updateSlot(selectedSlotId, {
        width: Math.min(newWidth, currentTemplate.width - selectedSlot.x),
        height: Math.min(newHeight, currentTemplate.height - selectedSlot.y)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleSave = () => {
    if (!currentTemplate.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (currentTemplate.photoSlots.length < 4) {
      if (!window.confirm(`This template only has ${currentTemplate.photoSlots.length} photo slots. The standard is 4. Continue anyway?`)) {
        return;
      }
    }

    onSave(currentTemplate);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-2 flex justify-between items-center border-b">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={currentTemplate.name}
            onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
            className="text-lg font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-purple-500 outline-none px-2 py-1"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm bg-gray-300 rounded hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 font-bold"
          >
            Save Template
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-white p-3 overflow-y-auto border-r text-sm">
          <h2 className="text-base font-bold mb-3">Template Settings</h2>

          {/* Template Properties */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-sm">Dimensions</h3>
            
            {/* Unit Toggle */}
            <div className="mb-2 flex items-center justify-between bg-gray-100 rounded p-1.5">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setUseInches(false)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    !useInches ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Pixels
                </button>
                <button
                  onClick={() => setUseInches(true)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    useInches ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  Inches
                </button>
              </div>
              {useInches && (
                <div className="flex items-center gap-1 text-xs">
                  <label>DPI:</label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(parseInt(e.target.value))}
                    className="border rounded px-1 py-0.5 text-xs"
                  >
                    <option value="150">150</option>
                    <option value="300">300</option>
                    <option value="600">600</option>
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div>
                <label className="block text-xs mb-0.5">
                  Width {useInches && `(${formatDimension(currentTemplate.width)})`}
                </label>
                {useInches ? (
                  <input
                    type="number"
                    step="0.1"
                    value={pxToInches(currentTemplate.width)}
                    onChange={(e) => setCurrentTemplate({ 
                      ...currentTemplate, 
                      width: inchesToPx(parseFloat(e.target.value) || 4)
                    })}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="inches"
                  />
                ) : (
                  <input
                    type="number"
                    value={currentTemplate.width}
                    onChange={(e) => setCurrentTemplate({ 
                      ...currentTemplate, 
                      width: parseInt(e.target.value) || 1200 
                    })}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="pixels"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs mb-0.5">
                  Height {useInches && `(${formatDimension(currentTemplate.height)})`}
                </label>
                {useInches ? (
                  <input
                    type="number"
                    step="0.1"
                    value={pxToInches(currentTemplate.height)}
                    onChange={(e) => setCurrentTemplate({ 
                      ...currentTemplate, 
                      height: inchesToPx(parseFloat(e.target.value) || 6)
                    })}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="inches"
                  />
                ) : (
                  <input
                    type="number"
                    value={currentTemplate.height}
                    onChange={(e) => setCurrentTemplate({ 
                      ...currentTemplate, 
                      height: parseInt(e.target.value) || 1800 
                    })}
                    className="w-full border rounded px-2 py-1 text-sm"
                    placeholder="pixels"
                  />
                )}
              </div>
              {useInches && (
                <p className="text-xs text-gray-600 bg-blue-50 p-1.5 rounded">
                  💡 2×6" strip, 4×6" photo, 5×7" print
                </p>
              )}
            </div>
          </div>

          {/* Background Upload */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1.5 text-sm">Background</h3>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleBackgroundUpload}
              className="w-full text-xs"
            />
            {currentTemplate.backgroundDataUrl && (
              <div className="mt-1.5">
                <img
                  src={currentTemplate.backgroundDataUrl}
                  alt="Background"
                  className="w-full h-16 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Foreground Upload */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1.5 text-sm">Foreground (Optional)</h3>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleForegroundUpload}
              className="w-full text-xs"
            />
            {currentTemplate.foregroundDataUrl && (
              <div className="mt-1.5">
                <img
                  src={currentTemplate.foregroundDataUrl}
                  alt="Foreground"
                  className="w-full h-16 object-cover rounded"
                />
              </div>
            )}
          </div>

          {/* Photo Slots */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1.5 text-sm">Photo Slots ({currentTemplate.photoSlots.length})</h3>
            <button
              onClick={addPhotoSlot}
              className="w-full bg-green-500 text-white py-1.5 text-sm rounded hover:bg-green-600 mb-1.5"
            >
              + Add Photo Slot
            </button>
            <button
              onClick={createDualStripLayout}
              className="w-full bg-blue-500 text-white py-1.5 text-sm rounded hover:bg-blue-600 mb-2"
            >
              🎞️ Create Dual Strip (2×4)
            </button>

            {/* Capture Mode Setting */}
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <label className="block text-xs font-semibold mb-1.5 text-gray-800">
                📸 Photo Capture Mode
              </label>
              <select
                value={currentTemplate.captureMode || 'extra'}
                onChange={(e) => setCurrentTemplate({ 
                  ...currentTemplate, 
                  captureMode: e.target.value as 'exact' | 'extra'
                })}
                className="w-full border rounded px-2 py-1.5 text-xs bg-white"
              >
                <option value="exact">Exact Match - Capture {currentTemplate.photoSlots.length} photo{currentTemplate.photoSlots.length !== 1 ? 's' : ''}</option>
                <option value="extra">Extra Photos - Always capture 8</option>
              </select>
              <p className="text-xs text-gray-600 mt-1.5">
                {currentTemplate.captureMode === 'exact' || !currentTemplate.captureMode
                  ? `📷 Will capture ${currentTemplate.photoSlots.length} photo${currentTemplate.photoSlots.length !== 1 ? 's' : ''} (exact slot count)`
                  : '📷 Will capture 8 photos (user selects best ones)'}
              </p>
            </div>

            <div className="space-y-1.5">
              {currentTemplate.photoSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-1.5 border rounded cursor-pointer ${
                    selectedSlotId === slot.id ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedSlotId(slot.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-xs">{slot.name}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); duplicateSlot(slot.id); }}
                        className="text-xs px-1.5 py-0.5 bg-blue-500 text-white rounded"
                      >
                        Copy
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteSlot(slot.id); }}
                        className="text-xs px-1.5 py-0.5 bg-red-500 text-white rounded"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {formatDimension(slot.width)} × {formatDimension(slot.height)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Template Options */}
          <div className="mb-4">
            <h3 className="font-semibold mb-1.5 text-sm">Options</h3>
            <label className="flex items-center gap-2 mb-1.5">
              <input
                type="checkbox"
                checked={currentTemplate.enabled}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, enabled: e.target.checked })}
              />
              <span className="text-xs">Enabled for users</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentTemplate.isDefault}
                onChange={(e) => setCurrentTemplate({ ...currentTemplate, isDefault: e.target.checked })}
              />
              <span className="text-xs">Set as default</span>
            </label>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 p-4 overflow-auto bg-gray-200">
          <div
            ref={canvasRef}
            className="mx-auto bg-white shadow-2xl relative"
            style={{
              width: '100%',
              maxWidth: '800px',
              aspectRatio: `${currentTemplate.width} / ${currentTemplate.height}`
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Background */}
            {currentTemplate.backgroundDataUrl && (
              <img
                src={currentTemplate.backgroundDataUrl}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            )}

            {/* Photo Slots */}
            {currentTemplate.photoSlots.map((slot) => (
              <div
                key={slot.id}
                className={`absolute border-2 ${
                  selectedSlotId === slot.id ? 'border-purple-500' : 'border-blue-400'
                } bg-blue-100 bg-opacity-30 cursor-move`}
                style={{
                  left: `${(slot.x / currentTemplate.width) * 100}%`,
                  top: `${(slot.y / currentTemplate.height) * 100}%`,
                  width: `${(slot.width / currentTemplate.width) * 100}%`,
                  height: `${(slot.height / currentTemplate.height) * 100}%`,
                  borderRadius: `${slot.cornerRadius}px`
                }}
                onMouseDown={(e) => handleMouseDown(e, slot.id, 'move')}
              >
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1">
                  {slot.name}
                </div>
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-purple-500 cursor-nwse-resize"
                  onMouseDown={(e) => handleMouseDown(e, slot.id, 'resize')}
                />
              </div>
            ))}

            {/* Foreground */}
            {currentTemplate.foregroundDataUrl && (
              <img
                src={currentTemplate.foregroundDataUrl}
                alt="Foreground"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Slot Properties */}
        {selectedSlot && (
          <div className="w-64 bg-white p-3 overflow-y-auto border-l text-sm">
            <h2 className="text-base font-bold mb-3">Slot Properties</h2>

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium mb-0.5">Name</label>
                <input
                  type="text"
                  value={selectedSlot.name}
                  onChange={(e) => updateSlot(selectedSlotId, { name: e.target.value })}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-xs font-medium mb-0.5">
                    X {useInches && `(${formatDimension(selectedSlot.x)})`}
                  </label>
                  {useInches ? (
                    <input
                      type="number"
                      step="0.01"
                      value={pxToInches(selectedSlot.x)}
                      onChange={(e) => updateSlot(selectedSlotId, { 
                        x: inchesToPx(parseFloat(e.target.value) || 0)
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <input
                      type="number"
                      value={Math.round(selectedSlot.x)}
                      onChange={(e) => updateSlot(selectedSlotId, { x: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-0.5">
                    Y {useInches && `(${formatDimension(selectedSlot.y)})`}
                  </label>
                  {useInches ? (
                    <input
                      type="number"
                      step="0.01"
                      value={pxToInches(selectedSlot.y)}
                      onChange={(e) => updateSlot(selectedSlotId, { 
                        y: inchesToPx(parseFloat(e.target.value) || 0)
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <input
                      type="number"
                      value={Math.round(selectedSlot.y)}
                      onChange={(e) => updateSlot(selectedSlotId, { y: parseInt(e.target.value) || 0 })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-xs font-medium mb-0.5">
                    Width {useInches && `(${formatDimension(selectedSlot.width)})`}
                  </label>
                  {useInches ? (
                    <input
                      type="number"
                      step="0.1"
                      value={pxToInches(selectedSlot.width)}
                      onChange={(e) => updateSlot(selectedSlotId, { 
                        width: inchesToPx(parseFloat(e.target.value) || 0.5)
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <input
                      type="number"
                      value={Math.round(selectedSlot.width)}
                      onChange={(e) => updateSlot(selectedSlotId, { width: parseInt(e.target.value) || 50 })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-0.5">
                    Height {useInches && `(${formatDimension(selectedSlot.height)})`}
                  </label>
                  {useInches ? (
                    <input
                      type="number"
                      step="0.1"
                      value={pxToInches(selectedSlot.height)}
                      onChange={(e) => updateSlot(selectedSlotId, { 
                        height: inchesToPx(parseFloat(e.target.value) || 0.5)
                      })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <input
                      type="number"
                      value={Math.round(selectedSlot.height)}
                      onChange={(e) => updateSlot(selectedSlotId, { height: parseInt(e.target.value) || 50 })}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5">Image Fit</label>
                <select
                  value={selectedSlot.fit}
                  onChange={(e) => updateSlot(selectedSlotId, { fit: e.target.value as any })}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-0.5">Corner Radius</label>
                <input
                  type="number"
                  value={selectedSlot.cornerRadius}
                  onChange={(e) => updateSlot(selectedSlotId, { cornerRadius: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
