import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../components/layout/Container';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useRouter } from 'expo-router';
import { useTranslation } from '../hooks';

// Settings menu item component
function SettingsMenuItem({ 
    icon, 
    iconColor, 
    iconBgColor, 
    title, 
    subtitle, 
    badge, 
    onPress 
}: {
    icon: string;
    iconColor: string;
    iconBgColor: string;
    title: string;
    subtitle?: string;
    badge?: number;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="flex-row items-center py-3 border-b border-gray-100"
            activeOpacity={0.7}
        >
            <View 
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: iconBgColor }}
            >
                <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
            </View>
            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">{title}</Text>
                {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
            </View>
            <View className="flex-row items-center">
                {badge !== undefined && badge > 0 && (
                    <View className="bg-red-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5 mr-2">
                        <Text className="text-xs font-bold text-white">{badge}</Text>
                    </View>
                )}
                <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </View>
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user, logout } = useAuthStore();
    const { unreadCount } = useNotificationStore();

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    if (!user) return null;

    return (
        <Container>
            <ScreenHeader title={t('profile.title')} showBack showNotifications={false} />

            <ScrollView className="flex-1 p-4">
                {/* User Info */}
                <Card className="mb-4">
                    <View className="items-center mb-4">
                        <Avatar name={user.fullName} size="lg" />
                        <Text className="text-2xl font-bold mt-3">{user.fullName}</Text>
                        <Text className="text-gray-600">{user.email}</Text>
                    </View>

                    <View className="border-t border-gray-200 pt-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Account Type</Text>
                            <Text className="font-semibold capitalize">{user.accountType.replace('_', ' ')}</Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-gray-600">Subscription</Text>
                            <Text className="font-semibold capitalize">{user.subscriptionTier}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Timezone</Text>
                            <Text className="font-semibold">{user.timezone}</Text>
                        </View>
                    </View>
                </Card>

                {/* Settings Section */}
                <Card className="mb-4">
                    <Text className="text-lg font-semibold mb-3">{t('settings.title')}</Text>
                    
                    <SettingsMenuItem
                        icon="bell"
                        iconColor="#3B82F6"
                        iconBgColor="#DBEAFE"
                        title={t('profile.menu.notifications')}
                        subtitle={t('profile.menu.notificationsSubtitle')}
                        badge={unreadCount}
                        onPress={() => router.push('/notification-settings')}
                    />
                    
                    <SettingsMenuItem
                        icon="palette"
                        iconColor="#8B5CF6"
                        iconBgColor="#EDE9FE"
                        title={t('profile.menu.appearance')}
                        subtitle={t('profile.menu.appearanceSubtitle')}
                        onPress={() => router.push('/(tabs)/settings')}
                    />
                    
                    <SettingsMenuItem
                        icon="shield-check"
                        iconColor="#10B981"
                        iconBgColor="#D1FAE5"
                        title={t('profile.menu.privacy')}
                        subtitle={t('profile.menu.privacySubtitle')}
                        onPress={() => router.push('/(tabs)/settings')}
                    />
                    
                    <SettingsMenuItem
                        icon="help-circle"
                        iconColor="#F59E0B"
                        iconBgColor="#FEF3C7"
                        title={t('profile.menu.help')}
                        subtitle={t('profile.menu.helpSubtitle')}
                        onPress={() => router.push('/(tabs)/settings')}
                    />
                </Card>

                {/* Stats */}
                <Card className="mb-4">
                    <Text className="text-lg font-semibold mb-3">Your Stats</Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Total Tasks</Text>
                        <Text className="font-semibold">49</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Completed Points</Text>
                        <Text className="font-semibold">213</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-600">Active Challenges</Text>
                        <Text className="font-semibold">3</Text>
                    </View>
                </Card>

                {/* Actions */}
                <Button onPress={handleLogout} variant="outline" fullWidth>
                    Sign Out
                </Button>
            </ScrollView>
        </Container>
    );
}
