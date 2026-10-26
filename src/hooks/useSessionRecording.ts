import { useState, useRef, useCallback, useEffect } from 'react';

interface RecordingOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingBlob: Blob | null;
  error: string | null;
  duration: number;
  isSupported: boolean;
}

export const useSessionRecording = (stream: MediaStream | null) => {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    recordingBlob: null,
    error: null,
    duration: 0,
    isSupported: typeof MediaRecorder !== 'undefined'
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);

  // Determine supported MIME type
  const getSupportedMimeType = useCallback((): string | undefined => {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (!stream || !state.isSupported) {
      setState(prev => ({
        ...prev,
        error: state.isSupported 
          ? 'No media stream available' 
          : 'MediaRecorder is not supported in this browser'
      }));
      return false;
    }

    try {
      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        throw new Error('No supported video MIME type found');
      }

      const options: RecordingOptions = {
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      };

      const mediaRecorder = new MediaRecorder(stream, options);
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setState(prev => ({
          ...prev,
          isRecording: false,
          recordingBlob: blob,
          duration: Date.now() - startTimeRef.current
        }));

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
          durationIntervalRef.current = null;
        }
      };

      mediaRecorder.onerror = (event: Event) => {
        console.error('MediaRecorder error:', event);
        setState(prev => ({
          ...prev,
          isRecording: false,
          error: 'Recording failed. Please try again.'
        }));

        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };

      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();

      // Update duration every second
      durationIntervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Date.now() - startTimeRef.current
        }));
      }, 1000);

      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        error: null,
        recordingBlob: null,
        duration: 0
      }));

      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start recording'
      }));
      return false;
    }
  }, [stream, state.isSupported, getSupportedMimeType]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all tracks to release camera
      stream?.getTracks().forEach(track => {
        // Don't actually stop the tracks since they're still needed by the video element
        // Just stop recording
      });
    }
  }, [state.isRecording, stream]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  }, [state.isRecording, state.isPaused]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));

      // Resume duration counter
      durationIntervalRef.current = window.setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Date.now() - startTimeRef.current
        }));
      }, 1000);
    }
  }, [state.isRecording, state.isPaused]);

  // Clear recording
  const clearRecording = useCallback(() => {
    setState(prev => ({
      ...prev,
      recordingBlob: null,
      error: null,
      duration: 0
    }));
    chunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (mediaRecorderRef.current && state.isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [state.isRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording
  };
};

export default useSessionRecording;
