import { PhotoSession, PersistedSession, UploadProgress } from '../types';
import { put } from '@vercel/blob';

// Helper to convert base64 to Blob
const base64ToBlob = (base64: string, mimeType: string = 'image/png'): Blob => {
  const base64Data = base64.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// Upload a single file to Vercel Blob
const uploadToBlob = async (
  blob: Blob,
  path: string,
  token: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', blob, path);

  const response = await fetch(`https://blob.vercel-storage.com`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload to Blob: ${response.statusText}`);
  }

  const data = await response.json();
  return data.url;
};

export const uploadSession = async (
  session: PhotoSession,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ success: boolean; viewUrl?: string; error?: string }> => {
  try {
    // Check if we're in development mode (local)
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // In development, simulate upload (API routes only work on Vercel)
    if (isDevelopment) {
      console.log('🔧 Development Mode: Simulating upload...');
      console.log('Session ID:', session.id);
      console.log('Photos:', session.capturedPhotos.length);
      console.log('Final Strip:', session.finalImageDataUrl ? 'Yes' : 'No');
      
      // Save session to localStorage for viewing later
      try {
        // Save session data
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

    // Production mode: Upload directly to Vercel Blob
    onProgress?.({
      stage: 'uploading_photos',
      progress: 5,
      message: 'Preparing to upload photos...'
    });

    const uploadedFiles: {
      raw_photos: string[];
      final_strip_url?: string;
    } = {
      raw_photos: []
    };

    // Get blob token from environment (set by Vercel automatically)
    const blobToken = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    if (!blobToken) {
      console.warn('Blob token not found - attempting direct API upload');
    }

    // Upload raw photos (use small progress increments)
    const photoProgressIncrement = 70 / session.capturedPhotos.length;
    for (let i = 0; i < session.capturedPhotos.length; i++) {
      const photo = session.capturedPhotos[i];
      onProgress?.({
        stage: 'uploading_photos',
        progress: 5 + (i * photoProgressIncrement),
        message: `Uploading photo ${i + 1} of ${session.capturedPhotos.length}...`
      });

      try {
        // Upload via API route (smaller payload per request)
        const response = await fetch('/api/upload-file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.id,
            fileType: 'raw_photo',
            fileIndex: i,
            dataUrl: photo.dataUrl
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to upload photo ${i + 1}`);
        }

        const result = await response.json();
        uploadedFiles.raw_photos.push(result.url);
      } catch (error) {
        console.error(`Failed to upload photo ${i + 1}:`, error);
        throw error;
      }
    }

    // Upload final strip
    if (session.finalImageDataUrl) {
      onProgress?.({
        stage: 'uploading_photos',
        progress: 80,
        message: 'Uploading final photo strip...'
      });

      const response = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          fileType: 'final_strip',
          dataUrl: session.finalImageDataUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload final strip');
      }

      const result = await response.json();
      uploadedFiles.final_strip_url = result.url;
    }

    // Save metadata to Supabase
    onProgress?.({
      stage: 'uploading_photos',
      progress: 90,
      message: 'Saving session data...'
    });

    const metadataResponse = await fetch('/api/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session.id,
        templateId: session.templateId,
        rawPhotos: uploadedFiles.raw_photos,
        finalStripUrl: uploadedFiles.final_strip_url,
        expiryDays: parseInt(import.meta.env.VITE_SESSION_EXPIRY_DAYS || '30')
      })
    });

    if (!metadataResponse.ok) {
      throw new Error('Failed to save session metadata');
    }

    const metadata = await metadataResponse.json();

    onProgress?.({
      stage: 'completed',
      progress: 100,
      message: 'Upload complete!'
    });

    return {
      success: true,
      viewUrl: metadata.viewUrl
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
