# CSS Customization Guide

## 🎨 How to Customize Your Photobooth Styling

### Important: DON'T Edit `dist/assets/index-*.css`
- The files in `dist/assets/` are **automatically generated** when you build
- Any changes you make there will be **lost** when you run `npm run build`
- Always edit `src/custom.css` instead!

---

## ✅ The Right Way to Customize CSS

### Step 1: Edit the Custom CSS File
Open: `src/custom.css`

This file is organized into sections:
- **Color Palette** - Change colors throughout the app
- **Buttons** - Customize button styles
- **Welcome Screen** - Landing page styling
- **Camera Capture** - Camera interface
- **Photo Selection & Editor** - Photo grid and editor
- **Template Designer** - Admin interface
- **Modals** - Popup windows
- **Forms & Inputs** - Input fields
- **Scrollbars** - Scrollbar appearance
- **Animations** - Smooth transitions
- **Responsive Design** - Mobile adjustments
- **Your Custom Styles** - Add your own here

### Step 2: Make Your Changes
Example - Change the primary color from blue to red:

```css
:root {
  --primary-color: #ef4444;      /* Changed from blue to red */
  --primary-hover: #dc2626;      /* Darker red for hover */
}
```

### Step 3: Rebuild the Project
```bash
npm run build
```

This creates a new `dist` folder with your changes included.

### Step 4: Test Your Changes
- If testing locally: Open `dist/index.html` in your browser
- If deployed on Vercel: Push to GitHub and Vercel rebuilds automatically

---

## 🎯 Common Customizations

### Change the Color Scheme
Edit the `:root` section in `src/custom.css`:

```css
:root {
  /* Change these hex colors */
  --primary-color: #3b82f6;      /* Main brand color */
  --secondary-color: #8b5cf6;    /* Secondary accent */
  --accent-color: #10b981;       /* Success/confirmation */
}
```

Popular color palettes:
- **Professional Blue**: `#3b82f6`, `#1e40af`, `#60a5fa`
- **Elegant Purple**: `#8b5cf6`, `#6d28d9`, `#a78bfa`
- **Vibrant Pink**: `#ec4899`, `#db2777`, `#f472b6`
- **Modern Green**: `#10b981`, `#059669`, `#34d399`

### Make Buttons Bigger or Smaller
Find the button section and adjust padding:

```css
button.bg-blue-500,
.btn-primary {
  padding: 1rem 2rem;      /* Bigger: 1.5rem 3rem */
  font-size: 1rem;         /* Bigger: 1.25rem */
}
```

### Change the Welcome Screen Background
Find `.welcome-screen` and modify:

```css
.welcome-screen {
  /* Solid color */
  background: #3b82f6;
  
  /* OR gradient */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  /* OR image */
  background: url('/path/to/image.jpg') center/cover;
}
```

### Customize Photo Borders
Find `.photo-thumbnail` section:

```css
.photo-thumbnail {
  border: 5px solid transparent;    /* Thicker border */
  border-radius: 1rem;              /* More rounded */
}

.photo-thumbnail.selected {
  border-color: #10b981;            /* Green when selected */
}
```

### Change Font Styles
Add to "Your Custom Styles" section:

```css
/* Change all fonts */
body {
  font-family: 'Arial', 'Helvetica', sans-serif;
}

/* Change button fonts */
button {
  font-family: 'Georgia', serif;
  font-weight: bold;
  letter-spacing: 0.05em;
}
```

### Add Rounded Corners Everywhere
Add to "Your Custom Styles":

```css
button, input, select, .photo-thumbnail, .modal-content {
  border-radius: 1.5rem !important;
}
```

### Change Shadow Intensity
Modify the `:root` section:

```css
:root {
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.2);    /* Stronger */
  --shadow-md: 0 8px 12px rgba(0, 0, 0, 0.2);   /* Stronger */
  --shadow-lg: 0 20px 40px rgba(0, 0, 0, 0.3);  /* Stronger */
}
```

---

## 🔧 Advanced Customizations

### Target Specific Components
Use browser DevTools (F12) to find class names, then override:

```css
/* Change specific welcome button */
.welcome-screen button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  text-transform: uppercase;
}

/* Change camera countdown color */
.countdown-timer {
  color: #ff6b6b;
  font-size: 8rem;
  text-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
}

/* Change admin sidebar color */
.admin-sidebar {
  background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
}
```

### Add Custom Classes to Components
In `src/custom.css`, create new classes:

```css
.my-custom-button {
  background: #ff6b6b;
  padding: 1rem 2rem;
  border-radius: 9999px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;
}

.my-custom-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 107, 107, 0.5);
}
```

Then in your component files (e.g., `WelcomeScreen.tsx`), add the class:
```tsx
<button className="my-custom-button">Start Photobooth</button>
```

---

## 🛠️ Troubleshooting

### My Changes Aren't Showing
1. **Did you rebuild?** Run `npm run build`
2. **Clear browser cache**: Ctrl+Shift+R (Chrome/Edge) or Cmd+Shift+R (Mac)
3. **Check the right file**: Make sure you edited `src/custom.css`, not `dist/assets/index-*.css`
4. **Check specificity**: Add `!important` if styles aren't applying:
   ```css
   button { background: red !important; }
   ```

### Styles Look Broken
- Make sure you didn't delete closing brackets `}`
- Check for typos in color codes (e.g., `#ff00000` should be `#ff0000`)
- Validate your CSS: https://jigsaw.w3.org/css-validator/

### Build Errors
- Check for syntax errors in `custom.css`
- Make sure all comments use `/* */` format, not `//`

---

## 📚 Resources

### Color Pickers
- https://coolors.co/ - Generate color palettes
- https://htmlcolorcodes.com/ - Pick individual colors

### CSS Generators
- https://cssgradient.io/ - Create gradients
- https://shadows.brumm.af/ - Create shadows
- https://9elements.github.io/fancy-border-radius/ - Fancy borders

### CSS Reference
- https://developer.mozilla.org/en-US/docs/Web/CSS - CSS documentation
- https://css-tricks.com/ - CSS tips and tricks

---

## 📝 Quick Reference

### Workflow
```
1. Edit: src/custom.css
2. Build: npm run build
3. Test: Open dist/index.html or check deployed site
4. Repeat until perfect!
```

### File Structure
```
src/
  ├── custom.css          ← EDIT THIS (your custom styles)
  ├── index.css           ← DON'T EDIT (Tailwind base)
  └── main.tsx            ← Already imports custom.css

dist/
  └── assets/
      └── index-*.css     ← DON'T EDIT (auto-generated)
```

### Key Sections to Customize
1. **Colors**: `:root` section
2. **Buttons**: `.btn-primary`, `.btn-success`, etc.
3. **Welcome Screen**: `.welcome-screen`
4. **Photos**: `.photo-thumbnail`
5. **Admin**: `.admin-sidebar`, `.template-canvas`

---

**Need more help?** Check the comments in `src/custom.css` - each section explains what it controls!
