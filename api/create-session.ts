import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
      templateId,
      finalStripUrl,
      expiryDays = 30
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!finalStripUrl) {
      return res.status(400).json({ error: 'Final strip URL is required' });
    }

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    // Get the public URL for the session viewing page
    const host = req.headers.host || 'photobooth-jet-one.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const viewUrl = `${protocol}://${host}/session/${sessionId}`;

    // Store session metadata in Supabase (backward compatible with old schema)
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        final_strip_url: finalStripUrl,
        view_url: viewUrl,
        template_id: templateId,
        status: 'completed',
        expires_at: expiresAt.toISOString(),
        completed_at: new Date().toISOString(),
        // Backward compatibility: empty arrays for old schema
        raw_photos: [],
        templated_photos: []
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ 
        error: 'Failed to save session metadata', 
        details: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      sessionId,
      viewUrl,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error) {
    console.error('Create session error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
