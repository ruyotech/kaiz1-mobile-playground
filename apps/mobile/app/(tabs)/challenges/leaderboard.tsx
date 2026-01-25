import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface LeaderboardEntry {
    rank: number;
    userId: string;
    name: string;
    avatar?: string;
    points: number;
    challengesCompleted: number;
    currentStreak: number;
}

export default function LeaderboardScreen() {
    const router = useRouter();
    const [timeframe, setTimeframe] = useState<'week' | 'month' | 'allTime'>('week');
    
    // Mock leaderboard data
    const leaderboardData: LeaderboardEntry[] = [
        {
            rank: 1,
            userId: 'user-1',
            name: 'You',
            points: 2850,
            challengesCompleted: 12,
            currentStreak: 45,
        },
        {
            rank: 2,
            userId: 'user-2',
            name: 'Sarah Chen',
            points: 2720,
            challengesCompleted: 11,
            currentStreak: 38,
        },
        {
            rank: 3,
            userId: 'user-3',
            name: 'Mike Johnson',
            points: 2680,
            challengesCompleted: 10,
            currentStreak: 42,
        },
        {
            rank: 4,
            userId: 'user-4',
            name: 'Emma Davis',
            points: 2540,
            challengesCompleted: 9,
            currentStreak: 35,
        },
        {
            rank: 5,
            userId: 'user-5',
            name: 'Alex Kim',
            points: 2420,
            challengesCompleted: 9,
            currentStreak: 30,
        },
    ];
    
    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}`;
    };
    
    const getRankColor = (rank: number) => {
        if (rank === 1) return '#f59e0b';
        if (rank === 2) return '#94a3b8';
        if (rank === 3) return '#cd7f32';
        return '#6b7280';
    };
    
    return (
        <Container safeArea={false}>
            <ScreenHeader
                title="Leaderboard"
                subtitle="Compete and win"
                showBack
                useSafeArea={false}
            />
            
            <ScrollView className="flex-1">
                {/* Timeframe Selector */}
                <View className="flex-row px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <TouchableOpacity
                        onPress={() => setTimeframe('week')}
                        className={`flex-1 py-2 items-center rounded-lg ${
                            timeframe === 'week' ? 'bg-blue-600' : ''
                        }`}
                    >
                        <Text className={`font-semibold ${
                            timeframe === 'week' ? 'text-white' : 'text-gray-600'
                        }`}>
                            This Week
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => setTimeframe('month')}
                        className={`flex-1 py-2 items-center rounded-lg mx-2 ${
                            timeframe === 'month' ? 'bg-blue-600' : ''
                        }`}
                    >
                        <Text className={`font-semibold ${
                            timeframe === 'month' ? 'text-white' : 'text-gray-600'
                        }`}>
                            This Month
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        onPress={() => setTimeframe('allTime')}
                        className={`flex-1 py-2 items-center rounded-lg ${
                            timeframe === 'allTime' ? 'bg-blue-600' : ''
                        }`}
                    >
                        <Text className={`font-semibold ${
                            timeframe === 'allTime' ? 'text-white' : 'text-gray-600'
                        }`}>
                            All Time
                        </Text>
                    </TouchableOpacity>
                </View>
                
                <View className="p-4">
                    {/* Your Stats */}
                    <Card className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold">Your Stats</Text>
                            <Badge variant="success">
                                #{leaderboardData[0].rank}
                            </Badge>
                        </View>
                        <View className="flex-row justify-around">
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-blue-600">
                                    {leaderboardData[0].points}
                                </Text>
                                <Text className="text-gray-600">Points</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-blue-600">
                                    {leaderboardData[0].challengesCompleted}
                                </Text>
                                <Text className="text-gray-600">Completed</Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-2xl font-bold text-blue-600">
                                    {leaderboardData[0].currentStreak}
                                </Text>
                                <Text className="text-gray-600">Day Streak</Text>
                            </View>
                        </View>
                    </Card>
                    
                    {/* Leaderboard List */}
                    <Text className="text-xl font-bold mb-4">Top Performers</Text>
                    
                    {leaderboardData.map((entry, index) => (
                        <Card 
                            key={entry.userId} 
                            className={`mb-3 ${entry.userId === 'user-1' ? 'border-2 border-blue-500' : ''}`}
                        >
                            <View className="flex-row items-center">
                                {/* Rank */}
                                <View 
                                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: getRankColor(entry.rank) + '20' }}
                                >
                                    <Text 
                                        className="text-xl font-bold"
                                        style={{ color: getRankColor(entry.rank) }}
                                    >
                                        {getRankIcon(entry.rank)}
                                    </Text>
                                </View>
                                
                                {/* User Info */}
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-1">
                                        <Text className="text-lg font-bold">
                                            {entry.name}
                                        </Text>
                                        {entry.userId === 'user-1' && (
                                            <View className="ml-2">
                                                <Badge variant="info">
                                                    You
                                                </Badge>
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-row items-center gap-3">
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons 
                                                name="star" 
                                                size={16} 
                                                color="#f59e0b" 
                                            />
                                            <Text className="text-sm text-gray-600 ml-1">
                                                {entry.points}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons 
                                                name="trophy" 
                                                size={16} 
                                                color="#10b981" 
                                            />
                                            <Text className="text-sm text-gray-600 ml-1">
                                                {entry.challengesCompleted}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons 
                                                name="fire" 
                                                size={16} 
                                                color="#ef4444" 
                                            />
                                            <Text className="text-sm text-gray-600 ml-1">
                                                {entry.currentStreak}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    ))}
                    
                    {/* Rewards Section */}
                    <Card className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50">
                        <View className="items-center">
                            <Text className="text-4xl mb-2">🏆</Text>
                            <Text className="text-lg font-bold mb-2">Rewards & Badges</Text>
                            <Text className="text-center text-gray-600 mb-3">
                                Earn badges and unlock rewards as you climb the leaderboard
                            </Text>
                            <View className="flex-row gap-2">
                                <Text className="text-2xl">🥇</Text>
                                <Text className="text-2xl">🥈</Text>
                                <Text className="text-2xl">🥉</Text>
                                <Text className="text-2xl">⭐</Text>
                                <Text className="text-2xl">🔥</Text>
                            </View>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        </Container>
    );
}
