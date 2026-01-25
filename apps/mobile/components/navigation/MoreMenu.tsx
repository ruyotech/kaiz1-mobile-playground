import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { MORE_MENUS } from '../../utils/navigationConfig';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

export function MoreMenu() {
    const { isMoreMenuOpen, toggleMoreMenu, currentApp } = useNavigationStore();
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
