import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function SDLCIndex() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to sprint calendar
        router.replace('/(tabs)/sdlc/calendar');
    }, []);

    return null;
}
