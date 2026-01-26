import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="appearance" />
            <Stack.Screen name="language" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="storage" />
            <Stack.Screen name="about" />
        </Stack>
    );
}
