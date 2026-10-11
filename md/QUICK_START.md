# Quick Start Guide

Get your photo booth running in 5 minutes!

## Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This will install all required packages including React, TypeScript, Tailwind CSS, and other dependencies.

## Step 2: Start the Development Server

```bash
npm run dev
```

The application will open automatically in your browser at `http://localhost:3000`

## Step 3: Set Up Your First Template

1. On the welcome screen, click **"Admin Access"** at the bottom
2. You'll see a message saying "No Templates Found"
3. Click **"Load Sample Templates"** to get started with 3 pre-built templates
4. Alternatively, click **"Create New Template"** to design your own

### Creating a Custom Template

If you want to create your own template:

1. Click **"Create New Template"**
2. Set a name (e.g., "My Photo Strip")
3. Set dimensions:
   - Click **Inches** button for easier estimation
   - Common sizes: 2×6" strip, 4×6" photo, 5×7" print
   - Choose DPI: 300 for standard prints, 600 for high quality
4. **Upload a background image** (PNG with transparent areas recommended)
5. Click **"+ Add Photo Slot"** four times to create 4 photo slots
6. **Drag each slot** to position it where you want photos to appear
7. **Resize slots** using the purple handle in the bottom-right corner
8. Click **"Save Template"**

## Step 4: Test the Photo Booth

1. Go back to the home page (click "Back to Photo Booth")
2. Click **"START PHOTO SESSION"**
3. Allow camera access when prompted
4. The camera will automatically capture 8 photos with a 5-second countdown
5. Select your 4 favorite photos
6. Customize them with filters and adjustments
7. Preview and download your final photo strip!

## Troubleshooting

### Camera Not Working?
- Make sure you're on `localhost` or `https://`
- Grant camera permissions in your browser
- Check that no other app is using the camera
- Try refreshing the page

### No Templates Showing?
- Go to `/admin` and check if templates are enabled
- Use the "Load Sample Templates" button
- Create a new template manually

### Images Look Blurry?
- Use higher resolution background images
- Increase template dimensions (try 1800x2700)
- Ensure good lighting for camera capture

## Next Steps

### Customize Your Templates
- Upload your own branded backgrounds
- Add foreground overlays (logos, borders)
- Adjust photo slot sizes and positions
- Create multiple layouts for variety

### Optimize for Your Use Case
- **Events**: Create branded templates with event logo
- **Parties**: Fun, colorful designs
- **Professional**: Clean, minimalist layouts
- **Weddings**: Elegant designs with custom text

### Deploy for Production
```bash
npm run build
```

Then host the `dist` folder on:
- Netlify (drag & drop)
- Vercel (Git integration)
- Your own server with nginx/Apache
- GitHub Pages

## Common Use Cases

### Kiosk Mode (Touchscreen)
1. Build the production version
2. Open in fullscreen browser mode
3. Disable browser navigation (kiosk browser extension)
4. Place touchscreen in stand

### Event Photo Booth
1. Create branded template with event logo
2. Connect external webcam for better quality
3. Connect printer for instant prints
4. Set up tablet or monitor for user interaction

### Testing Without Camera
- Use browser dev tools to simulate camera
- Or modify code to use sample images
- Useful for template design testing

## Configuration Options

### Change Photo Count
Edit `src/components/CameraCapture.tsx`:
```typescript
const PHOTOS_TO_CAPTURE = 8; // Change to any number
```

Edit `src/components/PhotoSelection.tsx`:
```typescript
const PHOTOS_TO_SELECT = 4; // Change to any number (≤ PHOTOS_TO_CAPTURE)
```

### Change Countdown Time
Edit `src/components/CameraCapture.tsx`:
```typescript
const COUNTDOWN_SECONDS = 5; // Change to desired seconds
```

### Customize Colors
Edit `tailwind.config.js` to change the color scheme throughout the app.

## File Structure Overview

```
src/
├── components/           # All UI components
│   ├── admin/           # Admin interface
│   │   ├── AdminDashboard.tsx
│   │   ├── TemplateDesigner.tsx
│   │   └── SampleTemplateLoader.tsx
│   ├── WelcomeScreen.tsx
│   ├── CameraCapture.tsx
│   ├── PhotoSelection.tsx
│   ├── PhotoEditor.tsx
│   └── FinalPreview.tsx
├── contexts/            # State management
├── utils/               # Helper functions
└── types/               # TypeScript types
```

## Tips for Best Results

### Template Design
- Use PNG with transparency for custom shapes
- Resolution: at least 1200px width
- Aspect ratio: 2:3 for photo strips, 1:1 for squares
- Leave space for photo slots

### Camera Setup
- Good lighting is essential
- Position camera at eye level
- Solid background behind users
- Test with actual users before event

### Photo Quality
- Higher resolution = larger file size
- Balance quality vs performance
- Test on target device

### Performance
- Limit to 10-15 active templates
- Clear old sessions periodically
- Use optimized images

## Support & Help

- Check `README.md` for detailed documentation
- Review `IMPLEMENTATION_NOTES.md` for technical details
- Browser console shows helpful error messages
- All data stored locally in IndexedDB

## What's Included

✅ **8 automatic photo captures** with countdown  
✅ **4 photo selection** from captured set  
✅ **Photo editing** - filters, brightness, contrast, etc.  
✅ **Template system** - drag-and-drop designer  
✅ **Download & Print** - high-quality PNG export  
✅ **Responsive design** - works on desktop, tablet, touch  
✅ **Local storage** - no server required  
✅ **Sample templates** - get started instantly  

## Ready to Go!

Your photo booth system is now set up and ready to use. Start creating amazing photo memories! 📸✨
