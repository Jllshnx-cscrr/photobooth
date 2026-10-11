# Deployment Update Guide

## 🚀 How to Update Your Live Site After Making Changes

Follow these steps whenever you make changes to your code and want to see them on your deployed website.

---

## 📋 Step-by-Step Process

### **Step 1: Make Your Code Changes**
Edit any files in the `src/` folder:
- `src/custom.css` - Custom styling
- `src/components/` - Component files
- `src/utils/` - Utility functions
- etc.

✅ **Example**: You changed the primary color in `src/custom.css`

---

### **Step 2: Test Locally (Optional but Recommended)**

#### A. Install Dependencies (if you haven't already)
```bash
npm install
```

#### B. Start the Development Server
```bash
npm run dev
```

This opens a local preview (usually at `http://localhost:5173`)

#### C. Test Your Changes
- Open the local URL in your browser
- Test all features to make sure nothing broke
- Check that your changes look correct

#### D. Stop the Dev Server
Press `Ctrl + C` in the terminal

---

### **Step 3: Build for Production**
This creates the optimized files for deployment:

```bash
npm run build
```

✅ **What happens**: 
- Creates/updates the `dist/` folder
- Bundles all your code into optimized files
- Compresses images and assets
- New CSS file created (e.g., `index-ABC123.css`)

⚠️ **If you get errors**: Read the error messages and fix any issues in your code, then run `npm run build` again.

---

### **Step 4: Commit Your Changes to Git**

#### A. Check What Changed
```bash
git status
```

#### B. Add Your Changes
```bash
git add .
```

Or add specific files:
```bash
git add src/custom.css
git add src/components/WelcomeScreen.tsx
```

#### C. Commit with a Message
```bash
git commit -m "Updated primary colors and welcome screen styling"
```

Use descriptive messages like:
- `"Added PDF download feature"`
- `"Fixed photo stretching issue"`
- `"Changed button colors to red"`

---

### **Step 5: Push to GitHub**
```bash
git push
```

Or if it's your first push on a new branch:
```bash
git push -u origin main
```

✅ **What happens**: Your code is uploaded to GitHub

---

### **Step 6: Vercel Auto-Deploys (Automatic!)**

If you deployed with Vercel (recommended), it will:
1. **Detect your push** to GitHub automatically
2. **Start building** your project
3. **Deploy the new version** (takes 1-2 minutes)
4. **Update your live site** automatically

#### Check Deployment Status:
1. Go to https://vercel.com/dashboard
2. Find your project
3. See the deployment status (Building → Ready)

---

### **Step 7: Verify Changes on Live Site**

#### A. Open Your Live Website
Visit your Vercel URL (e.g., `https://your-photobooth.vercel.app`)

#### B. Hard Refresh to Clear Cache
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`
- **Or**: `Ctrl + F5`

This ensures you see the latest version, not cached files.

#### C. Test Everything
- Check that your changes appear
- Test all features still work
- Try on mobile if needed

---

## 🎯 Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────┐
│ 1. Edit files in src/                      │
│ 2. npm run build                            │
│ 3. git add .                                │
│ 4. git commit -m "Description of changes"   │
│ 5. git push                                 │
│ 6. Wait 1-2 minutes (Vercel auto-deploys)   │
│ 7. Hard refresh your site (Ctrl+Shift+R)    │
└─────────────────────────────────────────────┘
```

---

## 🔄 Different Deployment Methods

### Method 1: Vercel (Automatic - Recommended)
```bash
# After making changes:
npm run build
git add .
git commit -m "Updated styling"
git push

# Vercel deploys automatically in 1-2 minutes
# Just refresh your site!
```

✅ **Best for**: Continuous updates, team projects
✅ **Pros**: Automatic, fast, easy
❌ **Cons**: Requires GitHub

---

### Method 2: InfinityFree (Manual Upload)
```bash
# After making changes:
npm run build

# Then:
# 1. Open your FTP client (FileZilla, etc.)
# 2. Connect to your InfinityFree hosting
# 3. Navigate to htdocs/ or public_html/
# 4. DELETE old files from dist/ folder
# 5. UPLOAD new contents of dist/ folder
# 6. Wait for upload to complete
# 7. Refresh your site
```

✅ **Best for**: One-time uploads, simple projects
❌ **Cons**: Manual, slower, more steps

---

### Method 3: Other Hosting (Netlify, GitHub Pages, etc.)

