/**
 * SensAI Tab Layout
 * 
 * Navigation structure for the AI Scrum Master feature.
 */

import { Stack } from 'expo-router';

export default function SensAILayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="standup" />
            <Stack.Screen name="planning" />
            <Stack.Screen name="review" />
            <Stack.Screen name="retrospective" />
            <Stack.Screen name="interventions" />
            <Stack.Screen name="lifewheel" />
            <Stack.Screen name="velocity" />
            <Stack.Screen name="analytics" />
            <Stack.Screen name="intake" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
