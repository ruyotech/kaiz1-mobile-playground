import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Pressable, Text } from 'react-native';
import { SplashScreen } from '../components/SplashScreen';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../store/authStore';

export default function Index() {
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true);
    const [showDevReset, setShowDevReset] = useState(false);
    const { isOnboarded, reset: resetApp } = useAppStore();
    const { user, reset: resetAuth } = useAuthStore();

    useEffect(() => {
        // Log current state for debugging
        console.log('🔍 App State:', { isOnboarded, hasUser: !!user });
    }, [isOnboarded, user]);

    useEffect(() => {
        if (!showSplash) {
            // Determine where to navigate based on app state
            console.log('🚀 Navigating based on state...');
            
            if (!isOnboarded) {
                console.log('→ Going to Welcome (not onboarded)');
                // @ts-ignore - Dynamic route
                router.replace('/(onboarding)/welcome');
            } else if (!user) {
                console.log('→ Going to Login (onboarded but no user)');
                // @ts-ignore - Dynamic route
                router.replace('/(auth)/login');
            } else {
                console.log('→ Going to Tabs (onboarded and has user)');
                router.replace('/(tabs)');
            }
        }
    }, [showSplash, isOnboarded, user]);

    const handleSplashFinish = () => {
        setShowSplash(false);
    };

    const handleDevReset = () => {
        console.log('🔄 Resetting app state...');
        resetApp();
        resetAuth();
        setShowDevReset(false);
        setShowSplash(true);
        
        // Reload after a short delay
        setTimeout(() => {
            setShowSplash(false);
        }, 100);
    };

    if (showSplash) {
        return (
            <View style={{ flex: 1 }}>
                <SplashScreen onFinish={handleSplashFinish} />
                
                {/* Developer Reset Button - Hidden in corner */}
                <Pressable
                    onLongPress={() => setShowDevReset(true)}
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 20,
                        width: 60,
                        height: 60,
                        opacity: 0.01,
                    }}
                >
                    <View />
                </Pressable>

                {/* Reset Confirmation */}
                {showDevReset && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 20,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 16,
                                padding: 24,
                                width: '90%',
                                maxWidth: 400,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    marginBottom: 12,
                                    textAlign: 'center',
                                }}
                            >
                                🔄 Reset Demo
                            </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: '#6B7280',
                                    marginBottom: 8,
                                    textAlign: 'center',
                                }}
                            >
                                Current State:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#374151',
                                    marginBottom: 20,
                                    textAlign: 'center',
                                }}
                            >
                                Onboarded: {isOnboarded ? '✓' : '✗'} | User: {user ? '✓' : '✗'}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#6B7280',
                                    marginBottom: 20,
                                    textAlign: 'center',
                                }}
                            >
                                This will reset the app and show the welcome screens
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Pressable
                                    onPress={() => setShowDevReset(false)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#E5E7EB',
                                        padding: 16,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontWeight: '600', color: '#374151' }}>
                                        Cancel
                                    </Text>
                                </Pressable>
                                <Pressable
                                    onPress={handleDevReset}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#2563EB',
                                        padding: 16,
                                        borderRadius: 8,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ fontWeight: '600', color: 'white' }}>
                                        Reset App
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    }

    return null;
}
