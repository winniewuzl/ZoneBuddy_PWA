# ZoneBuddy PWA

Interactive time zone picker and converter - Progressive Web App version.

## Features

- 🌍 **Interactive Time Selection** - Drag horizontally across any card to select a time
- 🔄 **Synchronized Display** - All time zones update simultaneously
- 🎨 **Dynamic Shading** - Background colors change based on time of day (day/twilight/night)
- 📱 **Progressive Web App** - Install on iOS and Android home screens
- 💾 **Cookie Storage** - Settings saved in cookies (no auth required)
- 🔍 **Search & Manage** - Add, remove, and search for 40+ cities worldwide
- ↕️ **Reorder Zones** - Move time zones up and down to set priority

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Inline styles (no dependencies)
- **Storage**: js-cookie
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Deployment on Vercel

### Option 1: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Option 3: Manual Deploy

1. Run `npm run build`
2. Deploy the `.next` folder to any static hosting

## Installing as PWA

### iOS (Safari)

1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

## Features in Detail

### Cookie Storage

User settings are stored in cookies:
- **timeZones**: Array of selected time zones with custom labels
- **selectedDate**: Currently selected date

Cookies persist for:
- Time zones: 365 days
- Selected date: 7 days

### Available Time Zones

40+ cities across:
- North America (13 cities)
- South America (3 cities)
- Europe (9 cities)
- Asia (10 cities)
- Oceania (3 cities)

### Time Zone Cards

Each card shows:
- City name with emoji
- Custom label (optional)
- Time zone abbreviation (with DST support)
- Current time in that zone
- Day/night background gradient
- Vertical indicator line synced across all cards

## Project Structure

```
ZoneBuddy_PWA/
├── app/
│   ├── components/
│   │   ├── TimeZoneCard.tsx      # Individual time zone card
│   │   ├── ManageTimeZones.tsx   # Add/remove zones interface
│   │   └── DatePicker.tsx        # Date selection modal
│   ├── utils/
│   │   └── timezones.ts          # Time zone data and utilities
│   ├── layout.tsx                # Root layout with PWA config
│   ├── page.tsx                  # Main app page
│   └── globals.css               # Global styles
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── icon-192.png              # App icon (192x192)
│   ├── icon-512.png              # App icon (512x512)
│   └── sw.js                     # Service worker
├── package.json
├── tsconfig.json
├── next.config.js
└── vercel.json
```

## Browser Support

- ✅ iOS Safari 12+
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Samsung Internet 14+

## Related Projects

- **iOS Native**: [ZoneBuddy_iOS](https://github.com/yourusername/ZoneBuddy_iOS) - Swift/SwiftUI version

## License

MIT

## Credits

Inspired by [tryelsewhen.com](https://www.tryelsewhen.com)