#### Netlify (Similar to Vercel):
```bash
npm run build
git add .
git commit -m "Updated code"
git push

# Netlify auto-deploys from GitHub
```

#### GitHub Pages:
```bash
npm run build
npm run deploy

# If you set up gh-pages branch
```

---

## 🛠️ Troubleshooting

### Changes Don't Appear on Live Site

#### Problem: Browser Cached Old Version
**Solution**: Hard refresh
- `Ctrl + Shift + R` (Windows/Linux)
- `Cmd + Shift + R` (Mac)

#### Problem: Forgot to Build
**Solution**: 
```bash
npm run build
git add .
git commit -m "Rebuild with changes"
git push
```

#### Problem: Vercel Still Deploying
**Solution**: Wait 1-2 minutes and check Vercel dashboard

#### Problem: Git Push Failed
**Solution**:
```bash
# Pull latest changes first
git pull

# Then push again
git push
```

#### Problem: Build Errors
**Solution**: 
1. Read the error message carefully
2. Fix the issues in your code
3. Run `npm run build` again
4. Commit and push when successful

---

## 📊 Deployment Timeline

```
You make changes → 0 minutes
Run npm run build → +30 seconds
Git commit & push → +10 seconds
Vercel detects push → +5 seconds
Vercel builds project → +1-2 minutes
Site goes live → +5 seconds
────────────────────────────────────
Total time: ~2-3 minutes
```

---

## ✅ Best Practices

### 1. Always Build Before Pushing
```bash
npm run build  # Make sure it builds successfully
git add .
git commit -m "..."
git push
```

### 2. Test Locally First
```bash
npm run dev  # Test changes locally
# Fix any issues
npm run build
# Then push
```

### 3. Use Descriptive Commit Messages
❌ Bad: `"fixed stuff"`
✅ Good: `"Fixed photo stretching in template designer"`

### 4. Check Vercel Dashboard
- Monitor deployment status
- Check for build errors
- View deployment logs

### 5. Keep dist/ Folder
- Don't delete `dist/` folder from your project
- Git can ignore it (`.gitignore`) since Vercel builds it
- But keeping it helps with local testing

---

## 🎓 Understanding the Process

### Why These Steps?

**1. Edit src/ files** → Your source code
**2. npm run build** → Converts source to optimized production files
**3. git commit** → Saves your changes to version control
**4. git push** → Uploads to GitHub
**5. Vercel** → Detects changes, rebuilds, deploys automatically
**6. Hard refresh** → Clears browser cache to see new version

### What is the dist/ Folder?

- **Optimized version** of your code for production
- **Smaller file sizes** (minified, compressed)
- **Browser-compatible** (transpiled modern code)
- **Auto-generated** by `npm run build`
- **This is what gets deployed** to your live site

---

## 📞 Common Scenarios

### Scenario 1: Changed CSS Colors
```bash
# Edit src/custom.css
npm run build
git add src/custom.css
git commit -m "Changed primary color to red"
git push
# Wait 2 minutes, refresh site with Ctrl+Shift+R
```

### Scenario 2: Fixed a Bug
```bash
# Fix bug in src/components/CameraCapture.tsx
npm run dev  # Test the fix locally
npm run build
git add .
git commit -m "Fixed camera countdown bug"
git push
# Wait for Vercel deployment
```

### Scenario 3: Added New Feature
```bash
# Add feature across multiple files
npm run dev  # Test thoroughly
npm run build  # Make sure it builds
git add .
git commit -m "Added dual photo strip feature"
git push
# Monitor Vercel dashboard for deployment
```

---

## 🚨 Important Notes

1. **NEVER edit files in `dist/` directly** - they get overwritten on build
2. **ALWAYS commit after successful build** - ensures working code is saved
3. **Hard refresh after deployment** - browser caching is aggressive
4. **Check Vercel logs if issues** - helps debug deployment problems
5. **Test before pushing** - saves time and prevents broken deployments

---

## 📚 Related Guides

- `VERCEL_DEPLOYMENT.md` - Initial Vercel setup
- `CSS_CUSTOMIZATION_GUIDE.md` - How to customize styles
- `DEPLOYMENT_FILES.md` - What files to deploy
- `GET_STARTED.md` - Running the project locally

---

**That's it!** Follow these steps every time you make changes and want to update your live site. The process becomes quick and automatic with practice! 🎉
