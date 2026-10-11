import { Template } from '../types';

/**
 * Creates a simple default template with 4 photo slots
 * Useful for testing when no templates exist
 */
export const createDefaultTemplate = (): Template => {
  return {
    id: `template-default-${Date.now()}`,
    name: 'Classic Photo Strip',
    width: 1200,
    height: 1800,
    backgroundAsset: 'default-background',
    backgroundDataUrl: createDefaultBackground(),
    photoSlots: [
      {
        id: 'slot-1',
        x: 100,
        y: 100,
        width: 1000,
        height: 350,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 0,
        name: 'Photo 1'
      },
      {
        id: 'slot-2',
        x: 100,
        y: 500,
        width: 1000,
        height: 350,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 1,
        name: 'Photo 2'
      },
      {
        id: 'slot-3',
        x: 100,
        y: 900,
        width: 1000,
        height: 350,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 2,
        name: 'Photo 3'
      },
      {
        id: 'slot-4',
        x: 100,
        y: 1300,
        width: 1000,
        height: 350,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 3,
        name: 'Photo 4'
      }
    ],
    enabled: true,
    isDefault: true,
    allowUserCustomization: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
};

/**
 * Creates a simple grid template
 */
export const createGridTemplate = (): Template => {
  return {
    id: `template-grid-${Date.now()}`,
    name: '2×2 Grid',
    width: 1200,
    height: 1200,
    backgroundAsset: 'grid-background',
    backgroundDataUrl: createGridBackground(),
    photoSlots: [
      {
        id: 'slot-1',
        x: 50,
        y: 50,
        width: 550,
        height: 550,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 15,
        zIndex: 0,
        name: 'Top Left'
      },
      {
        id: 'slot-2',
        x: 600,
        y: 50,
        width: 550,
        height: 550,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 15,
        zIndex: 1,
        name: 'Top Right'
      },
      {
        id: 'slot-3',
        x: 50,
        y: 600,
        width: 550,
        height: 550,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 15,
        zIndex: 2,
        name: 'Bottom Left'
      },
      {
        id: 'slot-4',
        x: 600,
        y: 600,
        width: 550,
        height: 550,
        rotation: 0,
        fit: 'cover',
        cornerRadius: 15,
        zIndex: 3,
        name: 'Bottom Right'
      }
    ],
    enabled: true,
    isDefault: false,
    allowUserCustomization: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
};

/**
 * Creates a landscape collage template
 */
export const createCollageTemplate = (): Template => {
  return {
    id: `template-collage-${Date.now()}`,
    name: 'Collage Style',
    width: 1920,
    height: 1080,
    backgroundAsset: 'collage-background',
    backgroundDataUrl: createCollageBackground(),
    photoSlots: [
      {
        id: 'slot-1',
        x: 50,
        y: 90,
        width: 900,
        height: 900,
        rotation: -5,
        fit: 'cover',
        cornerRadius: 20,
        zIndex: 0,
        name: 'Main Photo'
      },
      {
        id: 'slot-2',
        x: 1000,
        y: 50,
        width: 400,
        height: 300,
        rotation: 3,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 1,
        name: 'Top Right'
      },
      {
        id: 'slot-3',
        x: 1450,
        y: 50,
        width: 400,
        height: 300,
        rotation: -2,
        fit: 'cover',
        cornerRadius: 10,
        zIndex: 2,
        name: 'Far Right'
      },
      {
        id: 'slot-4',
        x: 1200,
        y: 400,
        width: 650,
        height: 630,
        rotation: 2,
        fit: 'cover',
        cornerRadius: 15,
        zIndex: 3,
        name: 'Bottom Right'
      }
    ],
    enabled: true,
    isDefault: false,
    allowUserCustomization: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
};

/**
 * Creates a gradient background
 */
function createDefaultBackground(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1800;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, 1800);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 1800);

  // Add decorative elements
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(1000, 200, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(200, 1600, 200, 0, Math.PI * 2);
  ctx.fill();

  // Add title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Photo Booth', 600, 80);

  return canvas.toDataURL('image/png');
}

/**
 * Creates a grid background
 */
function createGridBackground(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1200;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 1200);
  gradient.addColorStop(0, '#f093fb');
  gradient.addColorStop(1, '#f5576c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 1200);

  // Add pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(i * 100, j * 100, 100, 100);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

/**
 * Creates a collage background
 */
function createCollageBackground(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Gradient background
  const gradient = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
  gradient.addColorStop(0, '#ffecd2');
  gradient.addColorStop(1, '#fcb69f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1920, 1080);

  // Add decorative shapes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.arc(300, 200, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1600, 800, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1700, 200, 80, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}

/**
 * Get all sample templates
 */
export const getSampleTemplates = (): Template[] => {
  return [
    createDefaultTemplate(),
    createGridTemplate(),
    createCollageTemplate()
  ];
};
