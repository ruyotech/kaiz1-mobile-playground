# 🧪 Testing Guide - Onboarding & Auth Flows

## How to Test the Complete Flow

### Option 1: Reset Demo from Settings (Recommended)

1. **Open the app** (if already in the main app)
2. **Navigate to Settings** tab (gear icon)
3. **Tap "Reset Demo"** (first option under "Demo Controls")
4. **Confirm** in the alert dialog
5. App will restart and show the **Splash Screen → Welcome → Setup → Login**

### Option 2: Long Press on Splash Screen

1. **Reload the app** (or launch fresh)
2. When the **Splash Screen** appears, **long press** the top-left corner
3. A reset modal will appear showing current state
4. **Tap "Reset App"**
5. App will restart with the complete onboarding flow

### Option 3: Manual Console Reset

If you're in development and want to reset via console:

```javascript
// In your browser console or React Native Debugger
useAppStore.getState().reset();
useAuthStore.getState().reset();
```

---

## 🎯 Complete Testing Checklist

### First-Time User Experience

- [ ] **Splash Screen** appears (3 seconds)
  - Animated logo entrance
  - Pulsing effects
  - Loading dots

- [ ] **Welcome Carousel** (5 slides)
  - Swipe through all slides
  - Tap pagination dots to jump
  - Try "Skip" button
  - Use "Continue" then "Get Started"

- [ ] **Setup Wizard** (4 steps)
  - **Step 1:** Enter name & timezone
  - **Step 2:** Select life areas (min 1)
  - **Step 3:** Choose preferences
  - **Step 4:** Configure notifications
  - Use "Back" button between steps
  - Watch progress bar update
  - Complete with "Complete" button

- [ ] **Login Screen**
  - Try invalid email → see error
  - Try short password → see error
  - Use "Try Demo Account" button
  - Should login successfully

### Registration Flow

From Login screen:

- [ ] **Tap "Sign Up"**
- [ ] **Enter details** in registration
  - Try weak password → see strength meter
  - Try mismatched passwords → see error
  - Must check terms checkbox
- [ ] **Submit** → should show success
- [ ] **Verify Email Screen** appears
  - Enter 6-digit code
  - Try backspace navigation
  - Try paste full code
  - Try resend (60s cooldown)

### Password Reset Flow

From Login screen:

- [ ] **Tap "Forgot Password?"**
- [ ] **Enter email** → see validation
- [ ] **Send Reset Link**
- [ ] **Success screen** appears
  - Shows email address
  - Try "Resend Link"
  - Can go back to login

### Logout & Re-login

From any screen in the app:

- [ ] **Go to Settings**
- [ ] **Tap "Logout"**
- [ ] **Confirm** in alert
- [ ] Should return to **Login screen**
- [ ] **Login again** with demo account

---

## 🐛 Common Issues & Solutions

### Issue: App goes directly to main screens

**Solution:** The app state persisted from a previous session.

**Fix Options:**
1. Go to Settings → Tap "Reset Demo"
2. Long press splash screen top-left corner
3. Restart the app after resetting

### Issue: Onboarding skips to login

**Solution:** You completed onboarding before but didn't log in.

**Fix:** This is expected behavior! Use "Reset Demo" to start from welcome.

### Issue: Can't navigate back in wizard

**Solution:** Step 1 doesn't have a back button (by design).

**Expected:** Back button appears from Step 2 onwards.

### Issue: Console shows navigation errors

**Solution:** TypeScript route errors are expected for dynamic routes.

**Fix:** The `@ts-ignore` comments handle this - ignore the warnings.

---

## 📊 Current App State Indicators

### Check Console Logs

When the app starts, you'll see:

```
🔍 App State: { isOnboarded: false, hasUser: false }
🚀 Navigating based on state...
→ Going to Welcome (not onboarded)
```

This tells you:
- `isOnboarded: false` → Will show welcome/setup
- `hasUser: false` → Will show login after onboarding
- Both `true` → Goes directly to main app

### Visual Indicators

- **Splash Screen** → App just launched
- **Welcome Carousel** → Fresh start, not onboarded
- **Login Screen** → Onboarded, but not logged in
- **Main App Tabs** → Fully authenticated

---

## 🎓 Demo Account Credentials

**Email:** `john.doe@example.com`  
**Password:** `password123`

Use the "Try Demo Account" button for instant login.

---

## ⚡ Quick Reset Commands

### Via Settings (Easiest)
Settings → Demo Controls → Reset Demo

### Via Splash (Fast)
Long press top-left corner during splash

### Via Code (Developer)
```typescript
// Add to any screen temporarily
import { useAppStore } from './store/appStore';
import { useAuthStore } from './store/authStore';

const { reset: resetApp } = useAppStore();
const { reset: resetAuth } = useAuthStore();

// Call these functions
resetApp();
resetAuth();
```

---

## 🎬 Recommended Testing Order

1. **First**: Reset demo from settings
2. **Experience**: Complete welcome carousel
3. **Setup**: Go through all 4 wizard steps
4. **Login**: Use demo account
5. **Explore**: Navigate the app
6. **Test**: Try registration flow
7. **Test**: Try forgot password
8. **Reset**: Reset demo again
9. **Repeat**: Test different paths

---

## 📱 Testing on Physical Device

1. **Build for device:**
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

2. **Test gestures:**
   - Swipe transitions feel natural
   - Long press works on splash
   - Keyboard handling is smooth

3. **Test states:**
   - Background/foreground
   - Orientation changes
   - Network conditions

---

## ✅ Success Criteria

You've successfully tested when:

- ✓ Can complete full onboarding flow
- ✓ Can login with demo account
- ✓ Can register new account
- ✓ Can reset password
- ✓ Can logout and re-login
- ✓ Can reset demo and repeat
- ✓ All animations are smooth
- ✓ All validations work
- ✓ No crashes or errors

---

## 🚀 Next Steps After Testing

1. **Customize content** - Update feature slides, colors, text
2. **Connect API** - Replace mock functions with real endpoints
3. **Add persistence** - Use AsyncStorage for state
4. **Enable social auth** - Integrate Apple/Google SDKs
5. **Add analytics** - Track onboarding completion
6. **Test edge cases** - Network errors, timeouts, etc.

---

**Happy Testing! 🎉**

*Remember: The "Reset Demo" button in Settings is your best friend for testing!*
