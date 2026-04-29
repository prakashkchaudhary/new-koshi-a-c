# Logo Integration Instructions

## Step 1: Save the Logo
Save your logo image as:
- **Main logo:** `bus-booking/frontend/public/images/logo.png`
- **Favicon:** `bus-booking/frontend/public/favicon.ico` (convert PNG to ICO)

## Step 2: Optional Sizes
For better quality across devices, also save:
- `bus-booking/frontend/public/images/logo-192.png` (192x192)
- `bus-booking/frontend/public/images/logo-512.png` (512x512)

## Where the Logo is Used
✅ Navbar (top-left)
✅ Footer (brand section)
✅ Login page (center)
✅ Register page (center)
✅ Booking confirmation (ticket header)
✅ Admin sidebar (top)
✅ Favicon (browser tab)

All code is already updated to use `/images/logo.png` — just drop the file in the right location!

## Convert PNG to ICO (for favicon)
Use online tool: https://www.icoconverter.com/
Or use this PowerShell command:
```powershell
# If you have ImageMagick installed
magick convert logo.png -define icon:auto-resize=16,32,48 favicon.ico
```
