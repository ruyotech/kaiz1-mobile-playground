import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { useNotificationStore } from '../../store/notificationStore';
import { MORE_MENUS } from '../../utils/navigationConfig';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export function MoreMenu() {
    const { isMoreMenuOpen, toggleMoreMenu, currentApp } = useNavigationStore();
    const { unreadCount } = useNotificationStore();
    const router = useRouter();

    const menuItems = MORE_MENUS[currentApp];

    const handleItemPress = (route: string) => {
        router.push(route as any);
        toggleMoreMenu();
    };

    return (
        <Modal
            visible={isMoreMenuOpen}
            transparent
            animationType="fade"
            onRequestClose={toggleMoreMenu}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={toggleMoreMenu}
            >
                <Pressable className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-2xl font-bold">More Options</Text>
                        <TouchableOpacity onPress={toggleMoreMenu}>
                            <MaterialCommunityIcons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* Notifications Quick Access */}
                    <TouchableOpacity
                        className="flex-row items-center py-4 mb-2 bg-blue-50 rounded-2xl px-4"
                        onPress={() => handleItemPress('/notifications')}
                    >
                        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3 relative">
                            <MaterialCommunityIcons
                                name={unreadCount > 0 ? 'bell-ring' : 'bell-outline'}
                                size={20}
                                color="#3B82F6"
                            />
                            {unreadCount > 0 && (
                                <View className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 rounded-full items-center justify-center px-1">
                                    <Text className="text-[9px] font-bold text-white">
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-semibold text-blue-900">Notifications</Text>
                            {unreadCount > 0 && (
                                <Text className="text-xs text-blue-600">{unreadCount} unread</Text>
                            )}
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#3B82F6" />
                    </TouchableOpacity>

                    <View className="h-px bg-gray-100 mb-2" />

                    <View>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center py-4 border-b border-gray-100"
                                onPress={() => handleItemPress(item.route)}
                            >
                                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mr-3">
                                    <MaterialCommunityIcons
                                        name={item.icon as any}
                                        size={20}
                                        color="#3B82F6"
                                    />
                                </View>
                                <Text className="text-base flex-1">{item.name}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
