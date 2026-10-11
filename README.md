# Photo Booth System

A modern, interactive web-based photo booth system built with React, TypeScript, and Tailwind CSS.

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

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Usage

### For Users

1. **Start Session**: Click "START PHOTO SESSION" on the welcome screen
2. **Camera Capture**: Look at the camera - 8 photos will be captured automatically with 5-second countdown
3. **Select Photos**: Click on exactly 4 photos you want to use
4. **Customize**: Edit individual photos and select a layout
5. **Preview & Download**: Review the final composition and download or print

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
│   ├── CameraCapture.tsx         # Auto capture with countdown
│   ├── PhotoSelection.tsx        # Select 4 photos
│   ├── PhotoEditor.tsx           # Edit & customize
│   └── FinalPreview.tsx          # Download & print
├── contexts/
│   ├── SessionContext.tsx        # Photo session state
│   └── TemplateContext.tsx       # Template management
├── types/
│   └── index.ts                  # TypeScript definitions
├── utils/
│   ├── storage.ts                # LocalForage wrapper
│   └── imageProcessing.ts        # Canvas operations
├── App.tsx                       # Routing
├── PhotoBoothApp.tsx            # Main app component
└── main.tsx                      # Entry point
```

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

- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: Camera access requires HTTPS in production or localhost in development.

## Troubleshooting

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

## Security Considerations

- All data stored locally in browser
- No automatic upload to external servers
- Camera stream released when not in use
- Admin access not password-protected (add authentication for production)

## Future Enhancements

- User authentication for admin panel
- Cloud storage for templates
- Video recording mode
- Animated GIF export
- Social media sharing
- QR code for photo download
- Email photo delivery
- Custom stickers and text overlays
- Green screen support
- Multiple camera support

## License

MIT License - feel free to use for personal or commercial projects.

## Credits

Built with:
- React 18
- TypeScript
- Tailwind CSS
- Vite
- LocalForage
- Fabric.js (listed but canvas operations use native APIs)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure all dependencies are installed
4. Verify camera permissions are granted
