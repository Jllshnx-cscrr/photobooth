import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId, fileType, fileIndex, dataUrl, mimeType } = req.body;

    if (!sessionId || !fileType || !dataUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert base64 to buffer
    const base64Data = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Determine file path and content type
    let filePath: string;
    let contentType: string;

    switch (fileType) {
      case 'raw_photo':
        filePath = `sessions/${sessionId}/raw/photo-${fileIndex + 1}.png`;
        contentType = 'image/png';
        break;
      case 'final_strip':
        filePath = `sessions/${sessionId}/final-strip.png`;
        contentType = 'image/png';
        break;
      case 'recording':
        filePath = `sessions/${sessionId}/recording.webm`;
        contentType = mimeType || 'video/webm';
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }

    // Upload to Vercel Blob
    const blob = await put(filePath, buffer, {
      access: 'public',
      contentType
    });

    return res.status(200).json({
      success: true,
      url: blob.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Increase the body size limit for this endpoint
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow up to 10MB per file
    },
  },
};
