# Background Images - Quick Summary

## 🚀 Fastest Method (3 Steps)

### 1. Add Your Image
```
Save to: public/backgrounds/welcome-bg.jpg
```

### 2. Add CSS to `src/custom.css`
```css
.welcome-screen {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('/backgrounds/welcome-bg.jpg');
  background-size: cover;
  background-position: center;
}
```

### 3. Edit Component
Open `src/components/WelcomeScreen.tsx`

Find:
```tsx
className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8"
```

Change to:
```tsx
className="min-h-screen welcome-screen flex items-center justify-center p-8"
```

**Then build**: `npm run build`

---

## 📁 File Locations

| What | Where |
|------|-------|
| Images go here | `public/backgrounds/` |
| CSS goes here | `src/custom.css` |
| Edit Welcome | `src/components/WelcomeScreen.tsx` |
| Edit Preview | `src/components/FinalPreview.tsx` |

---

## 💡 Common Use Cases

### Welcome Screen Background
**CSS**: Add class `.welcome-screen`  
**Component**: `WelcomeScreen.tsx`

### Final Preview Background
**CSS**: Add class `.final-preview-bg`  
**Component**: `FinalPreview.tsx`

### Camera Screen Background
**CSS**: Target `.min-h-screen.bg-gray-900`  
**Component**: `CameraCapture.tsx`

---

## 🎨 Popular Effects

### Dark Overlay (Recommended)
```css
background-image: 
  linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
  url('/backgrounds/image.jpg');
```

### Light Overlay
```css
background-image: 
  linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)),
  url('/backgrounds/image.jpg');
```

### Gradient Overlay
```css
background-image: 
  linear-gradient(rgba(138, 92, 246, 0.6), rgba(236, 72, 153, 0.6)),
  url('/backgrounds/image.jpg');
```

### No Overlay
```css
background-image: url('/backgrounds/image.jpg');
background-size: cover;
background-position: center;
```

---

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Image not showing | Check path starts with `/` |
| Text hard to read | Add dark overlay (see above) |
| Image too big/small | Use `background-size: cover` |
| Wrong position | Use `background-position: center` |
| Slow loading | Compress image (under 500KB) |

---

## 📖 Full Documentation

- **`QUICK_ADD_BACKGROUND.txt`** - Step-by-step visual guide
- **`BACKGROUND_IMAGE_GUIDE.md`** - Complete documentation
- **`BACKGROUND_EXAMPLES.css`** - 15+ ready-to-use examples
- **`public/backgrounds/README.md`** - Image requirements

---

## ✅ Checklist

- [ ] Image saved in `public/backgrounds/`
- [ ] CSS added to `src/custom.css`
- [ ] Class added to component
- [ ] Ran `npm run build`
- [ ] Tested in browser
- [ ] Text is readable
- [ ] Image looks good on mobile

---

**That's it!** 🎉
