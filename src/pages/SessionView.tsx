import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSession } from '../utils/uploadSession';
import { PersistedSession } from '../types';

export const SessionView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<PersistedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!sessionId) {
      setError('Invalid session ID');
      setLoading(false);
      return;
    }

    loadSession(sessionId);
  }, [sessionId]);

  const loadSession = async (id: string) => {
    try {
      setLoading(true);
      const data = await fetchSession(id);
      
      if (!data) {
        setError('Session not found or has expired');
      } else {
        setSession(data);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      setError('Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = () => {
    if (session?.timelapse_url || session?.recording_url) {
      const url = session.timelapse_url || session.recording_url;
      const link = document.createElement('a');
      link.href = url!;
      link.download = `photobooth-video-${session.id}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadPhoto = () => {
    if (session?.final_strip_url) {
      const link = document.createElement('a');
      link.href = session.final_strip_url;
      link.download = `photobooth-photo-${session.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    // Check if we're in development
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <div className="text-red-500 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Session Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'This photobooth session may have expired or the link is invalid.'}
          </p>
          
          {isDevelopment && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-blue-800 font-semibold mb-2">🔧 Development Mode</p>
              <p className="text-blue-700 text-sm mb-2">
                To view session data in development:
              </p>
              <ol className="text-blue-700 text-sm list-decimal list-inside space-y-1 mb-2">
                <li>Scan the QR code on the same device where you created the session</li>
                <li>Or use the same browser tab</li>
              </ol>
              <p className="text-blue-700 text-sm font-semibold">
                For full functionality with persistent storage, deploy to Vercel!
              </p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
          >
            Go to Photobooth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Your Photobooth Moments! 📸
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            {new Date(session.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Video Player */}
        {(session.timelapse_url || session.recording_url) && (
          <div className="bg-white rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Your Photobooth Timelapse
            </h2>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                src={session.timelapse_url || session.recording_url}
                controls
                className="w-full h-auto"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <button
              onClick={handleDownloadVideo}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Video
            </button>
          </div>
        )}

        {/* Photo Strip */}
        {session.final_strip_url && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Your Photo Strip
            </h2>
            <div className="flex justify-center mb-4">
              <img
                src={session.final_strip_url}
                alt="Photo Strip"
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <button
              onClick={handleDownloadPhoto}
              className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Photo
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            This link will expire on{' '}
            {new Date(session.expires_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-white hover:text-white/80 underline text-sm font-semibold"
          >
            Create Your Own Photobooth Session →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionView;
