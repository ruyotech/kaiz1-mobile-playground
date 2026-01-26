import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NotificationBell } from '../notifications';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
    useSafeArea?: boolean;
    children?: React.ReactNode;
    showNotifications?: boolean;
}

export function ScreenHeader({ 
    title, 
    subtitle, 
    showBack = false, 
    rightAction, 
    useSafeArea = true, 
    children,
    showNotifications = true,
}: ScreenHeaderProps) {
    const router = useRouter();

    const content = (
        <>
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                    {showBack && (
                        <Pressable onPress={() => router.back()} className="mr-3">
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#2563EB" />
                        </Pressable>
                    )}
                    <View className="flex-1">
                        <Text className="text-xl font-bold text-gray-900">{title}</Text>
                        {subtitle && (
                            <Text className="text-sm text-gray-600 mt-0.5">{subtitle}</Text>
                        )}
                    </View>
                </View>
                <View className="flex-row items-center ml-2">
                    {showNotifications && (
                        <View className="mr-2">
                            <NotificationBell size={22} variant="outlined" />
                        </View>
                    )}
                    {rightAction && (
                        <View>
                            {rightAction}
                        </View>
                    )}
                </View>
            </View>
            {children}
        </>
    );

    if (useSafeArea) {
        return (
            <SafeAreaView edges={['top']} className="bg-white border-b border-gray-200">
                <View className={`px-4 ${children ? 'pb-0' : 'pb-3'}`}>
                    {content}
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View className={`bg-white border-b border-gray-200 px-4 pt-12 ${children ? 'pb-0' : 'pb-3'}`}>
            {content}
        </View>
    );
}
