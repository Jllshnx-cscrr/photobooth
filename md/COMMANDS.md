# Command Reference

Quick reference for all available npm commands and common tasks.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Starts the Vite development server at `http://localhost:3000`
- Hot module replacement (HMR) enabled
- Fast refresh for React components
- TypeScript type checking in IDE
- Opens browser automatically

### Build for Production
```bash
npm run build
```
Creates optimized production build in `dist/` folder
- TypeScript compilation
- Code minification
- Asset optimization
- Tree shaking
- Source maps generation

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing
- Same behavior as production
- Test before deployment
- Verify build correctness

### Lint Code
```bash
npm run lint
```
Runs ESLint on TypeScript and TSX files
- Checks code quality
- Finds potential errors
- Enforces code style

## Installation Commands

### Fresh Install
```bash
npm install
```
Installs all dependencies from package.json

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```
Removes existing dependencies and reinstalls fresh

### Update Dependencies
```bash
npm update
```
Updates packages to latest compatible versions

### Check Outdated Packages
```bash
npm outdated
```
Lists packages with newer versions available

## Development Workflow

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser to http://localhost:3000
```

### Daily Development
```bash
# Start dev server
npm run dev

# Make your changes
# Save files - HMR will update browser automatically
```

### Before Committing
```bash
# Check for errors
npm run lint

# Build to verify no build errors
npm run build

# Test production build
npm run preview
```

### Deploy to Production
```bash
# 1. Build production version
npm run build

# 2. Test production build locally
npm run preview

# 3. Deploy dist/ folder to your hosting service
```

## Common Tasks

### Clear Build Cache
```bash
# Windows
rmdir /s /q dist
rmdir /s /q node_modules\.vite

# Linux/Mac
rm -rf dist
rm -rf node_modules/.vite
```

### Reinstall Dependencies
```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
npm install

# Linux/Mac
rm -rf node_modules
rm package-lock.json
npm install
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```
Type checks without emitting files

### Format Code (if Prettier installed)
```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### Analyze Bundle Size
```bash
npm run build
npx vite-bundle-visualizer
```

## Troubleshooting Commands

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill
```

### Clear Browser Storage
Open browser console and run:
```javascript
// Clear all local storage
localStorage.clear();

// Clear IndexedDB
indexedDB.deleteDatabase('photobooth');
```

### Reset Everything
```bash
# Windows
rmdir /s /q node_modules
rmdir /s /q dist
del package-lock.json
npm install
npm run dev

# Linux/Mac
rm -rf node_modules dist package-lock.json
npm install
npm run dev
```

## Git Commands (Reference)

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: Photo booth system"
```

### Create Git Repository
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### Commit Changes
```bash
git add .
git commit -m "Description of changes"
git push
```

## Deployment Commands

### Deploy to Netlify
```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

### Deploy to Vercel
```bash
npm install -g vercel
npm run build
vercel --prod
```

### Deploy to GitHub Pages
```bash
npm run build
# Push dist/ to gh-pages branch or use GitHub Actions
```

## Testing Commands

### Test Camera Access (Browser Console)
```javascript
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log('Camera access granted');
    stream.getTracks().forEach(track => track.stop());
  })
  .catch(err => console.error('Camera access denied:', err));
```

### Check Storage Usage (Browser Console)
```javascript
navigator.storage.estimate().then(estimate => {
  console.log(`Storage used: ${estimate.usage} bytes`);
  console.log(`Storage quota: ${estimate.quota} bytes`);
  console.log(`Percentage: ${(estimate.usage / estimate.quota * 100).toFixed(2)}%`);
});
```

### List All Templates (Browser Console)
```javascript
import('localforage').then(localforage => {
  const store = localforage.createInstance({
    name: 'photobooth',
    storeName: 'templates'
  });
  store.iterate((value, key) => {
    console.log(key, value);
  });
});
```

## Environment Variables

Create `.env.local` file:
```bash
VITE_PORT=3000
VITE_DEFAULT_CAMERA_FACING=user
VITE_CAPTURE_RESOLUTION_WIDTH=1920
VITE_CAPTURE_RESOLUTION_HEIGHT=1080
```

## Performance Monitoring

### Lighthouse Audit
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
npm run build
npm run preview
lighthouse http://localhost:4173 --view
```

### Bundle Analysis
```bash
npm run build
npx vite-bundle-visualizer
```

## Useful npm Packages (Optional)

### Add Prettier
```bash
npm install -D prettier
echo {} > .prettierrc
```

### Add Husky (Git Hooks)
```bash
npm install -D husky
npx husky init
```

### Add Commitlint
```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `npm update` | Update packages |
| `npm outdated` | Check for updates |

## Development Tips

### Hot Tips
- Save files to see instant updates (HMR)
- Check browser console for errors
- Use React DevTools for debugging
- TypeScript errors show in IDE
- Build errors show in terminal

### Best Practices
- Run `npm run build` before committing
- Test in multiple browsers
- Clear browser cache if issues
- Keep dependencies updated
- Use version control (git)

### Performance
- Use production build for testing
- Monitor bundle size
- Optimize images before upload
- Test on target devices
- Profile with browser DevTools

## Support

If commands fail:
1. Check Node.js version (18+)
2. Delete `node_modules` and reinstall
3. Clear npm cache: `npm cache clean --force`
4. Check for permission issues
5. Verify internet connection

For more help, see:
- README.md - Full documentation
- QUICK_START.md - Setup guide
- Package.json - All available scripts
