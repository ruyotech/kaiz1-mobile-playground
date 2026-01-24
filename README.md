# Kaiz1 Mobile Playground

Personal SDLC Super-App mobile playground built with Expo and TypeScript.

## ⚠️ Setup Required

**This project requires Node.js 18+ to run.** Since Node.js is not currently installed on your system, you'll need to install it before running the app.

### Install Node.js

Choose one of these methods:

1. **Homebrew** (requires password):
   ```bash
   brew install node
   ```

2. **Official Installer**: Download from [nodejs.org](https://nodejs.org/)

3. **NVM (Node Version Manager)**:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 18
   ```

## 📦 Installation

Once Node.js is installed:

```bash
npm install
```

## 🚀 Running the App

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## 📂 Project Structure

- `app/` - Expo Router screens
- `components/` - Reusable UI components
- `data/mock/` - Dummy JSON data files
- `services/` - Mock API layer
- `store/` - Zustand state management
- `types/` - TypeScript definitions
- `utils/` - Helper functions

## 🎯 Features

- ✅ SDLC Task Management with Story Points
- ✅ Motivational Quotes
- ✅ Book Summaries
- ✅ Group Challenges with Leaderboards
- ✅ Pomodoro Focus Timer
- ✅ AI Scrum Master Notifications
- ✅ Family Account Management

## 🚧 Features Removed for Launch Phase

The following features have been temporarily removed to focus on core functionality for the initial launch. They will be added back in post-launch iterations:

### 📊 Reports & Analytics
A comprehensive analytics dashboard that provides:
- Task completion metrics and velocity tracking
- Sprint performance visualization
- Focus time analytics from Pomodoro sessions
- Challenge completion statistics
- Cross-feature performance reports

**Why Removed:** The reports feature requires significant backend infrastructure for data aggregation and visualization. To ensure a stable launch, we're focusing on core task management and challenge features first. Analytics will be gradually introduced as we collect sufficient user data.

### 💰 Bills Management
A bill tracking system with features including:
- Bill tracking with payment status (paid, unpaid, overdue)
- OCR scanning for automatic bill data extraction
- Recurring bill management
- Payment reminders and notifications
- Category-based organization
- Financial analytics and spending insights

**Why Removed:** The bills feature involves financial data management, payment integrations, and OCR processing that require additional security considerations and third-party service integrations. We're deferring this to ensure proper security measures and compliance are in place before handling financial information.
