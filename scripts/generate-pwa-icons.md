# Generate PWA Icons

To generate the required PWA icons (192x192 and 512x512), you can use one of these methods:

## Method 1: Using Online Tools
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload `public/pearl-logo.png`
3. Download the generated icons
4. Place them in the `public` folder as:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

## Method 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first, then:
magick public/pearl-logo.png -resize 192x192 public/icon-192.png
magick public/pearl-logo.png -resize 512x512 public/icon-512.png
```

## Method 3: Using Node.js Script
Run this script to generate icons from the existing logo:
```bash
node scripts/generate-icons.js
```

## Method 4: Manual Creation
1. Open `public/pearl-logo.png` in an image editor
2. Resize to 192x192 pixels, save as `public/icon-192.png`
3. Resize to 512x512 pixels, save as `public/icon-512.png`
4. Ensure both icons are square and have transparent or white backgrounds

## Required Icon Sizes
- **icon-192.png**: 192x192 pixels (for Android)
- **icon-512.png**: 512x512 pixels (for Android and iOS)

## Testing
After generating icons, test the PWA installation:
1. Open the app in Chrome/Edge on mobile
2. Look for "Add to Home Screen" prompt
3. Or use browser menu: "Install App" / "Add to Home Screen"

