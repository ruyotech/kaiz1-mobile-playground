import { Stack } from 'expo-router';

export default function NotificationsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="unread" />
            <Stack.Screen name="mentions" />
            <Stack.Screen name="tasks" />
            <Stack.Screen name="challenges" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
