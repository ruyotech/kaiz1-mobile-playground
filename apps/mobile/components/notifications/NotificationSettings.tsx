import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationStore } from '../../store/notificationStore';
import { NOTIFICATION_CATEGORIES, NotificationCategory } from '../../types/notification.types';

interface SettingRowProps {
    icon: string;
    iconColor: string;
    iconBgColor: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

function SettingRow({ icon, iconColor, iconBgColor, title, subtitle, value, onValueChange }: SettingRowProps) {
    return (
        <View className="flex-row items-center py-4 px-4 bg-white mb-px">
            <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: iconBgColor }}
            >
                <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">{title}</Text>
                {subtitle && (
                    <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>
                )}
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

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <View className="px-4 pt-6 pb-2">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</Text>
            {subtitle && (
                <Text className="text-xs text-gray-400 mt-1">{subtitle}</Text>
            )}
        </View>
    );
}

export function NotificationSettings() {
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
                            <MaterialCommunityIcons name="bell" size={28} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold text-gray-900">Notifications</Text>
                            <Text className="text-sm text-gray-500">
                                {preferences.enabled ? 'All notifications enabled' : 'All notifications disabled'}
                            </Text>
                        </View>
                        <Switch
                            value={preferences.enabled}
                            onValueChange={(value) => updatePreferences({ enabled: value })}
                            trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                            thumbColor={preferences.enabled ? '#3B82F6' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {preferences.enabled && (
                    <>
                        {/* Push Notification Settings */}
                        <SectionHeader title="Push Notifications" subtitle="Control how you're alerted" />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                            <SettingRow
                                icon="cellphone-message"
                                iconColor="#3B82F6"
                                iconBgColor="#DBEAFE"
                                title="Push Notifications"
                                subtitle="Receive alerts on your device"
                                value={preferences.pushEnabled}
                                onValueChange={(value) => updatePreferences({ pushEnabled: value })}
                            />
                            {preferences.pushEnabled && (
                                <>
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
                                        iconColor="#F59E0B"
                                        iconBgColor="#FEF3C7"
                                        title="Vibration"
                                        subtitle="Vibrate for notifications"
                                        value={preferences.pushVibrate}
                                        onValueChange={(value) => updatePreferences({ pushVibrate: value })}
                                    />
                                </>
                            )}
                        </View>

                        {/* Quiet Hours */}
                        <SectionHeader title="Quiet Hours" subtitle="Pause notifications during these hours" />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                            <SettingRow
                                icon="moon-waning-crescent"
                                iconColor="#6366F1"
                                iconBgColor="#EDE9FE"
                                title="Quiet Hours"
                                subtitle={preferences.quietHoursEnabled 
                                    ? `${preferences.quietHoursStart} - ${preferences.quietHoursEnd}` 
                                    : 'Not enabled'}
                                value={preferences.quietHoursEnabled}
                                onValueChange={(value) => updatePreferences({ quietHoursEnabled: value })}
                            />
                        </View>

                        {/* Category Settings */}
                        <SectionHeader title="Categories" subtitle="Choose which types to receive" />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                            {NOTIFICATION_CATEGORIES.map((category, index) => (
                                <SettingRow
                                    key={category.id}
                                    icon={category.icon}
                                    iconColor={category.color}
                                    iconBgColor={category.bgColor}
                                    title={category.name}
                                    value={preferences.categories[category.id]?.enabled ?? true}
                                    onValueChange={(value) => toggleCategoryNotifications(category.id, value)}
                                />
                            ))}
                        </View>

                        {/* Smart Features */}
                        <SectionHeader title="Smart Features" subtitle="AI-powered notification management" />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden mb-8">
                            <SettingRow
                                icon="layers-triple"
                                iconColor="#06B6D4"
                                iconBgColor="#CFFAFE"
                                title="Smart Grouping"
                                subtitle="Group similar notifications together"
                                value={preferences.smartGrouping}
                                onValueChange={(value) => updatePreferences({ smartGrouping: value })}
                            />
                            <SettingRow
                                icon="email-newsletter"
                                iconColor="#EC4899"
                                iconBgColor="#FCE7F3"
                                title="Daily Digest"
                                subtitle="Get a summary of notifications each day"
                                value={preferences.dailyDigest}
                                onValueChange={(value) => updatePreferences({ dailyDigest: value })}
                            />
                            <SettingRow
                                icon="calendar-week"
                                iconColor="#8B5CF6"
                                iconBgColor="#EDE9FE"
                                title="Weekly Recap"
                                subtitle="Weekly summary of your progress"
                                value={preferences.weeklyRecap}
                                onValueChange={(value) => updatePreferences({ weeklyRecap: value })}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default NotificationSettings;
