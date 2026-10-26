import { PhotoEdit, CapturedPhoto, Template, PhotoAssignment } from '../types';

export const applyPhotoEdits = (
  canvas: HTMLCanvasElement,
  imageDataUrl: string,
  edits: PhotoEdit
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();

      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((edits.rotation * Math.PI) / 180);
      ctx.scale(edits.flipH ? -1 : 1, edits.flipV ? -1 : 1);
      ctx.scale(edits.zoom, edits.zoom);

      // Draw image
      ctx.drawImage(
        img,
        -img.width / 2 - edits.cropX,
        -img.height / 2 - edits.cropY,
        img.width,
        img.height
      );

      ctx.restore();

      // Apply filters
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness
        const brightnessFactor = 1 + edits.brightness / 100;
        r *= brightnessFactor;
        g *= brightnessFactor;
        b *= brightnessFactor;

        // Contrast
        const contrastFactor = (259 * (edits.contrast + 255)) / (255 * (259 - edits.contrast));
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;

        // Saturation
        const gray = 0.2989 * r + 0.587 * g + 0.114 * b;
        const satFactor = 1 + edits.saturation / 100;
        r = gray + (r - gray) * satFactor;
        g = gray + (g - gray) * satFactor;
        b = gray + (b - gray) * satFactor;

        // Warmth
        if (edits.warmth !== 0) {
          r += edits.warmth * 2;
          b -= edits.warmth * 2;
        }

        // Apply filter
        if (edits.filter === 'bw') {
          const bw = 0.299 * r + 0.587 * g + 0.114 * b;
          r = g = b = bw;
        } else if (edits.filter === 'sepia') {
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          r = tr;
          g = tg;
          b = tb;
        } else if (edits.filter === 'vintage') {
          r *= 1.2;
          g *= 1.1;
          b *= 0.9;
        }

        // Clamp values
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
};

export const composeFinalImage = async (
  template: Template,
  photos: CapturedPhoto[],
  assignments: PhotoAssignment[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('Starting composeFinalImage', { 
      templateId: template.id, 
      photosCount: photos.length, 
      assignmentsCount: assignments.length 
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      reject(new Error('Could not get canvas context'));
      return;
    }

    let loadedImages = 0;
    const totalImages = 1 + (template.foregroundDataUrl ? 1 : 0) + assignments.length;
    
    console.log('Total images to load:', totalImages);

    const checkComplete = () => {
      loadedImages++;
      console.log(`Loaded ${loadedImages}/${totalImages} images`);
      if (loadedImages === totalImages) {
        console.log('All images loaded, generating final image');
        resolve(canvas.toDataURL('image/png', 1.0));
      }
    };

    // Draw background
    if (template.backgroundDataUrl) {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, template.width, template.height);
        checkComplete();
      };
      bgImg.onerror = () => reject(new Error('Failed to load background'));
      bgImg.src = template.backgroundDataUrl;
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, template.width, template.height);
      checkComplete();
    }

    // Draw photos in slots
    assignments.forEach((assignment, index) => {
      const slot = template.photoSlots.find((s) => s.id === assignment.slotId);
      const photo = photos.find((p) => p.id === assignment.photoId);

      if (!slot || !photo) {
        console.warn(`Assignment ${index}: Missing slot or photo`, { 
          slotId: assignment.slotId, 
          photoId: assignment.photoId,
          slotFound: !!slot,
          photoFound: !!photo 
        });
        checkComplete();
        return;
      }
      
      console.log(`Processing assignment ${index}:`, { 
        slotId: slot.id, 
        slotName: slot.name, 
        photoId: photo.id,
        isMirror: !!slot.sourceSlotId
      });

      const photoImg = new Image();
      
      // Add timeout for image loading (30 seconds)
      const imageTimeout = setTimeout(() => {
        console.error(`Timeout loading photo for slot ${slot.name}`);
        checkComplete();
      }, 30000);
      
      photoImg.onload = () => {
        clearTimeout(imageTimeout);
        console.log(`Photo loaded for slot ${slot.name}`);
        ctx.save();

        // Create clipping path for rounded corners
        if (slot.cornerRadius > 0) {
          ctx.beginPath();
          const x = slot.x;
          const y = slot.y;
          const w = slot.width;
          const h = slot.height;
          const r = slot.cornerRadius;
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.clip();
        }

        // Calculate aspect ratios
        const slotRatio = slot.width / slot.height;
        const imgRatio = photoImg.width / photoImg.height;

        let srcX = 0, srcY = 0, srcWidth = photoImg.width, srcHeight = photoImg.height;
        let destX = slot.x, destY = slot.y, destWidth = slot.width, destHeight = slot.height;

        if (slot.fit === 'cover') {
          // Cover: fill the slot completely, crop the excess
          if (imgRatio > slotRatio) {
            // Image is wider than slot - crop sides
            srcHeight = photoImg.height;
            srcWidth = photoImg.height * slotRatio;
            srcX = (photoImg.width - srcWidth) / 2; // Center crop
            srcY = 0;
          } else {
            // Image is taller than slot - crop top/bottom
            srcWidth = photoImg.width;
            srcHeight = photoImg.width / slotRatio;
            srcX = 0;
            srcY = (photoImg.height - srcHeight) / 2; // Center crop
          }
          
          // Draw the cropped portion to fill the slot
          ctx.drawImage(
            photoImg,
            srcX, srcY, srcWidth, srcHeight,
            destX, destY, destWidth, destHeight
          );
        } else if (slot.fit === 'contain') {
          // Contain: fit entire image inside slot, may have gaps
          if (imgRatio > slotRatio) {
            destWidth = slot.width;
            destHeight = slot.width / imgRatio;
            destX = slot.x;
            destY = slot.y + (slot.height - destHeight) / 2;
          } else {
            destHeight = slot.height;
            destWidth = slot.height * imgRatio;
            destX = slot.x + (slot.width - destWidth) / 2;
            destY = slot.y;
          }
          ctx.drawImage(photoImg, destX, destY, destWidth, destHeight);
        } else {
          // Fill: stretch to fill slot (not recommended)
          ctx.drawImage(photoImg, destX, destY, destWidth, destHeight);
        }

        ctx.restore();
        checkComplete();
      };
      
      photoImg.onerror = (error) => {
        clearTimeout(imageTimeout);
        console.error(`Failed to load photo for slot ${slot.name}:`, error);
        checkComplete();
      };
      
      photoImg.src = photo.dataUrl;
    });

    // Draw foreground
    if (template.foregroundDataUrl) {
      const fgImg = new Image();
      fgImg.onload = () => {
        ctx.drawImage(fgImg, 0, 0, template.width, template.height);
        checkComplete();
      };
      fgImg.onerror = () => reject(new Error('Failed to load foreground'));
      fgImg.src = template.foregroundDataUrl;
    }
  });
};

export const resizeImage = (
  dataUrl: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};
