import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationStore } from '../../store/notificationStore';
import { NOTIFICATION_CATEGORIES, NotificationCategory } from '../../types/notification.types';
import { useTranslation } from '../../hooks';

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
    const { t } = useTranslation();
    const { preferences, updatePreferences, toggleCategoryNotifications } = useNotificationStore();

    return (
        <SafeAreaView edges={['top']} className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">{t('notifications.settings.title')}</Text>
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
                        <SectionHeader title={t('notifications.settings.sections.push')} subtitle={t('notifications.settings.sections.pushDesc')} />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                            <SettingRow
                                icon="cellphone-message"
                                iconColor="#3B82F6"
                                iconBgColor="#DBEAFE"
                                title={t('notifications.settings.push')}
                                subtitle={t('notifications.settings.pushSubtitle')}
                                value={preferences.pushEnabled}
                                onValueChange={(value) => updatePreferences({ pushEnabled: value })}
                            />
                            {preferences.pushEnabled && (
                                <>
                                    <SettingRow
                                        icon="volume-high"
                                        iconColor="#10B981"
                                        iconBgColor="#D1FAE5"
                                        title={t('notifications.settings.sound')}
                                        subtitle={t('notifications.settings.soundSubtitle')}
                                        value={preferences.pushSound}
                                        onValueChange={(value) => updatePreferences({ pushSound: value })}
                                    />
                                    <SettingRow
                                        icon="vibrate"
                                        iconColor="#F59E0B"
                                        iconBgColor="#FEF3C7"
                                        title={t('notifications.settings.vibration')}
                                        subtitle={t('notifications.settings.vibrationSubtitle')}
                                        value={preferences.pushVibrate}
                                        onValueChange={(value) => updatePreferences({ pushVibrate: value })}
                                    />
                                </>
                            )}
                        </View>

                        {/* Quiet Hours */}
                        <SectionHeader title={t('notifications.settings.sections.quietHours')} subtitle={t('notifications.settings.sections.quietHoursDesc')} />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden">
                            <SettingRow
                                icon="moon-waning-crescent"
                                iconColor="#6366F1"
                                iconBgColor="#EDE9FE"
                                title={t('notifications.settings.quietHours.title')}
                                subtitle={preferences.quietHoursEnabled 
                                    ? `${preferences.quietHoursStart} - ${preferences.quietHoursEnd}` 
                                    : t('notifications.settings.quietHours.notEnabled')}
                                value={preferences.quietHoursEnabled}
                                onValueChange={(value) => updatePreferences({ quietHoursEnabled: value })}
                            />
                        </View>

                        {/* Category Settings */}
                        <SectionHeader title={t('notifications.settings.sections.categories')} subtitle={t('notifications.settings.sections.categoriesDesc')} />
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
                        <SectionHeader title={t('notifications.settings.sections.smart')} subtitle={t('notifications.settings.sections.smartDesc')} />
                        <View className="bg-white mx-4 rounded-2xl overflow-hidden mb-8">
                            <SettingRow
                                icon="layers-triple"
                                iconColor="#06B6D4"
                                iconBgColor="#CFFAFE"
                                title={t('notifications.settings.smart.grouping')}
                                subtitle={t('notifications.settings.smart.groupingSubtitle')}
                                value={preferences.smartGrouping}
                                onValueChange={(value) => updatePreferences({ smartGrouping: value })}
                            />
                            <SettingRow
                                icon="email-newsletter"
                                iconColor="#EC4899"
                                iconBgColor="#FCE7F3"
                                title={t('notifications.settings.smart.dailyDigest')}
                                subtitle={t('notifications.settings.smart.dailyDigestSubtitle')}
                                value={preferences.dailyDigest}
                                onValueChange={(value) => updatePreferences({ dailyDigest: value })}
                            />
                            <SettingRow
                                icon="calendar-week"
                                iconColor="#8B5CF6"
                                iconBgColor="#EDE9FE"
                                title={t('notifications.settings.smart.weeklyRecap')}
                                subtitle={t('notifications.settings.smart.weeklyRecapSubtitle')}
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
