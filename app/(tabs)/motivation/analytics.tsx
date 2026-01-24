import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { useMindsetStore } from '../../../store/mindsetStore';

export default function AnalyticsScreen() {
    const { allContent, favorites, feedContent, totalDwellTime } = useMindsetStore();
    const [stats, setStats] = useState({
        totalViewed: 0,
        totalFavorites: 0,
        avgDwellTime: 0,
        dimensionBreakdown: [] as { dimension: string; count: number; label: string }[],
        topContent: [] as any[],
    });

    useEffect(() => {
        calculateStats();
    }, [allContent, favorites, totalDwellTime]);

    const calculateStats = () => {
        // Count viewed content (those with dwell time)
        const viewedContent = allContent.filter((c) => (c.dwellTimeMs || 0) > 0);
        const totalViewed = viewedContent.length;

        // Average dwell time
        const totalMs = viewedContent.reduce((sum, c) => sum + (c.dwellTimeMs || 0), 0);
        const avgDwellTime = totalViewed > 0 ? Math.round(totalMs / totalViewed / 1000) : 0;

        // Dimension breakdown
        const dimensionCounts: Record<string, number> = {};
        viewedContent.forEach((c) => {
            dimensionCounts[c.dimensionTag] = (dimensionCounts[c.dimensionTag] || 0) + 1;
        });

        const dimensionBreakdown = Object.entries(dimensionCounts)
            .map(([dimension, count]) => ({
                dimension,
                count,
                label: getDimensionLabel(dimension),
            }))
            .sort((a, b) => b.count - a.count);

        // Top content by dwell time
        const topContent = [...viewedContent]
            .sort((a, b) => (b.dwellTimeMs || 0) - (a.dwellTimeMs || 0))
            .slice(0, 5);

        setStats({
            totalViewed,
            totalFavorites: favorites.length,
            avgDwellTime,
            dimensionBreakdown,
            topContent,
        });
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
        return labels[tag] || tag;
    };

    const formatDwellTime = (ms: number) => {
        const seconds = Math.round(ms / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <Container>
            <ScreenHeader
                title="Analytics"
                subtitle="Your mindset engagement"
                showBack
            />

            <ScrollView className="flex-1 px-4 py-4">
                {/* Overview Stats */}
                <View className="flex-row gap-3 mb-4">
                    <Card className="flex-1 p-4 items-center">
                        <MaterialCommunityIcons name="eye" size={24} color="#3B82F6" />
                        <Text className="text-2xl font-bold text-gray-900 mt-2">
                            {stats.totalViewed}
                        </Text>
                        <Text className="text-xs text-gray-600">Viewed</Text>
                    </Card>

                    <Card className="flex-1 p-4 items-center">
                        <MaterialCommunityIcons name="heart" size={24} color="#EF4444" />
                        <Text className="text-2xl font-bold text-gray-900 mt-2">
                            {stats.totalFavorites}
                        </Text>
                        <Text className="text-xs text-gray-600">Favorites</Text>
                    </Card>

                    <Card className="flex-1 p-4 items-center">
                        <MaterialCommunityIcons name="clock-outline" size={24} color="#F59E0B" />
                        <Text className="text-2xl font-bold text-gray-900 mt-2">
                            {stats.avgDwellTime}s
                        </Text>
                        <Text className="text-xs text-gray-600">Avg Time</Text>
                    </Card>
                </View>

                {/* Dimension Breakdown */}
                <Card className="p-4 mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-4">
                        Content by Life Wheel
                    </Text>

                    {stats.dimensionBreakdown.length === 0 ? (
                        <Text className="text-sm text-gray-500 text-center py-4">
                            No data yet. Start viewing content!
                        </Text>
                    ) : (
                        <View className="gap-3">
                            {stats.dimensionBreakdown.map((item) => (
                                <View key={item.dimension}>
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text className="text-sm font-medium text-gray-700">
                                            {item.label}
                                        </Text>
                                        <Text className="text-sm text-gray-600">{item.count}</Text>
                                    </View>
                                    <ProgressBar
                                        progress={(item.count / stats.totalViewed) * 100}
                                        color="#3B82F6"
                                    />
                                </View>
                            ))}
                        </View>
                    )}
                </Card>

                {/* Most Engaged Content */}
                {stats.topContent.length > 0 && (
                    <Card className="p-4 mb-4">
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            Most Engaged Content
                        </Text>

                        <View className="gap-3">
                            {stats.topContent.map((content, index) => (
                                <View
                                    key={content.id}
                                    className="flex-row items-start gap-3 pb-3 border-b border-gray-100"
                                >
                                    <View className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center">
                                        <Text className="text-xs font-bold text-blue-600">
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text
                                            className="text-sm text-gray-900 font-medium mb-1"
                                            numberOfLines={2}
                                        >
                                            {content.body}
                                        </Text>
                                        <View className="flex-row items-center gap-2">
                                            <Text className="text-xs text-gray-500">
                                                {formatDwellTime(content.dwellTimeMs || 0)}
                                            </Text>
                                            {content.isFavorite && (
                                                <MaterialCommunityIcons
                                                    name="heart"
                                                    size={12}
                                                    color="#EF4444"
                                                />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card>
                )}

                {/* Info */}
                <View className="p-4 bg-purple-50 rounded-xl mb-6">
                    <Text className="text-sm text-purple-900">
                        <Text className="font-bold">📊 How it works:</Text> Analytics track your
                        engagement with mindset content. The algorithm uses this data to show you
                        more relevant content for your weak Life Wheel dimensions.
                    </Text>
                </View>
            </ScrollView>
        </Container>
    );
}
