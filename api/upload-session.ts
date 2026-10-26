import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      sessionId,
      rawPhotos,
      templatedPhotos,
      finalStrip,
      recording,
      templateId
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const uploadedAssets: {
      raw_photos: string[];
      templated_photos: string[];
      final_strip_url?: string;
      recording_url?: string;
    } = {
      raw_photos: [],
      templated_photos: []
    };

    // Upload raw photos
    if (rawPhotos && Array.isArray(rawPhotos)) {
      for (let i = 0; i < rawPhotos.length; i++) {
        const photo = rawPhotos[i];
        const blob = await put(
          `sessions/${sessionId}/raw/photo-${i + 1}.png`,
          Buffer.from(photo.split(',')[1], 'base64'),
          {
            access: 'public',
            contentType: 'image/png'
          }
        );
        uploadedAssets.raw_photos.push(blob.url);
      }
    }

    // Upload templated photos
    if (templatedPhotos && Array.isArray(templatedPhotos)) {
      for (let i = 0; i < templatedPhotos.length; i++) {
        const photo = templatedPhotos[i];
        const blob = await put(
          `sessions/${sessionId}/templated/photo-${i + 1}.png`,
          Buffer.from(photo.split(',')[1], 'base64'),
          {
            access: 'public',
            contentType: 'image/png'
          }
        );
        uploadedAssets.templated_photos.push(blob.url);
      }
    }

    // Upload final strip
    if (finalStrip) {
      const blob = await put(
        `sessions/${sessionId}/final-strip.png`,
        Buffer.from(finalStrip.split(',')[1], 'base64'),
        {
          access: 'public',
          contentType: 'image/png'
        }
      );
      uploadedAssets.final_strip_url = blob.url;
    }

    // Upload recording (if provided)
    if (recording) {
      // Recording is sent as base64-encoded blob
      const recordingBuffer = Buffer.from(recording.data, 'base64');
      const blob = await put(
        `sessions/${sessionId}/recording.webm`,
        recordingBuffer,
        {
          access: 'public',
          contentType: recording.mimeType || 'video/webm'
        }
      );
      uploadedAssets.recording_url = blob.url;
    }

    // Calculate expiry date (30 days from now by default)
    const expiryDays = parseInt(process.env.VITE_SESSION_EXPIRY_DAYS || '30');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    // Get the public URL for the session viewing page
    const viewUrl = `${process.env.VERCEL_URL || req.headers.host}/session/${sessionId}`;

    // Store session metadata in Supabase
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        raw_photos: uploadedAssets.raw_photos,
        templated_photos: uploadedAssets.templated_photos,
        final_strip_url: uploadedAssets.final_strip_url,
        recording_url: uploadedAssets.recording_url,
        view_url: viewUrl,
        template_id: templateId,
        status: 'completed',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save session metadata', details: error.message });
    }

    return res.status(200).json({
      success: true,
      sessionId,
      viewUrl,
      urls: uploadedAssets,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
