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

    return (
        <>
            <BlurView
                intensity={80}
                tint="light"
                className="border-t border-gray-200/50"
                style={{ paddingBottom: insets.bottom }}
            >
                <View className="flex-row items-center px-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                    {/* Left 4 Icons */}
                    <View className="flex-1 flex-row justify-around">
                        {icons.map((icon, index) => {
                            const active = isActive(icon.route);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    className="items-center py-2 px-3"
                                    onPress={() => handleIconPress(icon.route)}
                                >
                                    <MaterialCommunityIcons
                                        name={icon.icon as any}
                                        size={24}
                                        color={active ? '#3B82F6' : '#9CA3AF'}
                                    />
                                    <Text
                                        className="text-xs mt-1"
                                        style={{ color: active ? '#3B82F6' : '#9CA3AF' }}
                                    >
                                        {icon.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Separator */}
                    <View className="h-12 w-px bg-gray-300/50 mx-2" />

                    {/* Right App Switcher Icon with relative positioning for + button */}
                    <View className="relative">
                        {/* Floating + button on top of app switcher */}
                        <View className="absolute -top-8 left-1/2 -ml-6 z-10">
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/command-center')}
                                style={{
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                }}
                            >
                                <BlurView
                                    intensity={80}
                                    tint="light"
                                    className="w-12 h-12 rounded-full items-center justify-center overflow-hidden"
                                    style={{ backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                                >
                                    <MaterialCommunityIcons name="plus" size={28} color="#3B82F6" />
                                </BlurView>
                            </TouchableOpacity>
                        </View>

                        {/* App switcher button */}
                        <TouchableOpacity
                            className="items-center py-2 px-4"
                            onPress={toggleAppSwitcher}
                        >
                            <MaterialCommunityIcons
                                name="apps"
                                size={24}
                                color="#9CA3AF"
                            />
                            <Text className="text-xs mt-1 text-gray-600">Apps</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>

            <AppSwitcher />
            <MoreMenu />
        </>
    );
}
