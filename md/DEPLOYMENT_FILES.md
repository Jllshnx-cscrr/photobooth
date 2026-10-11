# 📤 Deployment Files Guide

## What to Upload to InfinityFree (or any host)

### ✅ ONLY Upload These Files (from the `dist` folder):

After running `npm run build`, upload **ONLY** the contents of the `dist/` folder:

```
dist/
├── index.html           ✅ Upload this
├── assets/              ✅ Upload entire folder
│   ├── index-[hash].js  (JavaScript)
│   ├── index-[hash].css (Styles)
│   └── ...other assets
├── camera.svg           ✅ Upload this
└── .htaccess           ✅ Create/upload this (see below)
```

**That's it!** Just 2-3 items from the dist folder.

---

## ❌ DO NOT Upload These Files

### Development Files (Don't Upload)
```
❌ node_modules/        (10,000+ files - DON'T upload!)
❌ src/                 (Source code - not needed)
❌ public/              (Raw files - already in dist)
❌ .git/                (Version control - not needed)
❌ .vscode/             (Editor settings - not needed)
```

### Configuration Files (Don't Upload)
```
❌ package.json
❌ package-lock.json
❌ tsconfig.json
❌ tsconfig.node.json
❌ vite.config.ts
❌ tailwind.config.js
❌ postcss.config.js
❌ .gitignore
❌ .env
❌ .env.example
```

### Documentation Files (Don't Upload)
```
❌ README.md
❌ QUICK_START.md
❌ GET_STARTED.md
❌ IMPLEMENTATION_NOTES.md
❌ PROJECT_SUMMARY.md
❌ CHANGELOG.md
❌ COMMANDS.md
❌ DOCUMENTATION_INDEX.md
❌ PRINT_SIZES_GUIDE.md
❌ DUAL_STRIP_GUIDE.md
❌ PDF_DOWNLOAD_GUIDE.md
❌ START_HERE.md
❌ BANNER.txt
❌ All other .md and .txt files
```

---

## 📋 Step-by-Step Upload Process

### Step 1: Build the Project
```bash
# In your project folder
cd C:\xampp\htdocs\Photobooth
npm install
npm run build
```

This creates the `dist` folder.

### Step 2: Locate the dist Folder
```
C:\xampp\htdocs\Photobooth\dist\
```

### Step 3: Upload ONLY dist Contents

**Option A: Via InfinityFree File Manager**
1. Login to InfinityFree control panel
2. Open File Manager
3. Go to `htdocs` folder
4. **Upload only these from dist folder:**
   - `index.html`
   - `assets/` folder (entire folder)
   - `camera.svg`

**Option B: Via FTP (FileZilla)**
1. Connect to your InfinityFree FTP
2. Navigate to `htdocs/` or `public_html/`
3. Upload the contents of the `dist/` folder
4. DO NOT upload the `dist` folder itself, just its contents

### Step 4: Create .htaccess File
In the same folder as index.html, create `.htaccess`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📊 File Size Reference

### What You're Uploading:
- `index.html`: ~1-2 KB
- `assets/` folder: ~500KB-1MB
- `camera.svg`: ~1-2 KB
- **Total: Less than 2 MB** ✅

### What You're NOT Uploading:
- `node_modules/`: ~200-300 MB ❌
- `src/`: ~500 KB ❌
- Documentation: ~100 KB ❌
- **Saved: 300+ MB of unnecessary files!**

---

## 🎯 Quick Reference

### Before Upload Checklist:
- [ ] Ran `npm run build`
- [ ] Found the `dist/` folder
- [ ] Confirmed `index.html` is in dist/
- [ ] Confirmed `assets/` folder is in dist/

### What to Upload:
- [ ] `dist/index.html` → `htdocs/index.html`
- [ ] `dist/assets/` → `htdocs/assets/`
- [ ] `dist/camera.svg` → `htdocs/camera.svg`
- [ ] Created `.htaccess` file

### What NOT to Upload:
- [ ] ❌ node_modules folder
- [ ] ❌ src folder
- [ ] ❌ package.json
- [ ] ❌ Any .md files
- [ ] ❌ Configuration files

---

## 💡 Why Only These Files?

### The dist Folder is Self-Contained:
- ✅ All React code compiled into JavaScript
- ✅ All TypeScript converted to JavaScript
- ✅ All styles bundled into CSS
- ✅ All images included
- ✅ Everything optimized and minified

### The Other Files Are for Development:
- `node_modules/` - Development dependencies (not needed)
- `src/` - Source code (already compiled into dist)
- `*.json` - Build configuration (not needed)
- `*.md` - Documentation (not needed)

---

## 🚀 Example Upload Structure

### Your Computer:
```
C:\xampp\htdocs\Photobooth\
├── dist/                    ← THIS is what you upload
│   ├── index.html
│   ├── assets/
│   └── camera.svg
├── node_modules/            ← DON'T upload
├── src/                     ← DON'T upload
└── package.json             ← DON'T upload
```

### InfinityFree Server (after upload):
```
htdocs/
├── index.html              ← From dist/index.html
├── assets/                 ← From dist/assets/
│   ├── index-abc123.js
│   ├── index-abc123.css
│   └── ...
├── camera.svg              ← From dist/camera.svg
└── .htaccess              ← Create manually
```

---

## 🔍 Troubleshooting

### "I don't see a dist folder"
**Solution:** Run `npm run build` first

### "Upload is too slow"
**Reason:** You're uploading wrong files
**Solution:** Upload ONLY from `dist/` folder

### "Website shows blank page"
**Check:** 
- Did you upload `index.html`?
- Did you upload the `assets/` folder?
- Is `.htaccess` configured?
- Are you using HTTPS?

### "Assets not loading"
**Check:**
- Assets folder structure matches
- File paths are correct
- No extra folders (don't upload `dist/` folder itself)

---

## 📦 Quick Commands

### Build and Preview:
```bash
# Build
npm run build

# Preview locally before upload
npm run preview

# Check dist folder
dir dist                # Windows
ls dist                 # Mac/Linux
```

### Verify Build:
```bash
# The dist folder should contain:
# - index.html
# - assets/ folder
# - camera.svg
# That's it!
```

---

## ✅ Final Checklist

Upload ONLY these 3 things from `dist/`:
1. ✅ `index.html`
2. ✅ `assets/` folder (with all its contents)
3. ✅ `camera.svg`

Plus create:
4. ✅ `.htaccess` file (manually)

**Total upload: Less than 2 MB**
**Total time: 1-5 minutes**

That's it! Your photo booth is deployed! 🎉
