# Background Image Guide

## 🖼️ How to Add Background Images to Your Photo Booth

This guide shows you **multiple ways** to add custom background images to any screen in your photo booth.

---

## 📁 Step 1: Prepare Your Images

### Where to Put Images

**Option A: Public Folder (Recommended)**
```
Photobooth/
├── public/
│   ├── backgrounds/
│   │   ├── welcome-bg.jpg
│   │   ├── preview-bg.jpg
│   │   └── camera-bg.jpg
│   └── camera.svg
```

**Option B: src/assets Folder**
```
Photobooth/
├── src/
│   ├── assets/
│   │   ├── welcome-bg.jpg
│   │   └── preview-bg.jpg
```

### Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: 1920x1080 or larger recommended
- **File size**: Under 2MB for faster loading
- **Aspect ratio**: 16:9 works best for most screens

### Image Optimization Tips
- Use compressed images (tinypng.com or squoosh.app)
- Avoid huge file sizes (slow loading)
- Use proper dimensions (no need for 4K images)

---

## 🎨 Method 1: CSS Background (Easiest)

### Step 1: Add Your Image to Public Folder
Place your image in `public/backgrounds/welcome-bg.jpg`

### Step 2: Add CSS to `src/custom.css`

```css
/* Welcome Screen Background */
.welcome-screen {
  background-image: url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Add dark overlay for better text readability */
.welcome-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 0;
}

/* Make sure content appears above overlay */
.welcome-screen > * {
  position: relative;
  z-index: 1;
}
```

### Step 3: Build and Test
```bash
npm run build
```

---

## 🔧 Method 2: Modify Component Directly

### For Welcome Screen

**Edit `src/components/WelcomeScreen.tsx`:**

Find this line:
```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
```

**Replace with:**
```tsx
<div 
  className="min-h-screen flex items-center justify-center p-8"
  style={{
    backgroundImage: 'url(/backgrounds/welcome-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
```

### For Final Preview Screen

**Edit `src/components/FinalPreview.tsx`:**

Find this line:
```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-8">
```

**Replace with:**
```tsx
<div 
  className="min-h-screen p-8"
  style={{
    backgroundImage: 'url(/backgrounds/preview-bg.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
```

---

## 🎭 Method 3: Background with Overlay

For better text readability, add a semi-transparent overlay:

### Option A: Dark Overlay
```css
.welcome-screen {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

### Option B: Light Overlay
```css
.welcome-screen {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),
    url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

### Option C: Gradient Overlay
```css
.welcome-screen {
  background-image: 
    linear-gradient(to bottom, rgba(138, 92, 246, 0.6), rgba(236, 72, 153, 0.6)),
    url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

---

## 📱 Method 4: Responsive Backgrounds

Use different images for different screen sizes:

```css
/* Mobile background */
.welcome-screen {
  background-image: url('/backgrounds/mobile-bg.jpg');
  background-size: cover;
  background-position: center;
}

/* Tablet background */
@media (min-width: 768px) {
  .welcome-screen {
    background-image: url('/backgrounds/tablet-bg.jpg');
  }
}

