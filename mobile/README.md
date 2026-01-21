# StyleLink Mobile App

React Native mobile application for StyleLink shoe price comparison.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **Install Expo CLI**
   ```bash
   npm install -g @expo/cli
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   - Download Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## Project Structure

```
mobile/
├── app/                 # Expo Router app directory
│   ├── (tabs)/         # Tab navigation screens
│   │   ├── index.tsx   # Search/Home screen
│   │   ├── wishlist.tsx # Price alerts screen
│   │   └── profile.tsx # Profile/settings screen
│   └── _layout.tsx     # Root layout
├── types/              # TypeScript type definitions
├── utils/              # Utility functions (affiliate links, etc.)
├── assets/             # Images, icons, fonts
└── package.json
```

## Features

- **Shoe Search**: Search across multiple retailers
- **Price Comparison**: Compare prices from different stores
- **Price Alerts**: Get notified when prices drop
- **Affiliate Integration**: Revenue generation through affiliate links
- **Native Experience**: Optimized for mobile devices

## Next Steps

1. Install dependencies and test the app
2. Add product search functionality
3. Integrate with your existing API endpoints
4. Add push notifications for price alerts
5. Prepare for app store submission

## App Store Deployment

- iOS: Need Apple Developer Account ($99/year)
- Android: Need Google Play Console account ($25 one-time)
- Use Expo Application Services (EAS) for easy building and submission
