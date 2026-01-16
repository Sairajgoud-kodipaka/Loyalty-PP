# PWA Setup Guide

This guide explains how to set up and test the Progressive Web App (PWA) installation on mobile devices.

## ✅ What's Already Configured

1. **Manifest File** (`public/manifest.json` & `app/manifest.ts`)
   - App name, description, theme colors
   - Display mode: standalone
   - Icons configuration
   - Shortcuts for quick access

2. **Service Worker** (`public/sw.js`)
   - Offline caching
   - Asset caching for faster loading
   - Runtime caching for dynamic content

3. **PWA Components**
   - `ServiceWorkerRegistration.tsx` - Registers service worker
   - `PWAInstallPrompt.tsx` - Shows install prompt to users

4. **Metadata** (`app/layout.tsx`)
   - PWA metadata configured
   - Apple-specific meta tags for iOS

## 📱 Required Icons

You need to generate two icon files:

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

### Generate Icons

**Option 1: Using the provided script**
```bash
npm install sharp --save-dev
node scripts/generate-icons.js
```

**Option 2: Manual creation**
1. Open `public/pearl-logo.png` in an image editor
2. Resize to 192x192, save as `public/icon-192.png`
3. Resize to 512x512, save as `public/icon-512.png`

**Option 3: Online tool**
- Visit https://www.pwabuilder.com/imageGenerator
- Upload your logo and download the generated icons

## 🧪 Testing PWA Installation

### On Android (Chrome/Edge)

1. **Open the app** in Chrome or Edge browser
2. **Look for install prompt:**
   - Browser may show "Add to Home Screen" banner
   - Or tap menu (⋮) → "Install app" / "Add to Home Screen"
3. **Verify installation:**
   - App should appear on home screen
   - Opens in standalone mode (no browser UI)
   - Works offline (after first load)

### On iOS (Safari)

1. **Open the app** in Safari
2. **Tap Share button** (square with arrow)
3. **Select "Add to Home Screen"**
4. **Customize name** (optional)
5. **Tap "Add"**
6. **Verify installation:**
   - App icon appears on home screen
   - Opens in standalone mode

### Testing Checklist

- [ ] Manifest file loads correctly (`/manifest.json`)
- [ ] Service worker registers (`/sw.js`)
- [ ] Icons display correctly (192x192 and 512x512)
- [ ] Install prompt appears (after 3 seconds)
- [ ] App installs successfully
- [ ] App opens in standalone mode
- [ ] Offline functionality works
- [ ] Theme color matches (#3b82f6)

## 🔍 Debugging

### Check Service Worker
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Service Workers" section
4. Verify status is "activated and running"

### Check Manifest
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Manifest" section
4. Verify all fields are correct

### Common Issues

**Issue: Install prompt doesn't appear**
- Ensure HTTPS (or localhost for development)
- Check that manifest.json is accessible
- Verify service worker is registered
- Clear browser cache and try again

**Issue: Icons not showing**
- Ensure icon files exist in `public/` folder
- Check icon paths in manifest.json
- Verify icons are PNG format
- Check file sizes (192x192 and 512x512)

**Issue: App doesn't work offline**
- Check service worker registration
- Verify service worker is caching assets
- Check browser console for errors

## 📋 PWA Requirements Checklist

- ✅ HTTPS (required for production)
- ✅ Valid manifest.json
- ✅ Service worker registered
- ✅ Icons (192x192 and 512x512)
- ✅ Start URL configured
- ✅ Display mode: standalone
- ✅ Theme color set
- ✅ Viewport meta tag configured

## 🚀 Production Deployment

Before deploying to production:

1. **Generate icons** (if not done)
2. **Test on real devices** (Android & iOS)
3. **Verify HTTPS** is enabled
4. **Test offline functionality**
5. **Check install prompt** appears correctly

## 📱 Installation Methods

Users can install the PWA in several ways:

1. **Automatic prompt** (after 3 seconds)
2. **Browser menu** → "Install app" / "Add to Home Screen"
3. **Share menu** (iOS Safari) → "Add to Home Screen"

## 🎯 Next Steps

1. Generate the icon files
2. Test installation on Android device
3. Test installation on iOS device
4. Verify offline functionality
5. Test app shortcuts (long-press icon)

