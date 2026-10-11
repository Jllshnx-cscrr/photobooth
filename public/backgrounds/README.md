# Background Images Folder

## 📁 Purpose
Place your custom background images here to use them in your photo booth.

---

## 🖼️ How to Add Images

### Step 1: Add Your Images Here
Save your images in this folder:
```
public/backgrounds/
├── welcome-bg.jpg       (Welcome screen background)
├── preview-bg.jpg       (Final preview background)
├── camera-bg.jpg        (Camera screen background)
└── README.md           (This file)
```

### Step 2: Reference in CSS
Use them in `src/custom.css`:
```css
.welcome-screen {
  background-image: url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

---

## ✅ Image Requirements

### Recommended Specs:
- **Resolution**: 1920x1080 or higher
- **Format**: JPG, PNG, or WebP
- **File Size**: Under 2MB (compressed)
- **Aspect Ratio**: 16:9 preferred

### Optimization Tools:
- https://tinypng.com - Compress images
- https://squoosh.app - Advanced compression
- https://convertio.co - Convert formats

---

## 🎨 Free Image Resources

### Download Free Backgrounds:
- **Unsplash**: https://unsplash.com
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

### Search Terms to Try:
- "photo booth backdrop"
- "party celebration"
- "colorful abstract"
- "bokeh lights"
- "confetti background"

---

## 📝 Quick Start Example

1. **Download an image** from Unsplash
2. **Rename it** to `welcome-bg.jpg`
3. **Save it** in this folder
4. **Add to CSS** (`src/custom.css`):
   ```css
   .welcome-screen {
     background-image: url('/backgrounds/welcome-bg.jpg');
     background-size: cover;
     background-position: center;
   }
   ```
5. **Build**: `npm run build`
6. **Test**: Open your site

---

## 🚨 Important Notes

- Images in this folder will be **copied to dist/** when you build
- Use `/backgrounds/image.jpg` path (starts with /)
- Don't forget to **rebuild** after adding images: `npm run build`
- Compress large images to improve loading speed

---

**See BACKGROUND_IMAGE_GUIDE.md for complete instructions!**
