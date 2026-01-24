import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { useMindsetStore } from '../../../store/mindsetStore';

export default function ThemesScreen() {
    const { themes, currentTheme, setCurrentTheme } = useMindsetStore();

    return (
        <Container>
            <ScreenHeader
                title="Themes"
                subtitle="Customize your mindset experience"
                showBack
            />

            <ScrollView className="flex-1 px-4 py-4">
                <View className="gap-4">
                    {themes.map((theme) => {
                        const isActive = theme.id === currentTheme;

                        return (
                            <TouchableOpacity
                                key={theme.id}
                                onPress={() => setCurrentTheme(theme.id)}
                                className={`rounded-2xl overflow-hidden border-4 ${
                                    isActive ? 'border-blue-600' : 'border-transparent'
                                }`}
                                activeOpacity={0.8}
                            >
                                {/* Preview */}
                                <View className="h-40 relative">
                                    {theme.gradientColors && theme.gradientColors.length >= 2 ? (
                                        <LinearGradient
                                            colors={theme.gradientColors as any}
                                            style={{ flex: 1 }}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        />
                                    ) : (
                                        <View
                                            style={{ flex: 1, backgroundColor: theme.backgroundColor }}
                                        />
                                    )}

                                    {/* Preview Text */}
                                    <View className="absolute inset-0 items-center justify-center px-6">
                                        <Text
                                            style={{ color: theme.textColor }}
                                            className="text-2xl font-bold text-center"
                                        >
                                            "{theme.name}"
                                        </Text>
                                    </View>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <View className="absolute top-3 right-3 bg-blue-600 rounded-full p-2">
                                            <MaterialCommunityIcons
                                                name="check"
                                                size={20}
                                                color="white"
                                            />
                                        </View>
                                    )}
                                </View>

                                {/* Details */}
                                <View className="bg-white p-4">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-1">
                                            <Text className="text-base font-bold text-gray-900 mb-1">
                                                {theme.name}
                                            </Text>
                                            <View className="flex-row items-center gap-2">
                                                <View
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: theme.backgroundColor }}
                                                />
                                                <View
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: theme.textColor }}
                                                />
                                                <View
                                                    className="w-4 h-4 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: theme.accentColor }}
                                                />
                                            </View>
                                        </View>

                                        {isActive && (
                                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                                                <Text className="text-xs font-semibold text-blue-600">
                                                    Active
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Info */}
                <View className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <Text className="text-sm text-blue-900">
                        <Text className="font-bold">💡 Tip:</Text> Themes change the visual
                        style of your mindset feed. Choose one that helps you focus and feel
                        inspired.
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}
