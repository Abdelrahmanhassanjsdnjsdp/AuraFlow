# AuraFlow - AI Traffic & Community Navigation App

A high-fidelity, interactive mobile web application built with React and Tailwind CSS featuring a dark, cyberpunk-inspired aesthetic.

## Features

- 🔐 **Authentication**: Egyptian phone number login with OTP verification
- 🗺️ **Smart Navigation**: GPS-based route planning with real-time telemetry
- 🎁 **Points & Rewards**: Earn Aura Points and redeem fuel vouchers
- 🛡️ **Community Watch**: Report hazards with voice and photo upload
- 📱 **Mobile-First Design**: Optimized for mobile devices with glassmorphism UI

## Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm (comes with Node.js)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port shown in terminal)

## Project Structure

```
├── public/
│   └── project-road-map.svg    # Road layout map image
├── src/
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind CSS styles
├── index.html                   # HTML template
├── package.json                 # Dependencies
└── vite.config.js              # Vite configuration
```

## Using Your Own Project Image

To use your own road layout image:

1. Place your image file in the `public/` folder (e.g., `public/road-map.png`)
2. Update `src/App.jsx` line ~200 in the `ProjectImageMap` component:
   ```jsx
   <img src="/road-map.png" alt="AuraFlow Project Road Layout" ... />
   ```

## Build for Production

```bash
npm run build
```..

The built files will be in the `dist/` folder.




