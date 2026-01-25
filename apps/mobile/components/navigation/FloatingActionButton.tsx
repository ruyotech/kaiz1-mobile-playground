import { View, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export function FloatingActionButton() {
    const router = useRouter();

    const handlePress = () => {
        router.push('/(tabs)/command-center');
    };

    return (
        <View className="absolute bottom-20 right-6">
            <TouchableOpacity
                onPress={handlePress}
                className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                }}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}
