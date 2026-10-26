import { PhotoSession, PersistedSession, UploadProgress } from '../types';

export const uploadSession = async (
  session: PhotoSession,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; viewUrl?: string; error?: string }> => {
  try {
    // Check if we're in development mode (local)
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Update progress: Starting upload
    onProgress?.({
      stage: 'uploading_photos',
      progress: 10,
      message: 'Preparing photos...'
    });

    // Convert recording blob to base64 if available
    let recordingData: { data: string; mimeType: string } | undefined;
    if (session.recordingBlob) {
      onProgress?.({
        stage: 'uploading_video',
        progress: 30,
        message: 'Uploading recording...'
      });

      recordingData = await blobToBase64(session.recordingBlob);
    }

    // In development, simulate upload (API routes only work on Vercel)
    if (isDevelopment) {
      console.log('🔧 Development Mode: Simulating upload...');
      console.log('Session ID:', session.id);
      console.log('Photos:', session.capturedPhotos.length);
      console.log('Recording:', recordingData ? 'Yes' : 'No');
      console.log('Final Strip:', session.finalImageDataUrl ? 'Yes' : 'No');
      
      // Save session to localStorage for viewing later
      try {
        localStorage.setItem(`session-${session.id}`, JSON.stringify(session));
        console.log('✅ Session saved to localStorage for local viewing');
      } catch (e) {
        console.error('Failed to save session to localStorage:', e);
      }
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onProgress?.({
        stage: 'uploading_photos',
        progress: 60,
        message: 'Simulating cloud storage upload...'
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      onProgress?.({
        stage: 'completed',
        progress: 100,
        message: 'Upload simulated! (Deploy to Vercel for real uploads)'
      });

      // Return a mock view URL
      return {
        success: true,
        viewUrl: `${window.location.origin}/session/${session.id}`
      };
    }

    // Production mode: Use real API
    const payload = {
      sessionId: session.id,
      rawPhotos: session.capturedPhotos.map(p => p.dataUrl),
      templatedPhotos: session.capturedPhotos.map(p => p.dataUrl),
      finalStrip: session.finalImageDataUrl,
      recording: recordingData,
      templateId: session.templateId
    };

    onProgress?.({
      stage: 'uploading_photos',
      progress: 60,
      message: 'Uploading to cloud storage...'
    });

    // Upload to serverless function
    const response = await fetch('/api/upload-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Upload failed';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();

    onProgress?.({
      stage: 'completed',
      progress: 100,
      message: 'Upload complete!'
    });

    return {
      success: true,
      viewUrl: result.viewUrl
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: 'Upload failed',
      error: errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
};

// Helper function to convert Blob to base64
const blobToBase64 = (blob: Blob): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // Remove the data URL prefix (e.g., "data:video/webm;base64,")
      const base64 = base64data.split(',')[1];
      resolve({
        data: base64,
        mimeType: blob.type
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Fetch a persisted session by ID
export const fetchSession = async (sessionId: string): Promise<PersistedSession | null> => {
  try {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      console.log('🔧 Development Mode: Loading session from local storage');
      console.log('Session ID:', sessionId);
      
      // Try to get the session from localStorage (saved during photo session)
      const localSession = localStorage.getItem(`session-${sessionId}`);
      
      if (localSession) {
        try {
          const parsedSession = JSON.parse(localSession);
          console.log('✅ Found local session data!');
          
          // Convert to PersistedSession format
          return {
            id: sessionId,
            created_at: new Date(parsedSession.createdAt).toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            raw_photos: parsedSession.capturedPhotos?.map((p: any) => p.dataUrl) || [],
            templated_photos: parsedSession.capturedPhotos?.map((p: any) => p.dataUrl) || [],
            final_strip_url: parsedSession.finalImageDataUrl,
            recording_url: parsedSession.recordingBlob ? URL.createObjectURL(parsedSession.recordingBlob) : undefined,
            timelapse_url: undefined,
            qr_code_url: undefined,
            view_url: `${window.location.origin}/session/${sessionId}`,
            template_id: parsedSession.templateId || 'default',
            status: 'completed'
          };
        } catch (e) {
          console.error('Failed to parse local session:', e);
        }
      }
      
      console.log('⚠️ No local session found. This is expected if:');
      console.log('   - You refreshed the page after the session');
      console.log('   - You scanned the QR code from a different device');
      console.log('   - The session was created in a different browser tab');
      console.log('');
      console.log('💡 To see session data, scan the QR code on the same device/browser where you created the session.');
      console.log('   Or deploy to Vercel for persistent storage!');
      
      return null;
    }

    // Production: Fetch from API
    const response = await fetch(`/api/get-session?sessionId=${encodeURIComponent(sessionId)}`);
    
    if (!response.ok) {
      if (response.status === 404 || response.status === 410) {
        return null;
      }
      throw new Error('Failed to fetch session');
    }

    const result = await response.json();
    return result.session;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    return null;
  }
};

// Generate unique session ID
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
