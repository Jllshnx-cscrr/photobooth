# Photo Booth System

A modern, interactive web-based photo booth system built with React, TypeScript, and Tailwind CSS. Now with **session recording, timelapse generation, and QR code access!** 🎬📱

## 🎉 New Features

### Session Recording & Timelapse
- **Automatic Recording**: Records your entire photobooth session
- **Consent Dialog**: Privacy-conscious opt-in before recording
- **Timelapse Generation**: Creates a fun sped-up video of your session
- **Cloud Storage**: Securely stores videos and photos using Vercel Blob & Supabase
- **QR Code Access**: Generate unique QR codes to view sessions on mobile
- **Session View Page**: Beautiful mobile-optimized page to watch and download
- **Automatic Expiration**: Sessions automatically deleted after 30 days (configurable)

**👉 See `QUICK_START.md` for immediate testing!**
**👉 See `SETUP_GUIDE.md` for complete deployment instructions!**

---

## Features

### User Interface
- **Welcome Screen**: Attractive landing page with branding and layout previews
- **Automatic Photo Capture**: Captures 8 photos with 5-second countdown between each
- **Photo Selection**: Choose exactly 4 favorite photos from the captured set
- **Photo Editor**: Customize photos with filters, adjustments, and transformations
- **Layout Selection**: Choose from admin-created templates
- **Final Preview**: Download or print the completed photo strip

### Admin Interface
- **Template Designer**: Drag-and-drop canvas for creating photo layouts
- **Measurement Options**: Switch between pixels and inches with configurable DPI (150/300/600)
- **Upload Backgrounds**: Support for PNG, JPEG, and WebP images
- **Foreground Overlays**: Add decorative elements on top of photos
- **Photo Slot Management**: Create, position, resize, and configure photo slots
- **Template Management**: Enable/disable, set defaults, and organize templates

### Technical Features
- Automatic 8-photo capture with countdown timer
- Real-time photo editing with live preview
- Canvas-based image composition
- Local storage for templates and sessions
- Responsive design for desktop, tablet, and touchscreen
- Camera permission handling with error recovery
- High-quality image export (PNG)
- Browser-based printing support

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with camera support
- Camera device (webcam or built-in camera)
- **[NEW]** Supabase account (free tier works) - for session storage
- **[NEW]** Vercel account (free tier works) - for deployment and file storage

### Quick Start

**Want to test the new recording feature immediately?**
👉 **Follow `QUICK_START.md` for 5-minute setup!**

### Full Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Cloud Services** (Required for recording feature)
   - Follow detailed instructions in `SETUP_GUIDE.md`
   - Create Supabase project and run SQL schema
   - Configure environment variables

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Deploy to Vercel**
   - Follow `DEPLOYMENT_CHECKLIST.md` for step-by-step deployment

## Usage

### For Users

1. **Start Session**: Click "START PHOTO SESSION" on the welcome screen
2. **Recording Consent**: Choose whether to record your session (photos work either way!)
3. **Camera Capture**: Look at the camera - 8 photos will be captured automatically with 5-second countdown
4. **Select Photos**: Click on exactly 4 photos you want to use
5. **Customize**: Edit individual photos and select a layout
6. **Preview & Download**: Review the final composition and download or print
7. **Get Your QR Code**: Scan the QR code with your phone to access your session recording and photos anywhere!

### For Administrators

1. **Access Admin**: Navigate to `/admin` or click "Admin Access" on welcome screen
2. **Create Template**:
   - Click "Create New Template"
   - Set template dimensions (default: 1200x1800px for photo strip)
   - Upload background image (PNG with transparency recommended)
   - Click "+ Add Photo Slot" to create slots
   - Drag slots to position them
   - Resize slots using corner handles
   - Configure slot properties (fit mode, corner radius, etc.)
   - Optionally upload foreground overlay image
   - Save template

3. **Manage Templates**:
   - Enable/disable templates for user access
   - Set default template
   - Edit existing templates
   - Delete templates

