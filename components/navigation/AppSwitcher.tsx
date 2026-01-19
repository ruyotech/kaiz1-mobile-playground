import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigationStore } from '../../store/navigationStore';
import { APPS } from '../../utils/navigationConfig';
import { useRouter } from 'expo-router';

export function AppSwitcher() {
    const { isAppSwitcherOpen, toggleAppSwitcher, setCurrentApp } = useNavigationStore();
    const router = useRouter();

    const handleAppSelect = (app: typeof APPS[0]) => {
        setCurrentApp(app.id);
        router.push(app.route as any);
        toggleAppSwitcher();
    };

    return (
        <Modal
            visible={isAppSwitcherOpen}
            transparent
            animationType="fade"
            onRequestClose={toggleAppSwitcher}
        >
            <Pressable
                className="flex-1 bg-black/50 justify-end"
                onPress={toggleAppSwitcher}
            >
                <Pressable className="bg-white rounded-t-3xl p-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-2xl font-bold">Apps</Text>
                        <TouchableOpacity onPress={toggleAppSwitcher}>
                            <MaterialCommunityIcons name="close" size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row flex-wrap">
                        {APPS.map((app) => (
                            <TouchableOpacity
                                key={app.id}
                                className="w-1/3 items-center mb-6"
                                onPress={() => handleAppSelect(app)}
                            >
                                <View
                                    className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                                    style={{ backgroundColor: app.color + '20' }}
                                >
                                    <MaterialCommunityIcons
                                        name={app.icon as any}
                                        size={32}
                                        color={app.color}
                                    />
                                </View>
                                <Text className="text-sm text-center">{app.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}
