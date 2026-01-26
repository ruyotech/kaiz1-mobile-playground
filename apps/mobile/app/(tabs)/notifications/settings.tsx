import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationStore } from '../../../store/notificationStore';
import { NOTIFICATION_CATEGORIES, NotificationCategory } from '../../../types/notification.types';

interface SettingRowProps {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    iconColor: string;
    iconBgColor: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

function SettingRow({ icon, iconColor, iconBgColor, title, subtitle, value, onValueChange }: SettingRowProps) {
    return (
        <View className="flex-row items-center p-4 border-b border-gray-100">
            <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: iconBgColor }}
            >
                <MaterialCommunityIcons name={icon} size={20} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                thumbColor={value ? '#3B82F6' : '#F3F4F6'}
            />
        </View>
    );
}

export default function NotificationSettingsScreen() {
    const router = useRouter();
    const { preferences, updatePreferences, toggleCategoryNotifications } = useNotificationStore();

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">Notification Settings</Text>
            </View>

            <ScrollView className="flex-1">
                {/* Master Toggle */}
                <View className="bg-white mt-4 mx-4 rounded-2xl overflow-hidden">
                    <View className="flex-row items-center p-4 border-b border-gray-100">
                        <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                            <MaterialCommunityIcons name="bell" size={24} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-900">Push Notifications</Text>
                            <Text className="text-sm text-gray-500">Enable or disable all notifications</Text>
                        </View>
                        <Switch
                            value={preferences.pushEnabled}
                            onValueChange={(value) => updatePreferences({ pushEnabled: value })}
                            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                            thumbColor={preferences.pushEnabled ? '#3B82F6' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Categories */}
                <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-4 mt-6 mb-2">
                    Notification Categories
                </Text>
                <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                    {NOTIFICATION_CATEGORIES.map((category, index) => (
                        <SettingRow
                            key={category.id}
                            icon={category.icon as any}
                            iconColor={category.color}
                            iconBgColor={category.bgColor}
                            title={category.name}
                            value={preferences.categories[category.id as NotificationCategory]?.enabled ?? true}
                            onValueChange={(enabled) => toggleCategoryNotifications(category.id as NotificationCategory, enabled)}
                        />
                    ))}
                </View>

                {/* Sound & Vibration */}
                <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mx-4 mt-6 mb-2">
                    Sound & Vibration
                </Text>
                <View className="bg-white mx-4 rounded-2xl overflow-hidden mb-6">
                    <SettingRow
                        icon="volume-high"
                        iconColor="#10B981"
                        iconBgColor="#D1FAE5"
                        title="Sound"
                        subtitle="Play sound for notifications"
                        value={preferences.pushSound}
                        onValueChange={(value) => updatePreferences({ pushSound: value })}
                    />
                    <SettingRow
                        icon="vibrate"
                        iconColor="#8B5CF6"
                        iconBgColor="#EDE9FE"
                        title="Vibration"
                        subtitle="Vibrate for notifications"
                        value={preferences.pushVibrate}
                        onValueChange={(value) => updatePreferences({ pushVibrate: value })}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
