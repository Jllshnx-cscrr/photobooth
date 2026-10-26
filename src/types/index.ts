export interface PhotoSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fit: 'cover' | 'contain' | 'fill';
  cornerRadius: number;
  zIndex: number;
  name: string;
  sourceSlotId?: string;  // If set, this slot uses the photo from another slot (for dual strip mirroring)
}

export interface Template {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundAsset: string;
  backgroundDataUrl?: string;
  foregroundAsset?: string;
  foregroundDataUrl?: string;
  photoSlots: PhotoSlot[];
  enabled: boolean;
  isDefault: boolean;
  allowUserCustomization: boolean;
  captureMode: 'exact' | 'extra';  // 'exact' = capture only slot count, 'extra' = always capture 8
  uniquePhotosNeeded?: number;  // For dual strips: 8 slots but only 4 unique photos needed
  createdAt: number;
  updatedAt: number;
}

export interface PhotoEdit {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  filter: 'none' | 'bw' | 'sepia' | 'vintage';
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  zoom: number;
  cropX: number;
  cropY: number;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  edits?: PhotoEdit;
}

export interface PhotoAssignment {
  slotId: string;
  photoId: string;
}

export interface PhotoSession {
  id: string;
  capturedPhotos: CapturedPhoto[];
  selectedPhotoIds: string[];
  templateId: string;
  photoAssignments: PhotoAssignment[];
  finalImageDataUrl?: string;
  createdAt: number;
  completedAt?: number;
}

export type SessionStep = 
  | 'welcome'
  | 'capture'
  | 'selection'
  | 'preview';

export interface CameraConfig {
  deviceId?: string;
  facingMode?: 'user' | 'environment';
}