/* Desktop background */
@media (min-width: 1024px) {
  .welcome-screen {
    background-image: url('/backgrounds/desktop-bg.jpg');
  }
}
```

---

## 🎯 Screen-by-Screen Examples

### 1. Welcome Screen Background

**Add to `src/custom.css`:**
```css
/* Override gradient with image */
.min-h-screen.bg-gradient-to-br.from-purple-600 {
  background: url('/backgrounds/welcome-bg.jpg') center/cover no-repeat !important;
}
```

**Or add class to WelcomeScreen.tsx:**
```tsx
<div className="min-h-screen welcome-bg-custom flex items-center justify-center p-8">
```

Then in CSS:
```css
.welcome-bg-custom {
  background: url('/backgrounds/welcome-bg.jpg') center/cover;
}
```

### 2. Camera Capture Background

**Add to `src/custom.css`:**
```css
.camera-container {
  background-image: url('/backgrounds/camera-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

### 3. Final Preview Background

**Add to `src/custom.css`:**
```css
/* Target the preview page background */
div.min-h-screen.bg-gradient-to-br.from-purple-600.via-pink-500.to-red-500 {
  background: url('/backgrounds/preview-bg.jpg') center/cover no-repeat !important;
}
```

---

## 🖼️ Advanced Techniques

### Parallax Effect
```css
.welcome-screen {
  background-image: url('/backgrounds/welcome-bg.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
}
```

### Multiple Background Images
```css
.welcome-screen {
  background-image: 
    url('/backgrounds/overlay.png'),
    url('/backgrounds/main-bg.jpg');
  background-size: contain, cover;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
}
```

### Animated Background
```css
@keyframes bg-pan {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.welcome-screen {
  background-image: url('/backgrounds/welcome-bg.jpg');
  background-size: 150%;
  animation: bg-pan 20s ease-in-out infinite;
}
```

### Blur Effect
```css
.welcome-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  filter: blur(8px);
  z-index: -1;
}
```

---

## 🎨 Complete Example: Welcome Screen with Image

**1. Add image to `public/backgrounds/party-bg.jpg`**

**2. Edit `src/custom.css`:**
```css
/* Welcome Screen Custom Background */
.welcome-custom-bg {
  background-image: 
    linear-gradient(rgba(138, 92, 246, 0.4), rgba(236, 72, 153, 0.4)),
    url('/backgrounds/party-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* Enhance text visibility */
.welcome-custom-bg h1,
.welcome-custom-bg p,
.welcome-custom-bg button {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

**3. Edit `src/components/WelcomeScreen.tsx`:**

Find:
```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
```

Change to:
```tsx
<div className="min-h-screen welcome-custom-bg flex items-center justify-center p-8">
```

**4. Build and deploy:**
```bash
npm run build
```

---

## 🚨 Troubleshooting

### Image Not Showing
**Problem**: Background is blank or shows gradient instead

**Solutions**:
1. **Check file path**: Use `/image.jpg` for public folder
2. **Check file exists**: Verify image is in correct location
3. **Use quotes**: `url('/image.jpg')` not `url(/image.jpg)`
4. **Clear cache**: Hard refresh with `Ctrl + Shift + R`
5. **Check console**: Press F12 to see 404 errors
6. **Rebuild**: Run `npm run build` again

### Image Too Large/Small
**Problem**: Image doesn't fit properly

**Solutions**:
```css
background-size: cover;  /* Fill entire area, may crop */
background-size: contain; /* Show entire image, may have gaps */
background-size: 100% 100%; /* Stretch to fit (may distort) */
```

### Image Not Centered
**Problem**: Important part of image is cut off

**Solutions**:
```css
background-position: center;        /* Center */
background-position: top;          /* Top */
background-position: bottom;       /* Bottom */
background-position: left center;  /* Left middle */
background-position: 50% 30%;      /* Custom position */
```

### Text Hard to Read
**Problem**: Text blends into background

**Solutions**:
```css
/* Add dark overlay */
background-image: 
  linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  url('/image.jpg');

/* Add text shadow */
h1, p {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Add backdrop behind text */
.text-container {
  background: rgba(0, 0, 0, 0.6);
  padding: 2rem;
  border-radius: 1rem;
}
```

### Image Loads Slowly
**Problem**: Page shows blank before image appears

**Solutions**:
1. **Optimize image**: Compress to under 500KB
2. **Use WebP format**: Better compression
3. **Add fallback color**:
```css
background-color: #8b5cf6; /* Shows while loading */
background-image: url('/image.jpg');
```
4. **Preload image** in `index.html`:
```html
<link rel="preload" as="image" href="/backgrounds/welcome-bg.jpg">
```

---

## 📊 Best Practices

### ✅ DO:
- Use optimized images (compressed)
- Add overlays for text readability
- Test on multiple screen sizes
- Use appropriate image dimensions
- Provide fallback colors
- Use WebP format when possible

### ❌ DON'T:
- Use huge file sizes (over 2MB)
- Forget to test text visibility
- Use low-resolution images (pixelated)
- Ignore mobile responsiveness
- Use distracting patterns behind text

---

## 🎁 Free Background Resources

### Where to Find Free Images:
- **Unsplash**: unsplash.com (Free, high quality)
- **Pexels**: pexels.com (Free stock photos)
- **Pixabay**: pixabay.com (Free images)
- **Freepik**: freepik.com (Free with attribution)

### Recommended Search Terms:
- "party celebration"
- "colorful abstract"
- "bokeh lights"
- "confetti background"
- "photo booth backdrop"
- "event background"

---

## 📝 Quick Reference

### Public Folder Image:
```css
background-image: url('/image.jpg');
```

### With Dark Overlay:
```css
background-image: 
  linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  url('/image.jpg');
```

### Full Setup:
```css
.my-background {
  background-image: url('/image.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
```

---

## 🚀 Deployment

After adding background images:

```bash
# 1. Build
npm run build

# 2. Commit
git add .
git commit -m "Added custom background images"

# 3. Push (if using Vercel)
git push
```

**Important**: Make sure your images are in the `public/` folder before building, as they need to be included in the `dist/` folder!

---

**Enjoy your custom background images!** 🎨✨
