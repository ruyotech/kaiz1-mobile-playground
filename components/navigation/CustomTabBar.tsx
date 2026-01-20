import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { NAV_CONFIGS } from '../../utils/navigationConfig';
import { useRouter, usePathname } from 'expo-router';
import { AppSwitcher } from './AppSwitcher';
import { MoreMenu } from './MoreMenu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export function CustomTabBar() {
    const { currentApp, toggleAppSwitcher, toggleMoreMenu } = useNavigationStore();
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const icons = NAV_CONFIGS[currentApp];

    const handleIconPress = (route: string) => {
        if (route === 'more') {
            toggleMoreMenu();
        } else {
            router.push(route as any);
        }
    };

    const isActive = (route: string) => {
        if (route === 'more') return false;
        return pathname.startsWith(route);
    };

    // Get main and more icons for the current app
    const mainIcon = icons[0]; // First icon is the main one (e.g., Sprint, Daily)
    const moreIcon = icons[icons.length - 1]; // Last icon is always More

    return (
        <>
            <BlurView
                intensity={80}
                tint="light"
                className="border-t border-gray-200/50"
                style={{ paddingBottom: insets.bottom }}
            >
                <View className="flex-row items-center justify-around px-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    {/* 1. Apps Icon (Far Left) */}
                    <TouchableOpacity
                        className="items-center py-2 px-3 flex-1"
                        onPress={toggleAppSwitcher}
                    >
                        <MaterialCommunityIcons
                            name="apps"
                            size={24}
                            color="#9CA3AF"
                        />
                        <Text className="text-xs mt-1 text-gray-600">Apps</Text>
                    </TouchableOpacity>

                    {/* 2. Main App Icon (2nd from left) */}
                    <TouchableOpacity
                        className="items-center py-2 px-3 flex-1"
                        onPress={() => handleIconPress(mainIcon.route)}
                    >
                        <MaterialCommunityIcons
                            name={mainIcon.icon as any}
                            size={24}
                            color={isActive(mainIcon.route) ? '#3B82F6' : '#9CA3AF'}
                        />
                        <Text
                            className="text-xs mt-1"
                            style={{ color: isActive(mainIcon.route) ? '#3B82F6' : '#9CA3AF' }}
                        >
                            {mainIcon.name}
                        </Text>
                    </TouchableOpacity>

                    {/* 3. More Icon (3rd from left) */}
                    <TouchableOpacity
                        className="items-center py-2 px-3 flex-1"
                        onPress={() => handleIconPress(moreIcon.route)}
                    >
                        <MaterialCommunityIcons
                            name={moreIcon.icon as any}
                            size={24}
                            color="#9CA3AF"
                        />
                        <Text className="text-xs mt-1 text-gray-600">
                            {moreIcon.name}
                        </Text>
                    </TouchableOpacity>

                    {/* 4. Command Center Icon (Far Right) */}
                    <TouchableOpacity
                        className="items-center py-2 px-3 flex-1"
                        onPress={() => router.push('/(tabs)/command-center')}
                    >
                        <MaterialCommunityIcons
                            name="plus-circle"
                            size={24}
                            color={pathname.startsWith('/(tabs)/command-center') ? '#3B82F6' : '#9CA3AF'}
                        />
                        <Text
                            className="text-xs mt-1"
                            style={{ color: pathname.startsWith('/(tabs)/command-center') ? '#3B82F6' : '#9CA3AF' }}
                        >
                            Command
                        </Text>
                    </TouchableOpacity>
                </View>
            </BlurView>

            <AppSwitcher />
            <MoreMenu />
        </>
    );
}