## Project Structure

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx    # Template management
│   │   └── TemplateDesigner.tsx  # Canvas-based designer
│   ├── WelcomeScreen.tsx         # Landing page
│   ├── CameraCapture.tsx         # Auto capture with countdown + recording
│   ├── PhotoSelection.tsx        # Select 4 photos
│   ├── PhotoEditor.tsx           # Edit & customize
│   ├── FinalPreview.tsx          # Download & print + QR code
│   ├── ConsentDialog.tsx         # [NEW] Recording consent
│   ├── RecordingIndicator.tsx    # [NEW] REC badge
│   └── QRCodeDisplay.tsx         # [NEW] QR code generation
├── pages/
│   └── SessionView.tsx           # [NEW] Public session viewing
├── hooks/
│   └── useSessionRecording.ts    # [NEW] Recording logic
├── contexts/
│   ├── SessionContext.tsx        # Photo session state
│   └── TemplateContext.tsx       # Template management
├── types/
│   └── index.ts                  # TypeScript definitions
├── utils/
│   ├── storage.ts                # LocalForage wrapper
│   ├── imageProcessing.ts        # Canvas operations
│   ├── supabase.ts              # [NEW] Supabase client
│   └── uploadSession.ts          # [NEW] Upload utilities
├── App.tsx                       # Routing
├── PhotoBoothApp.tsx            # Main app component
└── main.tsx                      # Entry point

