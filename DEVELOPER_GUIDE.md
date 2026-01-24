# 🛠️ Developer Guide - Onboarding & Auth Flows

## Quick Start

### Testing the Complete Flow

1. **Start the app** - The app will show the splash screen
2. **Welcome screens** - Swipe through or skip
3. **Setup wizard** - Complete the 4-step onboarding
4. **Login** - Use demo account or create new account
5. **Main app** - Access full functionality

### Demo Account

```typescript
Email: john.doe@example.com
Password: password123
```

---

## Navigation Flow Logic

### Main Entry Point (`app/index.tsx`)

The app determines where to navigate based on state:

```typescript
if (!isOnboarded) {
    // Show welcome/onboarding
    router.replace('/(onboarding)/welcome');
} else if (!user) {
    // Show login
    router.replace('/(auth)/login');
} else {
    // Show main app
    router.replace('/(tabs)');
}
```

### State Management

**App Store** (`store/appStore.ts`):
- `isOnboarded`: Has user completed onboarding?
- `theme`: User's theme preference

**Auth Store** (`store/authStore.ts`):
- `user`: Current user object or null
- `login()`: Authenticate user
- `register()`: Create new account
- `logout()`: Clear user session

---

## Customizing Screens

### Welcome Screen

**Add/Remove Feature Slides:**

```typescript
// In app/(onboarding)/welcome.tsx
const FEATURES: FeatureSlide[] = [
    {
        id: 0,
        icon: '🚀',
        title: 'Your Title',
        subtitle: 'Your Subtitle',
        description: 'Your description...',
        gradient: ['#color1', '#color2'],
    },
    // Add more slides...
];
```

### Setup Wizard

**Modify Steps:**

1. Change step order in `steps` array
2. Add new step type to `SetupStep` union type
3. Create component for new step
4. Add validation in `validateCurrentStep()`
5. Update progress calculation

**Add Life Wheel Areas:**

```typescript
const LIFE_WHEEL_AREAS: LifeWheelArea[] = [
    { 
        id: '9', 
        name: 'Spirituality', 
        icon: '🙏', 
        color: 'bg-indigo-500' 
    },
];
```

### Login/Register

**Add Social Providers:**

1. Install provider SDK (Apple, Google, etc.)
2. Configure in `app.json`
3. Add handler function
4. Update button `onPress`

```typescript
const handleAppleLogin = async () => {
    // Implement Apple Sign-In
};
```

**Modify Validation:**

```typescript
// Example: Change password requirements
const validatePassword = (password: string): boolean => {
    if (password.length < 12) { // Changed from 8
        setPasswordError('Password must be at least 12 characters');
        return false;
    }
    // Add custom rules...
};
```

---

## Component Library

### New UI Components

#### Checkbox
```typescript
import { Checkbox } from '@/components/ui/Checkbox';

<Checkbox
    checked={isChecked}
    onPress={() => setIsChecked(!isChecked)}
    label="Accept terms"
/>
```

#### Progress Bar
```typescript
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar
    progress={75}
    showLabel
    label="Completion"
    color="bg-green-600"
/>
```

#### Toggle
```typescript
import { Toggle } from '@/components/ui/Toggle';

<Toggle
    enabled={isEnabled}
    onToggle={() => setIsEnabled(!isEnabled)}
    size="md"
/>
```

#### Splash Screen
```typescript
import { SplashScreen } from '@/components/SplashScreen';

<SplashScreen onFinish={() => setShowSplash(false)} />
```

---

## Animations

### Using Reanimated

All animations use `react-native-reanimated` for 60 FPS performance.

**Basic Fade In:**
```typescript
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(200).springify()}>
    {/* Content */}
</Animated.View>
```

**Custom Animations:**
```typescript
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
}));

// Trigger animation
scale.value = withSpring(1.2);
```

---

## Form Validation

### Pattern

1. Create state for value and error
2. Create validation function
3. Call validation on blur or submit
4. Display error in Input component

```typescript
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');

const validateEmail = (email: string): boolean => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setEmailError('Invalid email format');
        return false;
    }
    setEmailError('');
    return true;
};

<Input
    value={email}
    onChangeText={setEmail}
    error={emailError}
/>
```

### Validation Helpers

Create `utils/validation.ts` for reusable validators:

```typescript
export const validators = {
    email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    password: (value: string) => value.length >= 8,
    phone: (value: string) => /^\+?[1-9]\d{1,14}$/.test(value),
};
```

---

## API Integration

### Update Auth Functions

Replace mock API calls with real endpoints:

