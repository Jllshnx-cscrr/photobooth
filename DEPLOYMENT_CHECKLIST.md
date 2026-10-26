# Deployment Checklist - Photobooth Timelapse Feature

Use this checklist to ensure proper setup and deployment of the new features.

---

## 📋 Pre-Deployment Checklist

### 1. Code & Dependencies

- [x] All new dependencies installed (`@vercel/blob`, `@supabase/supabase-js`, `qrcode`, `jszip`)
- [x] TypeScript compilation successful (`npm run build`)
- [x] No console errors in development (`npm run dev`)
- [ ] Git repository is up to date
- [ ] All changes committed

```bash
# Verify dependencies
npm list @vercel/blob @supabase/supabase-js qrcode jszip

# Test build
npm run build

# Commit changes
git add .
git commit -m "Add timelapse recording and QR code features"
```

---

## 🗄️ Supabase Setup

### Step 1: Create Project

- [ ] Signed up at [supabase.com](https://supabase.com)
- [ ] Created new project
- [ ] Project fully initialized (wait ~2 minutes)
- [ ] Noted project name: `___________________________`

### Step 2: Run SQL Schema

- [ ] Opened SQL Editor in Supabase dashboard
- [ ] Copied contents from `supabase-schema.sql`
- [ ] Ran SQL successfully
- [ ] Verified table created (should see success messages)
- [ ] Checked table in Table Editor

### Step 3: Get Credentials

- [ ] Navigated to Settings → API
- [ ] Copied **Project URL**: `___________________________`
- [ ] Copied **anon public** key: `___________________________`
- [ ] Copied **service_role** key (keep secret!): `___________________________`

**⚠️ Important**: Never commit service_role key to Git!

---

## ☁️ Vercel Setup

### Step 1: Initial Deployment

- [ ] Signed up at [vercel.com](https://vercel.com)
- [ ] Connected GitHub repository
- [ ] Imported project
- [ ] Selected correct framework preset (Vite)
- [ ] Build command set to `npm run build`
- [ ] Output directory set to `dist`

### Step 2: Vercel Blob Storage

- [ ] Clicked "Storage" tab in project dashboard
- [ ] Created Blob storage
- [ ] Named it (e.g., "photobooth-storage")
- [ ] Verified `BLOB_READ_WRITE_TOKEN` added automatically

### Step 3: Environment Variables

- [ ] Opened Settings → Environment Variables
- [ ] Added the following:

| Variable Name | Value | Source |
|--------------|-------|---------|
| `VITE_SUPABASE_URL` | Your Project URL | Supabase Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Your anon key | Supabase Settings → API |
| `SUPABASE_SERVICE_KEY` | Your service_role key | Supabase Settings → API |
| `VITE_SESSION_EXPIRY_DAYS` | `30` | Manual entry |
| `VITE_MAX_RECORDING_SIZE_MB` | `50` | Manual entry |

**Applied to**: ✅ Production, ✅ Preview, ✅ Development

---

## 🧪 Local Testing

### Step 1: Environment Setup

- [ ] Created `.env` file in project root
- [ ] Added all environment variables
- [ ] Verified `.env` is in `.gitignore`
- [ ] Never committed `.env` to Git

### Step 2: Test Features

```bash
npm run dev
```

- [ ] App loads at http://localhost:3000
- [ ] No console errors on load
- [ ] Camera permission works
- [ ] Consent dialog appears
- [ ] Recording indicator shows
- [ ] Photos capture successfully
- [ ] Recording stops automatically
- [ ] Upload progress displays
- [ ] QR code generates
- [ ] Can copy link
- [ ] Can download QR code

---

## 🚀 Production Deployment

### Step 1: Push to GitHub

```bash
# Verify changes
git status

# Add all files
git add .

# Commit with descriptive message
git commit -m "Add timelapse recording, QR codes, and cloud storage"

# Push to main branch
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Vercel deployment triggered automatically
- [ ] Build succeeded (check Vercel dashboard)
- [ ] No build errors

### Step 2: Verify Deployment

- [ ] Visited production URL
- [ ] Site loads correctly
- [ ] No console errors
- [ ] API routes responding (`/api/upload-session`)

---

## ✅ Production Testing

### Test 1: Complete Session Flow

- [ ] Started new photobooth session
- [ ] Accepted recording consent
- [ ] Verified REC indicator appears
- [ ] Took all photos successfully
- [ ] Recording stopped automatically
- [ ] Upload progress showed correctly
- [ ] QR code generated
- [ ] Copied link successfully

### Test 2: QR Code & Mobile View

- [ ] Scanned QR code with mobile device
- [ ] Session page loaded on mobile
- [ ] Video player works
- [ ] Video plays correctly
- [ ] Photo strip displays
- [ ] Download buttons work
- [ ] Mobile layout looks good

### Test 3: Edge Cases

- [ ] Declined recording consent (photos still work)
- [ ] Started new session after previous
- [ ] Tested on different browsers (Chrome, Firefox, Safari)
- [ ] Tested expired session link (should show error)
- [ ] Tested invalid session ID (should show 404)

---

## 🔍 Post-Deployment Verification

### Supabase Database

- [ ] Opened Table Editor in Supabase
- [ ] Found `sessions` table
- [ ] Verified test sessions saved
- [ ] Checked all columns populated correctly
- [ ] URLs are accessible

### Vercel Blob Storage

- [ ] Opened Storage tab in Vercel
- [ ] Verified files uploaded
- [ ] Checked file sizes reasonable
- [ ] Storage usage within limits

### Logs & Monitoring

- [ ] Checked Vercel function logs (Functions → Logs)
- [ ] No error messages in logs
- [ ] Response times acceptable (< 5 seconds)
- [ ] Supabase logs show successful queries

---

## 📊 Performance Checks

- [ ] Initial page load < 3 seconds
- [ ] Upload completes within 30 seconds
- [ ] QR code generates instantly
- [ ] Session view loads quickly
- [ ] Video playback smooth
- [ ] No memory leaks in browser

---

## 🔐 Security Verification

- [ ] `.env` file NOT in Git repository
- [ ] `SUPABASE_SERVICE_KEY` only in Vercel environment variables
- [ ] Session IDs are unpredictable (not sequential)
- [ ] Row Level Security enabled in Supabase
- [ ] API routes protected (no public access to service keys)
- [ ] HTTPS enforced on all requests

---

## 📱 Browser Compatibility

Tested and working on:

- [ ] Chrome (Desktop)
- [ ] Chrome (Mobile)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop)
- [ ] Safari (iOS)
- [ ] Edge (Desktop)

Known issues:
- [ ] Internet Explorer not supported (expected)

---

## 🎯 Feature Verification

### Recording Feature
- [x] MediaRecorder API integrated
- [x] Consent dialog functional
- [x] Recording indicator visible
- [x] Uses existing camera stream
- [x] Stops automatically after last photo
- [x] Blob saved to session context

### Upload Feature
- [x] Files upload to Vercel Blob
- [x] Metadata saves to Supabase
- [x] Progress bar shows stages
- [x] Error handling works
- [x] Retry mechanism available

### QR Code Feature
- [x] QR code generates correctly
- [x] Links to unique session URL
- [x] Download as PNG works
- [x] Copy link works
- [x] QR code scannable

### Session View
- [x] Route `/session/:sessionId` works
- [x] Video player functional
- [x] Photo strip displays
- [x] Download buttons work
- [x] Expiration date shows
- [x] 404 page for invalid sessions

---

## 💾 Backup & Recovery

- [ ] Documented Supabase credentials (secure location)
- [ ] Saved Vercel project settings
- [ ] Backed up `.env.example` file
- [ ] Git repository has remote backup
- [ ] Noted storage limits and usage

---

## 📞 Support Contacts

| Service | Dashboard | Support |
|---------|-----------|---------|
| Vercel | [vercel.com/dashboard](https://vercel.com/dashboard) | [vercel.com/support](https://vercel.com/support) |
| Supabase | [app.supabase.com](https://app.supabase.com) | [supabase.com/support](https://supabase.com/support) |

---

## ✨ Post-Launch Tasks

### Week 1
- [ ] Monitor Vercel storage usage daily
- [ ] Check Supabase database size
- [ ] Review function execution logs
- [ ] Gather user feedback
- [ ] Fix any reported issues

### Month 1
- [ ] Review storage costs
- [ ] Analyze session completion rates
- [ ] Check average recording sizes
- [ ] Consider implementing session history feature
- [ ] Optimize video compression if needed

### Ongoing
- [ ] Monthly storage audit
- [ ] Quarterly security review
- [ ] Update dependencies regularly
- [ ] Monitor for Vercel/Supabase service updates

---

## 🎉 Launch Ready!

Once all checkboxes are complete:

✅ **You're ready to launch!**

Your photobooth now has:
- Automatic session recording
- Cloud storage with Vercel Blob & Supabase
- QR codes for easy mobile access
- Beautiful session viewing experience
- Privacy-conscious consent system
- Automatic cleanup and expiration

**Share your photobooth URL and start creating memories!**

---

## 🆘 Need Help?

1. **Check logs**: Vercel Functions → Logs
2. **Review setup**: Read `SETUP_GUIDE.md`
3. **Troubleshooting**: See `SETUP_GUIDE.md` → Troubleshooting section
4. **Database issues**: Check Supabase → Table Editor & Logs Explorer
5. **Storage issues**: Verify Vercel → Storage tab

---

## 📝 Notes

_Use this space for deployment-specific notes:_

```
Date deployed: _______________
Deployed by: _______________
Vercel URL: _______________
Supabase Project: _______________
Notes:


```
