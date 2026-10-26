import React from 'react';

interface RecordingIndicatorProps {
  duration: number; // in milliseconds
  isPaused?: boolean;
}

export const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  duration,
  isPaused = false
}) => {
  const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg">
      {/* Recording dot animation */}
      <div className="relative flex items-center justify-center">
        {!isPaused && (
          <>
            <div className="absolute w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
            <div className="relative w-3 h-3 bg-white rounded-full"></div>
          </>
        )}
        {isPaused && (
          <div className="w-3 h-3 bg-white rounded-full"></div>
        )}
      </div>

      {/* Text */}
      <span className="font-semibold text-sm">
        {isPaused ? 'PAUSED' : 'REC'}
      </span>

      {/* Duration */}
      <span className="font-mono text-sm">
        {formatDuration(duration)}
      </span>
    </div>
  );
};

export default RecordingIndicator;