```typescript
// In store/authStore.ts

login: async (email, password) => {
    set({ loading: true, error: null });
    try {
        const response = await fetch('YOUR_API/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) throw new Error('Login failed');
        
        const user = await response.json();
        set({ user, loading: false });
    } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
    }
},
```

### Handle Token Storage

Use `expo-secure-store` for tokens:

```bash
npx expo install expo-secure-store
```

```typescript
import * as SecureStore from 'expo-secure-store';

// Save token
await SecureStore.setItemAsync('authToken', token);

// Retrieve token
const token = await SecureStore.getItemAsync('authToken');

// Delete token
await SecureStore.deleteItemAsync('authToken');
```

---

## Styling

### Theme Customization

Update colors in `tailwind.config.js`:

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    // ... your colors
                    600: '#2563eb',
                },
            },
        },
    },
};
```

### Custom Fonts

1. Add fonts to `assets/fonts/`
2. Load in `app/_layout.tsx`:

```typescript
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
    'CustomFont-Bold': require('../assets/fonts/CustomFont-Bold.ttf'),
});
```

3. Use in styles:

```typescript
<Text style={{ fontFamily: 'CustomFont-Bold' }}>Hello</Text>
```

---

## Testing

### Unit Tests

```typescript
// __tests__/validation.test.ts
import { validators } from '../utils/validation';

describe('Email Validation', () => {
    it('should validate correct email', () => {
        expect(validators.email('test@example.com')).toBe(true);
    });
    
    it('should reject invalid email', () => {
        expect(validators.email('invalid')).toBe(false);
    });
});
```

### E2E Tests (Detox)

```typescript
// e2e/onboarding.test.js
describe('Onboarding Flow', () => {
    it('should complete onboarding', async () => {
        await element(by.text('Get Started')).tap();
        await element(by.id('fullNameInput')).typeText('John Doe');
        await element(by.text('Continue')).tap();
        // ... more steps
    });
});
```

---

## Performance Optimization

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
```

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

const expensiveValue = useMemo(() => {
    return computeExpensiveValue(data);
}, [data]);

const handlePress = useCallback(() => {
    // Handler logic
}, [dependencies]);
```

### Animation Performance

- Use `react-native-reanimated` (runs on UI thread)
- Avoid `setState` during animations
- Use `useAnimatedStyle` instead of inline styles

---

## Accessibility

### Screen Reader Support

```typescript
<Pressable
    accessible
    accessibilityLabel="Login button"
    accessibilityHint="Double tap to login"
    accessibilityRole="button"
>
    <Text>Login</Text>
</Pressable>
```

### Contrast & Font Sizes

- Ensure 4.5:1 contrast ratio (WCAG AA)
- Support dynamic font sizes
- Test with device accessibility settings

---

## Troubleshooting

### Common Issues

**1. Navigation not working**
- Check route names match file structure
- Verify `_layout.tsx` includes screen
- Use `@ts-ignore` for dynamic routes

**2. Animations stuttering**
- Enable Hermes engine
- Check for `setState` in animation loop
- Use `useAnimatedStyle` properly

**3. Keyboard covering input**
- Use `KeyboardAvoidingView`
- Set `behavior="padding"` on iOS
- Consider `react-native-keyboard-aware-scroll-view`

**4. State not persisting**
- Implement `AsyncStorage` for persistence
- Check store initialization
- Verify state updates are immutable

---

## Deployment Checklist

- [ ] Remove demo credentials
- [ ] Replace mock API with real endpoints
- [ ] Add proper error tracking (Sentry)
- [ ] Implement analytics (Amplitude, Mixpanel)
- [ ] Test on physical devices (iOS & Android)
- [ ] Add biometric auth (optional)
- [ ] Configure app icons & splash screen
- [ ] Set up push notifications
- [ ] Add terms of service & privacy policy
- [ ] Enable app signing
- [ ] Submit to app stores

---

## Resources

### Documentation
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [NativeWind](https://www.nativewind.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

### Design Inspiration
- [Dribbble - Onboarding](https://dribbble.com/search/onboarding)
- [Mobbin - Mobile Patterns](https://mobbin.com/)
- [UI Sources](https://www.uisources.com/)

### Tools
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Expo Dev Tools](https://docs.expo.dev/workflow/debugging/)

---

## Support

For questions or issues with these screens:

1. Check this guide first
2. Review the feature documentation in `ONBOARDING_AUTH_FEATURES.md`
3. Examine the component code for inline comments
4. Test with the demo account

**Happy coding! 🚀**
