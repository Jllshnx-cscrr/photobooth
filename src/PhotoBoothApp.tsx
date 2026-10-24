import React, { useEffect } from 'react';
import { useSession } from './contexts/SessionContext';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CameraCapture } from './components/CameraCapture';
import { PhotoSelection } from './components/PhotoSelection';
import { FinalPreview } from './components/FinalPreview';

export const PhotoBoothApp: React.FC = () => {
  const { currentStep } = useSession();

  useEffect(() => {
    // Request fullscreen on mobile devices for better experience
    const requestFullscreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Fullscreen request failed, continue anyway
        });
      }
    };

    // Listen for user gesture to request fullscreen
    const handleClick = () => {
      requestFullscreen();
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {currentStep === 'welcome' && <WelcomeScreen />}
      {currentStep === 'capture' && <CameraCapture />}
      {currentStep === 'selection' && <PhotoSelection />}
      {currentStep === 'preview' && <FinalPreview />}
    </div>
  );
};
