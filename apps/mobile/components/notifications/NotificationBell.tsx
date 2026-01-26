import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, Pressable, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationCenter } from './NotificationCenter';
import { BlurView } from 'expo-blur';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NotificationBellProps {
    size?: number;
    color?: string;
    showBadge?: boolean;
    variant?: 'default' | 'outlined' | 'filled';
    onPress?: () => void;
}

export function NotificationBell({
    size = 24,
    color = '#374151',
    showBadge = true,
    variant = 'default',
    onPress,
}: NotificationBellProps) {
    const router = useRouter();
    const { unreadCount, fetchNotifications } = useNotificationStore();
    const [showModal, setShowModal] = useState(false);
    
    // Animation refs
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const badgeScaleAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        fetchNotifications();
    }, []);

    // Animate badge when count changes
    useEffect(() => {
        if (unreadCount > 0) {
            // Pop animation for badge
            Animated.sequence([
                Animated.timing(badgeScaleAnim, {
                    toValue: 1.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(badgeScaleAnim, {
                    toValue: 1,
                    friction: 4,
                    useNativeDriver: true,
                }),
            ]).start();

            // Ring animation for bell
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: -1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0.5,
                    duration: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: -0.5,
                    duration: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 60,
                    useNativeDriver: true,
                }),
            ]).start();

            // Continuous pulse for unread
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();

            return () => pulse.stop();
        } else {
            badgeScaleAnim.setValue(0);
            pulseAnim.setValue(1);
        }
    }, [unreadCount]);

    const handlePress = () => {
        // Press animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();

        if (onPress) {
            onPress();
        } else {
            setShowModal(true);
        }
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: ['-15deg', '0deg', '15deg'],
    });

    const getContainerStyle = () => {
        switch (variant) {
            case 'outlined':
                return 'border border-gray-200 rounded-full p-2';
            case 'filled':
                return 'bg-gray-100 rounded-full p-2';
            default:
                return '';
        }
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
                <Animated.View
                    className={`relative ${getContainerStyle()}`}
                    style={{ transform: [{ scale: scaleAnim }] }}
                >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <MaterialCommunityIcons
                            name={unreadCount > 0 ? 'bell-ring' : 'bell-outline'}
                            size={size}
                            color={unreadCount > 0 ? '#3B82F6' : color}
                        />
                    </Animated.View>

                    {/* Unread Badge */}
                    {showBadge && unreadCount > 0 && (
                        <Animated.View
                            className="absolute -top-1 -right-1"
                            style={{
                                transform: [{ scale: badgeScaleAnim }],
                            }}
                        >
                            <Animated.View
                                className="absolute w-full h-full rounded-full bg-red-500 opacity-30"
                                style={{
                                    transform: [{ scale: pulseAnim }],
                                }}
                            />
                            <View className="min-w-[18px] h-[18px] bg-red-500 rounded-full items-center justify-center px-1">
                                <Text className="text-[10px] font-bold text-white">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                </Animated.View>
            </TouchableOpacity>

            {/* Notification Center Modal */}
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <NotificationCenter
                    isModal
                    onClose={() => setShowModal(false)}
                />
            </Modal>
        </>
    );
}

// ==========================================
// NotificationBellCompact - For Tab Bar
// ==========================================

interface NotificationBellCompactProps {
    onPress?: () => void;
}

export function NotificationBellCompact({ onPress }: NotificationBellCompactProps) {
    const { unreadCount } = useNotificationStore();
    const [showModal, setShowModal] = useState(false);

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            setShowModal(true);
        }
    };

    return (
        <>
            <TouchableOpacity
                onPress={handlePress}
                className="items-center"
                activeOpacity={0.7}
            >
                <View
                    className="w-12 h-12 rounded-2xl items-center justify-center relative"
                    style={{ backgroundColor: unreadCount > 0 ? '#FEE2E2' : '#F3F4F6' }}
                >
                    <MaterialCommunityIcons
                        name={unreadCount > 0 ? 'bell-ring' : 'bell-outline'}
                        size={28}
                        color={unreadCount > 0 ? '#EF4444' : '#6B7280'}
                    />
                    {unreadCount > 0 && (
                        <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full items-center justify-center px-1">
                            <Text className="text-[10px] font-bold text-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
                <Text
                    className="text-[10px] font-medium mt-0.5"
                    style={{ color: unreadCount > 0 ? '#EF4444' : '#6B7280' }}
                >
                    Alerts
                </Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <NotificationCenter
                    isModal
                    onClose={() => setShowModal(false)}
                />
            </Modal>
        </>
    );
}

// ==========================================
// NotificationIndicator - Minimal dot only
// ==========================================

interface NotificationIndicatorProps {
    size?: number;
}

export function NotificationIndicator({ size = 8 }: NotificationIndicatorProps) {
    const { unreadCount } = useNotificationStore();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (unreadCount > 0) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.5,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [unreadCount]);

    if (unreadCount === 0) return null;

    return (
        <View className="relative">
            <Animated.View
                className="absolute rounded-full bg-red-500 opacity-30"
                style={{
                    width: size * 2,
                    height: size * 2,
                    marginLeft: -size / 2,
                    marginTop: -size / 2,
                    transform: [{ scale: pulseAnim }],
                }}
            />
            <View
                className="rounded-full bg-red-500"
                style={{ width: size, height: size }}
            />
        </View>
    );
}

export default NotificationBell;
