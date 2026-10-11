# Background Image Troubleshooting

## ✅ Your Issue is Fixed!

I found the problem - the `welcome-screen` class wasn't added to the component.

### What I Fixed:
Changed line 18 in `WelcomeScreen.tsx` from:
```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-8">
```

To:
```tsx
<div className="min-h-screen welcome-screen flex items-center justify-center p-8">
```

---

## 🔍 Complete Checklist (Verify These)

### ✓ 1. Image File Exists
**Check**: `public/backgrounds/welcome-bg.jpg`
**Status**: ✅ Confirmed - File exists

### ✓ 2. CSS is Correct
**Check**: `src/custom.css` has `.welcome-screen` CSS
**Status**: ✅ Confirmed - CSS exists (lines 91-110)

### ✓ 3. Class Added to Component
**Check**: `WelcomeScreen.tsx` has `welcome-screen` class
**Status**: ✅ Fixed - Class added

### ✓ 4. Build the Project
**Action**: Run this command:
```bash
npm run build
```
**Why**: CSS and images need to be compiled into the `dist` folder

### ✓ 5. Clear Browser Cache
**Action**: Hard refresh your browser
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

---

## 🚀 Next Steps

### 1. Build the Project
```bash
npm run build
```

### 2. Test Locally
Open: `dist/index.html` in your browser

### 3. If Still Not Working, Check:

#### A. Open Browser Console (F12)
Look for errors like:
- `404 Not Found: /backgrounds/welcome-bg.jpg`
- `Failed to load resource`

#### B. Verify Image Path
The CSS uses: `/backgrounds/welcome-bg.jpg`
- Must start with `/`
- Case-sensitive (welcome-bg.jpg ≠ Welcome-Bg.jpg)
- No spaces in filename

#### C. Check Image Format
- Supported: JPG, PNG, WebP
- Not supported: BMP, TIFF

#### D. Image Size
- If over 5MB, may load slowly
- Compress at: tinypng.com

---

## 🔄 If You're Using Vercel

After building, push to GitHub:
```bash
git add .
git commit -m "Added welcome screen background image"
git push
```

Vercel will:
1. Detect the push
2. Run `npm run build` automatically
3. Deploy the new version (1-2 minutes)

**Important**: Make sure `public/backgrounds/` folder is committed to Git!

---

## 🎨 Current CSS Configuration

Your `src/custom.css` has:

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

This will:
- Show your background image
- Add a 40% dark overlay for better text visibility
- Keep all text and buttons visible

---

## 💡 Adjust the Overlay Darkness

If the image is too dark or too light:

**Make it Lighter** (less overlay):
```css
background: rgba(0, 0, 0, 0.2); /* Change 0.4 to 0.2 */
```

**Make it Darker** (more overlay):
```css
background: rgba(0, 0, 0, 0.6); /* Change 0.4 to 0.6 */
```

**Remove Overlay Completely**:
Delete the `.welcome-screen::before` section (lines 100-110 in custom.css)

---

## 🧪 Test If It's Working

After running `npm run build`, check:

1. **Open**: `dist/index.html`
2. **Right-click background** → Inspect Element
3. **Look for**: `background-image: url("/backgrounds/welcome-bg.jpg")`
4. **If you see it**: CSS is applied ✅
5. **Click the URL**: Should load the image

---

## ⚠️ Common Mistakes

| Issue | Wrong | Right |
|-------|-------|-------|
| Path | `url('backgrounds/image.jpg')` | `url('/backgrounds/image.jpg')` |
| Path | `url('./backgrounds/image.jpg')` | `url('/backgrounds/image.jpg')` |
| Class | `className="welcome"` | `className="welcome-screen"` |
| Build | Edited CSS but didn't build | Run `npm run build` |
| Cache | Old version in browser | Hard refresh: Ctrl+Shift+R |

---

## 📸 Expected Result

After fixing, you should see:
- ✅ Your custom image as background
- ✅ Semi-transparent dark overlay
- ✅ White text clearly visible
- ✅ Timer buttons readable
- ✅ "START PHOTO SESSION" button visible

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Verify File Path**:
```bash
# Check if file exists
dir public\backgrounds\welcome-bg.jpg
```

2. **Check Build Output**:
```bash
# Look for backgrounds folder in dist
dir dist\backgrounds
```

3. **Test With Simple Color**:
Replace in `custom.css`:
```css
.welcome-screen {
  background-color: red; /* Test with solid color first */
}
```
If red shows up, CSS is working - issue is with image path.

4. **Check Browser Console**:
- Press F12
- Click "Console" tab
- Look for errors about image not loading

---

## ✅ Final Checklist

Run through these in order:

- [ ] Image exists: `public/backgrounds/welcome-bg.jpg`
- [ ] CSS added to: `src/custom.css`
- [ ] Class added to: `WelcomeScreen.tsx` (line 18)
- [ ] Run: `npm run build`
- [ ] Open: `dist/index.html`
- [ ] Hard refresh: `Ctrl + Shift + R`
- [ ] Check F12 console for errors

---

**If you followed all steps above, your background should be working!** 🎉

If still having issues, let me know and provide:
1. Browser console errors (F12)
2. Screenshot of the welcome screen
3. Confirmation you ran `npm run build`
