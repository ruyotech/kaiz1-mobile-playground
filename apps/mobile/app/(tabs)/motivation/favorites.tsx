import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useMindsetStore } from '../../../store/mindsetStore';
import { MindsetContent } from '../../../types/models';

export default function FavoritesScreen() {
    const router = useRouter();
    const { allContent, favorites, toggleFavorite } = useMindsetStore();
    const [favoriteContent, setFavoriteContent] = useState<MindsetContent[]>([]);

    useEffect(() => {
        const favContent = allContent.filter((c) => favorites.includes(c.id));
        setFavoriteContent(favContent);
    }, [favorites, allContent]);

    const handleRemoveFavorite = (contentId: string) => {
        Alert.alert(
            'Remove from Favorites',
            'Are you sure you want to remove this from your collection?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => toggleFavorite(contentId),
                },
            ]
        );
    };

    const getDimensionLabel = (tag: string): string => {
        const labels: Record<string, string> = {
            'lw-1': '💪 Health & Fitness',
            'lw-2': '💼 Career & Work',
            'lw-3': '💰 Finance & Money',
            'lw-4': '📚 Personal Growth',
            'lw-5': '❤️ Relationships & Family',
            'lw-6': '👥 Social Life',
            'lw-7': '🎮 Fun & Recreation',
            'lw-8': '🏡 Environment & Home',
            'q2_growth': '📈 Q2 Growth',
            'generic': '✨ Universal',
        };
        return labels[tag] || '';
    };

    return (
        <Container>
            <ScreenHeader
                title="Favorites"
                subtitle={`${favoriteContent.length} saved`}
                showBack
            />

            <ScrollView className="flex-1 px-4">
                {favoriteContent.length === 0 ? (
                    <EmptyState
                        icon="heart-outline"
                        title="No Favorites Yet"
                        message="Long press any mindset card and add it to your collection"
                    />
                ) : (
                    <View className="py-4 gap-3">
                        {favoriteContent.map((content) => (
                            <Card key={content.id} className="p-4">
                                {/* Header */}
                                <View className="flex-row items-start justify-between mb-3">
                                    <View className="flex-1">
                                        {content.dimensionTag !== 'generic' && (
                                            <Text className="text-xs text-gray-500 mb-1">
                                                {getDimensionLabel(content.dimensionTag)}
                                            </Text>
                                        )}
                                        <Text className="text-gray-900 font-semibold leading-6">
                                            {content.body}
                                        </Text>
                                        {content.author && (
                                            <Text className="text-gray-600 text-sm mt-2 italic">
                                                — {content.author}
                                            </Text>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => handleRemoveFavorite(content.id)}
                                        className="ml-2"
                                    >
                                        <MaterialCommunityIcons
                                            name="heart"
                                            size={24}
                                            color="#EF4444"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Metadata */}
                                <View className="flex-row items-center gap-3 pt-3 border-t border-gray-100">
                                    <View className="px-2 py-1 bg-gray-100 rounded">
                                        <Text className="text-xs text-gray-600">
                                            {content.themePreset}
                                        </Text>
                                    </View>
                                    {content.emotionalTone && (
                                        <View className="px-2 py-1 bg-blue-50 rounded">
                                            <Text className="text-xs text-blue-700">
                                                {content.emotionalTone}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </Card>
                        ))}
                    </View>
                )}
            </ScrollView>
        </Container>
    );
}
