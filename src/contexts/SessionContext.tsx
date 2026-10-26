import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PhotoSession, CapturedPhoto, SessionStep, PhotoEdit } from '../types';
import { saveSession, clearSession, getDefaultPhotoEdit } from '../utils/storage';

interface SessionContextType {
  session: PhotoSession | null;
  currentStep: SessionStep;
  countdownSeconds: number;
  setCountdownSeconds: (seconds: number) => void;
  startNewSession: () => void;
  addCapturedPhoto: (dataUrl: string) => void;
  setSelectedPhotos: (photoIds: string[]) => void;
  setTemplateId: (templateId: string) => void;
  updatePhotoEdits: (photoId: string, edits: PhotoEdit) => void;
  assignPhotoToSlot: (slotId: string, photoId: string) => void;
  setFinalImage: (dataUrl: string) => void;
  setRecordingBlob: (blob: Blob) => void;
  setRecordingConsent: (consent: boolean) => void;
  goToStep: (step: SessionStep) => void;
  clearCurrentSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<PhotoSession | null>(null);
  const [currentStep, setCurrentStep] = useState<SessionStep>('welcome');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(5);

  const startNewSession = useCallback(() => {
    const newSession: PhotoSession = {
      id: `session-${Date.now()}`,
      capturedPhotos: [],
      selectedPhotoIds: [],
      templateId: '',
      photoAssignments: [],
      createdAt: Date.now()
    };
    setSession(newSession);
    setCurrentStep('capture');
  }, []);

  const addCapturedPhoto = useCallback((dataUrl: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const newPhoto: CapturedPhoto = {
        id: `photo-${Date.now()}-${Math.random()}`,
        dataUrl,
        timestamp: Date.now(),
        edits: getDefaultPhotoEdit()
      };
      const updated = {
        ...prev,
        capturedPhotos: [...prev.capturedPhotos, newPhoto]
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  const setSelectedPhotos = useCallback((photoIds: string[]) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, selectedPhotoIds: photoIds };
      saveSession(updated);
      return updated;
    });
  }, []);

  const setTemplateId = useCallback((templateId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, templateId };
      saveSession(updated);
      return updated;
    });
  }, []);

  const updatePhotoEdits = useCallback((photoId: string, edits: PhotoEdit) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        capturedPhotos: prev.capturedPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, edits } : photo
        )
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  const assignPhotoToSlot = useCallback((slotId: string, photoId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const existingAssignments = prev.photoAssignments.filter(
        (a) => a.slotId !== slotId
      );
      const updated = {
        ...prev,
        photoAssignments: [...existingAssignments, { slotId, photoId }]
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  const setFinalImage = useCallback((dataUrl: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        finalImageDataUrl: dataUrl,
        completedAt: Date.now()
      };
      saveSession(updated);
      return updated;
    });
  }, []);

  const goToStep = useCallback((step: SessionStep) => {
    setCurrentStep(step);
  }, []);

  const setRecordingBlob = useCallback((blob: Blob) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, recordingBlob: blob };
      saveSession(updated);
      return updated;
    });
  }, []);

  const setRecordingConsent = useCallback((consent: boolean) => {
    setSession((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, recordingConsent: consent };
      saveSession(updated);
      return updated;
    });
  }, []);

  const clearCurrentSession = useCallback(() => {
    if (session) {
      clearSession(session.id);
    }
    setSession(null);
    setCurrentStep('welcome');
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        currentStep,
        countdownSeconds,
        setCountdownSeconds,
        startNewSession,
        addCapturedPhoto,
        setSelectedPhotos,
        setTemplateId,
        updatePhotoEdits,
        assignPhotoToSlot,
        setFinalImage,
        setRecordingBlob,
        setRecordingConsent,
        goToStep,
        clearCurrentSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
