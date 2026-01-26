import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigationStore } from '../../store/navigationStore';

// Essentia quick access tabs for internal navigation within the app
const TABS = [
    { id: 'today', label: 'Today', icon: 'book-open-page-variant', route: '/essentia' },
    { id: 'explore', label: 'Explore', icon: 'compass-outline', route: '/essentia/explore' },
    { id: 'library', label: 'Library', icon: 'bookshelf', route: '/essentia/library' },
];

export function EssentiaTabBar() {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const { toggleMoreMenu } = useNavigationStore();

    const isActive = (route: string) => {
        if (route === '/essentia') {
            return pathname === '/(tabs)/essentia' || pathname === '/essentia';
        }
        return pathname.includes(route);
    };

    return (
        <View 
            className="bg-white/95 backdrop-blur-lg border-t border-gray-100 flex-row items-center justify-around"
            style={{ paddingBottom: Math.max(insets.bottom, 8), paddingTop: 10 }}
        >
            {TABS.map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => router.push(`/(tabs)${tab.route}` as any)}
                    className="items-center py-2 px-5"
                    activeOpacity={0.7}
                >
                    <View 
                        className={`w-10 h-10 rounded-xl items-center justify-center ${
                            isActive(tab.route) ? 'bg-purple-100' : 'bg-transparent'
                        }`}
                    >
                        <MaterialCommunityIcons
                            name={tab.icon as any}
                            size={24}
                            color={isActive(tab.route) ? '#8B5CF6' : '#9CA3AF'}
                        />
                    </View>
                    <Text 
                        className={`text-[10px] mt-1 font-semibold ${
                            isActive(tab.route) ? 'text-purple-600' : 'text-gray-500'
                        }`}
                    >
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
            
            {/* More Menu Button */}
            <TouchableOpacity
                onPress={toggleMoreMenu}
                className="items-center py-2 px-5"
                activeOpacity={0.7}
            >
                <View className="w-10 h-10 rounded-xl items-center justify-center bg-purple-50">
                    <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={24}
                        color="#8B5CF6"
                    />
                </View>
                <Text className="text-[10px] mt-1 font-semibold text-purple-600">
                    More
                </Text>
            </TouchableOpacity>
        </View>
    );
}
