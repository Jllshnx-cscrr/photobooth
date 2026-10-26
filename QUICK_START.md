# Quick Start Guide - Test the Timelapse Feature

Want to test the new recording feature immediately? Follow these 5 simple steps!

---

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `@vercel/blob` - Cloud storage
- `@supabase/supabase-js` - Database
- `qrcode` - QR code generation
- `jszip` - File compression

### 2. Create Supabase Project (Free)

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - Name: `photobooth-test`
   - Password: itsphotobooth12345
   - Region: (pick closest to you)
4. Wait 2 minutes for setup

### 3. Run SQL Schema

1. In Supabase, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Copy EVERYTHING from `supabase-schema.sql`
4. Paste and click **"Run"** (or Ctrl/Cmd + Enter)
5. You should see ✅ success messages

### 4. Get Your Credentials

1. In Supabase, click **Settings** → **API**
2. Copy these two values:

```
Project URL: https://jqrtwzkehwdkavlzjhxb.supabase.co/rest/v1/
anon public key: sb_publishable_zylhYuccbALyiybhVcO82g_DW2_MF9t
```

### 5. Create .env File

In your project root, create `.env` file:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx...
VITE_SESSION_EXPIRY_DAYS=30
```

**Replace** `xxxxx` with your actual values from Step 4!

---

## 🧪 Test It!

### Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Follow the Flow

1. ✅ Click **"Start"** on welcome screen
2. ✅ A **consent dialog** appears → Click **"Yes, Record!"**
3. ✅ Grant **camera permission** when asked
4. ✅ Red **"REC"** indicator appears in top-right
5. ✅ Take photos as normal (countdown happens automatically)
6. ✅ After last photo, recording **stops automatically**
7. ✅ Final preview shows **upload progress**
8. ✅ **QR code** appears when upload completes!

### What You Should See

**During Capture:**
```
┌─────────────────────────────────┐
│ Photo Capture          🔴 REC   │
│ Timer: 5s | Photo 1 of 4  0:15  │
└─────────────────────────────────┘
```

**On Final Preview:**
```
┌─────────────────────────────────┐
│  Uploading to cloud storage...  │
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 60%      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   Scan to Relive Your Moments!  │
│   ┌───────────────────┐         │
│   │  ▀▄ █▀█ ▄▀ ▀▄ ▄  │         │
│   │  ▄▀ ▄█▄ ▀█ █▀ ▄  │         │
│   └───────────────────┘         │
│   [Copy Link] [Download QR]     │
└─────────────────────────────────┘
```

---

## 📱 Test the QR Code

### Option 1: Use Your Phone
1. Open camera app on your phone
2. Point at the QR code on screen
3. Tap the notification that appears
4. Session should open in browser!

### Option 2: Copy Link
1. Click **"Copy Link"** button
2. Send to your phone via text/email
3. Open link on phone
4. You'll see your video and photos!

---

## 🎯 What's Happening Behind the Scenes?

When you complete a session:

1. **Recording Blob** → Converted to Base64
2. **Photos** → Converted to Base64
3. **Upload to Serverless API** → `/api/upload-session`
4. **Server uploads to Vercel Blob** → Files stored in cloud
5. **Server saves to Supabase** → Metadata saved
6. **QR Code Generated** → Links to `/session/:id`
7. **User scans** → Opens session view page
8. **Video & photos load** → From Vercel Blob URLs

---

## ⚠️ Common Issues

### "Recording Not Supported"
**Fix**: Use Chrome, Firefox, or Safari (latest versions)

### "Camera Permission Denied"
**Fix**: 
1. Click the camera icon in browser address bar
2. Allow camera access
3. Refresh page

### "Upload Failed"
**Fix**: Check that your `.env` file has correct Supabase credentials

### "Session Not Found"
**Fix**: 
- Recording uploads happen ONLY in production on Vercel
- Locally, uploads work but you need valid Supabase setup
- Check Supabase Table Editor to see if session saved

### QR Code Not Appearing
**Fix**: 
- Make sure upload completed successfully
- Check browser console for errors
- Verify `qrcode` package installed: `npm list qrcode`

---

## 🚀 Ready for Production?

Once local testing works:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add timelapse feature"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Import your repo at [vercel.com/new](https://vercel.com/new)
   - Add environment variables
   - Deploy!

3. **Test in Production**:
   - Visit your Vercel URL
   - Complete a full session
   - Scan QR code with phone
   - Verify everything works!

---

## 📚 Next Steps

- **Read full setup**: See `SETUP_GUIDE.md`
- **Configure production**: See `DEPLOYMENT_CHECKLIST.md`
- **Customize settings**: Edit `.env` values
- **Monitor usage**: Check Vercel & Supabase dashboards

---

## 🎉 That's It!

You should now have:
- ✅ Recording working
- ✅ Upload working
- ✅ QR codes generating
- ✅ Session view page working

**Enjoy your enhanced photobooth!** 📸🎬

---

## 💬 Questions?

Check the troubleshooting section in `SETUP_GUIDE.md` or review the implementation code:

- Recording: `src/hooks/useSessionRecording.ts`
- Upload: `src/utils/uploadSession.ts`
- QR Code: `src/components/QRCodeDisplay.tsx`
- Session View: `src/pages/SessionView.tsx`