api/                               # [NEW] Vercel serverless functions
├── upload-session.ts             # Handle uploads
└── get-session.ts                # Retrieve sessions
```

## 📚 Documentation

- **`QUICK_START.md`** - Test the recording feature in 5 minutes
- **`SETUP_GUIDE.md`** - Complete setup and deployment instructions
- **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step deployment verification
- **`supabase-schema.sql`** - Database schema for Supabase
- **`PRINT_SIZES_GUIDE.md`** - Print size reference guide
- **Individual feature guides** - See `md/` directory

## Configuration

### Camera Settings
The system automatically requests camera access. To configure camera source:
- Edit `CameraCapture.tsx`
- Modify the `getUserMedia` constraints
- Set `deviceId` for specific camera selection

### Template Dimensions
Default photo strip dimensions are 1200x1800px (2:3 ratio). To change:
- Create templates with custom dimensions in admin interface
- **Use the Inches toggle** for easier measurement (e.g., 2×6", 4×6")
- Choose DPI: 150 (screen), 300 (standard print), 600 (high quality)
- See **PRINT_SIZES_GUIDE.md** for detailed size reference
- Recommended aspect ratios:
  - Photo strip: 2:3 (e.g., 2×6" at 300 DPI = 600×1800px)
  - Standard photo: 2:3 (e.g., 4×6" at 300 DPI = 1200×1800px)
  - Square: 1:1 (e.g., 4×4" at 300 DPI = 1200×1200px)
  - Landscape: 3:2 (e.g., 6×4" at 300 DPI = 1800×1200px)

### Photo Capture Count
To change from 8 photos:
- Edit `CameraCapture.tsx`
- Modify `PHOTOS_TO_CAPTURE` constant

To change from selecting 4 photos:
- Edit `PhotoSelection.tsx`
- Modify `PHOTOS_TO_SELECT` constant

## Browser Compatibility

### Desktop
- Chrome 90+ (recommended) ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Mobile
- Chrome (Android) ✅
- Safari (iOS 14.3+) ✅
- Firefox (Android) ✅

**Note**: 
- Camera access requires HTTPS in production or localhost in development
- MediaRecorder API required for recording (supported in all modern browsers)
- QR code scanning works with any camera app

## Troubleshooting

### Recording Not Working
- Check camera permissions are granted
- Verify MediaRecorder is supported (Chrome, Firefox, Safari 14.3+)
- Ensure HTTPS connection (or localhost)
- Check browser console for specific errors
- See `SETUP_GUIDE.md` troubleshooting section

### Upload Failing
- Verify Supabase credentials in environment variables
- Check Vercel Blob storage is configured
- Ensure internet connection is stable
- Review Vercel function logs for errors

### QR Code Not Appearing
- Verify upload completed successfully
- Check Supabase database has session record
- Ensure `qrcode` package is installed
- See browser console for generation errors

### Camera Not Working
- Grant camera permissions in browser
- Ensure HTTPS connection (or localhost)
- Check if camera is already in use
- Try refreshing the page

### Photos Not Appearing
- Check browser console for errors
- Verify template has valid photo slots
- Ensure images are not too large (>10MB)

### Print Quality Issues
- Use high-resolution templates (1200px+ width)
- Ensure print settings match template aspect ratio
- Use PNG background images for best quality

### Template Not Saving
- Check browser storage is not full
- Ensure background image is uploaded
- Verify at least 4 photo slots are created
- Check browser console for errors

## Performance Optimization

- Templates are stored in IndexedDB for fast access
- Images are stored as data URLs for offline capability
- Canvas operations are optimized for smooth editing
- Automatic image resizing prevents memory issues
- **[NEW]** Video recording optimized for web (2.5 Mbps bitrate)
- **[NEW]** Efficient cloud uploads with progress tracking
- **[NEW]** Lazy loading for session history

## Security Considerations

- All data stored locally in browser OR securely in cloud
- No automatic upload to external servers (opt-in only)
- Camera stream released when not in use
- **[NEW]** Session IDs are unpredictable (not sequential)
- **[NEW]** Row-level security in Supabase
- **[NEW]** API keys protected server-side
- **[NEW]** Automatic session expiration (30 days default)
- **[NEW]** Recording consent required before starting
- Admin access not password-protected (add authentication for production)

## Cloud Services & Costs

### Vercel (Deployment & Storage)
- **Free Tier**: 500MB storage, 5GB bandwidth/month
- **Typical Usage**: ~20-30 sessions per month on free tier
- **Cost**: Free for most users, $0.15/GB for additional storage

### Supabase (Database)
- **Free Tier**: 500MB database, unlimited queries
- **Typical Usage**: Thousands of sessions (metadata only)
- **Cost**: Free for most users

👉 See `SETUP_GUIDE.md` for detailed cost estimates

## What's New in v2.0

✨ **Session Recording**
- Automatic camera recording during photobooth session
- Privacy-conscious consent dialog
- MediaRecorder API with WebM format
- Recording indicator with duration counter

✨ **Cloud Storage**
- Vercel Blob for videos and images
- Supabase for session metadata
- Secure server-side uploads
- Automatic file organization

✨ **QR Code Access**
- Dynamic QR code generation per session
- Download QR code as PNG
- Copy link to clipboard
- Unique, unpredictable session URLs

✨ **Mobile Session View**
- Beautiful responsive design
- Video player with controls
- Photo strip display
- Download buttons for all assets
- Expiration date display

✨ **Privacy & Security**
- Informed consent before recording
- Automatic 30-day expiration
- No public session listing
- Server-side API protection

## Future Enhancements

- [ ] Operator session history dashboard
- [ ] Actual timelapse speed conversion (FFmpeg.wasm)
- [ ] Batch download (ZIP all files)
- [ ] Social media sharing
- [ ] Email/SMS delivery
- [ ] Custom QR code branding

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

Built with:
- React 18
- TypeScript
- Tailwind CSS
- Vite
- LocalForage
- **[NEW]** Vercel Blob (file storage)
- **[NEW]** Supabase (database)
- **[NEW]** QRCode.js (QR generation)
- **[NEW]** JSZip (file compression)
- jsPDF (PDF generation)

## Support

For issues or questions:
1. Check `SETUP_GUIDE.md` → Troubleshooting section
2. Review `DEPLOYMENT_CHECKLIST.md` for deployment issues
3. Check browser console for errors
4. Ensure all dependencies are installed (`npm install`)
5. Verify environment variables are set correctly
6. Check Vercel function logs (for production)
7. Review Supabase logs (Database → Logs Explorer)

**Quick Links:**
- 🚀 [Quick Start Guide](QUICK_START.md)
- 📖 [Setup Guide](SETUP_GUIDE.md)
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- 🗄️ [Database Schema](supabase-schema.sql)

---

**🎉 Enjoy your enhanced photobooth with session recording and QR code access!**
