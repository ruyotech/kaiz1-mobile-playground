import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, PanResponder } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { EnhancedNotification, getNotificationTypeConfig, getCategoryConfig } from '../../types/notification.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOAST_WIDTH = SCREEN_WIDTH - 32;

interface NotificationToastProps {
    notification: EnhancedNotification;
    onDismiss: () => void;
    onPress?: () => void;
    duration?: number; // Auto-dismiss duration in ms
}

export function NotificationToast({
    notification,
    onDismiss,
    onPress,
    duration = 5000,
}: NotificationToastProps) {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const translateY = useRef(new Animated.Value(-150)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    const typeConfig = getNotificationTypeConfig(notification.type);
    const categoryConfig = getCategoryConfig(notification.category);
    
    const iconName = notification.icon || typeConfig?.icon || 'bell-outline';
    const iconColor = notification.iconColor || typeConfig?.color || '#3B82F6';
    const bgColor = categoryConfig?.bgColor || '#DBEAFE';

    useEffect(() => {
        // Animate in
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 100,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto dismiss
        const timer = setTimeout(() => {
            handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -150,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    const handleSwipeDismiss = (direction: 'left' | 'right' | 'up') => {
        const toValue = direction === 'up' ? -150 : direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
        const animTarget = direction === 'up' ? translateY : translateX;
        
        Animated.parallel([
            Animated.timing(animTarget, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy < 0) {
                    translateY.setValue(gestureState.dy);
                } else {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -50) {
                    handleSwipeDismiss('up');
                } else if (gestureState.dx < -100) {
                    handleSwipeDismiss('left');
                } else if (gestureState.dx > 100) {
                    handleSwipeDismiss('right');
                } else {
                    // Reset position
                    Animated.parallel([
                        Animated.spring(translateY, {
                            toValue: 0,
                            useNativeDriver: true,
                        }),
                        Animated.spring(translateX, {
                            toValue: 0,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            },
        })
    ).current;

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (notification.deepLink) {
            router.push(notification.deepLink as any);
        }
        handleDismiss();
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={{
                position: 'absolute',
                top: insets.top + 8,
                left: 16,
                right: 16,
                transform: [
                    { translateY },
                    { translateX },
                    { scale },
                ],
                opacity,
                zIndex: 9999,
            }}
        >
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                {/* Priority indicator */}
                {notification.priority === 'urgent' && (
                    <View className="h-1 bg-red-500" />
                )}
                {notification.priority === 'high' && (
                    <View className="h-1 bg-orange-500" />
                )}

                <View className="flex-row p-4">
                    {/* Icon */}
                    <View
                        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: bgColor }}
                    >
                        {notification.emoji ? (
                            <Text className="text-2xl">{notification.emoji}</Text>
                        ) : (
                            <MaterialCommunityIcons
                                name={iconName as any}
                                size={24}
                                color={iconColor}
                            />
                        )}
                    </View>

                    {/* Content */}
                    <View className="flex-1 pr-2">
                        <View className="flex-row items-center justify-between mb-1">
                            <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                                {notification.title}
                            </Text>
                            <TouchableOpacity onPress={handleDismiss} className="p-1 -mr-1">
                                <MaterialCommunityIcons name="close" size={16} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-sm text-gray-600" numberOfLines={2}>
                            {notification.body}
                        </Text>

                        {/* Quick actions */}
                        {notification.actions && notification.actions.length > 0 && (
                            <View className="flex-row mt-2 gap-2">
                                {notification.actions.slice(0, 2).map((action) => (
                                    <TouchableOpacity
                                        key={action.id}
                                        className={`px-3 py-1 rounded-full ${
                                            action.type === 'primary'
                                                ? 'bg-blue-600'
                                                : 'bg-gray-100'
                                        }`}
                                        onPress={() => {
                                            // Handle action
                                            handleDismiss();
                                        }}
                                    >
                                        <Text
                                            className={`text-xs font-medium ${
                                                action.type === 'primary' ? 'text-white' : 'text-gray-700'
                                            }`}
                                        >
                                            {action.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* Progress indicator for toast auto-dismiss */}
                <Animated.View
                    className="h-0.5 bg-blue-500"
                    style={{
                        width: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    }}
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

// ==========================================
// NotificationToastManager - Global toast controller
// ==========================================

interface ToastQueueItem {
    id: string;
    notification: EnhancedNotification;
}

class ToastManager {
    private queue: ToastQueueItem[] = [];
    private listeners: Set<(queue: ToastQueueItem[]) => void> = new Set();

    show(notification: EnhancedNotification) {
        const id = `toast-${Date.now()}-${Math.random()}`;
        this.queue.push({ id, notification });
        this.notifyListeners();
    }

    dismiss(id: string) {
        this.queue = this.queue.filter(item => item.id !== id);
        this.notifyListeners();
    }

    dismissAll() {
        this.queue = [];
        this.notifyListeners();
    }

    subscribe(listener: (queue: ToastQueueItem[]) => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener([...this.queue]));
    }

    getQueue() {
        return this.queue;
    }
}

export const toastManager = new ToastManager();

interface NotificationToastContainerProps {}

export function NotificationToastContainer({}: NotificationToastContainerProps) {
    const [queue, setQueue] = useState<ToastQueueItem[]>([]);

    useEffect(() => {
        const unsubscribe = toastManager.subscribe(setQueue);
        return () => { unsubscribe(); };
    }, []);

    // Only show the first toast in queue
    const currentToast = queue[0];

    if (!currentToast) return null;

    return (
        <NotificationToast
            key={currentToast.id}
            notification={currentToast.notification}
            onDismiss={() => toastManager.dismiss(currentToast.id)}
        />
    );
}

export default NotificationToast;
