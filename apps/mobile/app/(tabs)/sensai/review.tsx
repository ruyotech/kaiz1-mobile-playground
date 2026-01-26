/**
 * Sprint Review Screen
 * 
 * Facilitates sprint review ceremony with achievement celebration,
 * completion analysis, and stakeholder demo preparation.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { LIFE_WHEEL_DIMENSIONS } from '../../../types/sensai.types';

interface CompletedTask {
    id: string;
    title: string;
    points: number;
    dimension: string;
    completedAt: string;
}

export default function SprintReviewScreen() {
    const { currentSprintHealth, velocityMetrics, startCeremony } = useSensAIStore();
    const [isStarted, setIsStarted] = useState(false);
    const [showingDemo, setShowingDemo] = useState(false);
    const [demoIndex, setDemoIndex] = useState(0);

    // Mock completed tasks
    const completedTasks: CompletedTask[] = [
        { id: '1', title: 'Complete project proposal', points: 5, dimension: 'career', completedAt: '2024-01-15' },
        { id: '2', title: 'Morning workout routine (7 days)', points: 7, dimension: 'health', completedAt: '2024-01-18' },
        { id: '3', title: 'Family dinner - weekly', points: 3, dimension: 'family', completedAt: '2024-01-14' },
        { id: '4', title: 'Read "Atomic Habits"', points: 5, dimension: 'growth', completedAt: '2024-01-17' },
        { id: '5', title: 'Meditation streak (5 days)', points: 5, dimension: 'spirit', completedAt: '2024-01-18' },
    ];

    // Mock incomplete tasks
    const incompleteTasks = [
        { id: '6', title: 'Review investment portfolio', points: 5, dimension: 'finance', reason: 'Waiting on documents' },
        { id: '7', title: 'Declutter garage', points: 4, dimension: 'environment', reason: 'Ran out of time' },
    ];

    const totalCompleted = completedTasks.reduce((sum, t) => sum + t.points, 0);
    const totalPlanned = totalCompleted + incompleteTasks.reduce((sum, t) => sum + t.points, 0);
    const completionRate = Math.round((totalCompleted / totalPlanned) * 100);

    const getDimensionColor = (dimension: string) => {
        const dim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dimension);
        return dim?.color || '#6B7280';
    };

    const getDimensionIcon = (dimension: string) => {
        const dim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dimension);
        return dim?.icon || 'circle';
    };

    const handleStartReview = async () => {
        await startCeremony('review');
        setIsStarted(true);
    };

    const celebrationMessages = [
        "🎉 Incredible work this sprint!",
        "💪 You crushed your health goals!",
        "📚 Knowledge growth is real growth!",
        "🧘 Your mindfulness practice is paying off!",
    ];

    if (!isStarted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                {/* Header */}
                <View className="flex-row items-center p-4 border-b border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-semibold">Sprint Review</Text>
                </View>

                <View className="flex-1 justify-center items-center p-6">
                    <View className="bg-purple-500/20 w-24 h-24 rounded-full items-center justify-center mb-6">
                        <MaterialCommunityIcons name="presentation" size={48} color="#A855F7" />
                    </View>
                    
                    <Text className="text-white text-2xl font-bold mb-2 text-center">
                        Time to Celebrate!
                    </Text>
                    <Text className="text-gray-400 text-center mb-8">
                        Let's review what you've accomplished this sprint and celebrate your wins.
                    </Text>

                    <View className="bg-gray-800 rounded-2xl p-6 w-full mb-6">
                        <Text className="text-white font-semibold mb-4">Sprint Review includes:</Text>
                        {[
                            { icon: 'trophy', text: 'Celebrate completed achievements', color: '#F59E0B' },
                            { icon: 'chart-line', text: 'Analyze velocity & completion rate', color: '#3B82F6' },
                            { icon: 'magnify', text: 'Review incomplete items', color: '#EF4444' },
                            { icon: 'lightbulb', text: 'Gather insights for next sprint', color: '#10B981' },
                        ].map((item, idx) => (
                            <View key={idx} className="flex-row items-center mb-3">
                                <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                                <Text className="text-gray-300 ml-3">{item.text}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleStartReview}
                        className="bg-purple-500 w-full p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold text-lg">Start Review</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-semibold">Sprint Review</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Sprint Stats */}
                <View className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-4 border border-purple-500/30">
                    <View className="items-center mb-4">
                        <Text className="text-4xl mb-2">🏆</Text>
                        <Text className="text-white text-2xl font-bold">{completionRate}% Complete</Text>
                        <Text className="text-gray-400">{totalCompleted} of {totalPlanned} points delivered</Text>
                    </View>

                    <View className="flex-row justify-around">
                        <View className="items-center">
                            <Text className="text-emerald-400 text-2xl font-bold">{completedTasks.length}</Text>
                            <Text className="text-gray-400 text-sm">Completed</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-red-400 text-2xl font-bold">{incompleteTasks.length}</Text>
                            <Text className="text-gray-400 text-sm">Incomplete</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-blue-400 text-2xl font-bold">
                                {Math.round(totalCompleted / 14)}
                            </Text>
                            <Text className="text-gray-400 text-sm">Pts/Day</Text>
                        </View>
                    </View>
                </View>

                {/* Celebration Message */}
                <View className="bg-emerald-500/20 rounded-2xl p-4 mb-4 border border-emerald-500/30">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="robot" size={24} color="#10B981" />
                        <Text className="text-emerald-400 ml-3 flex-1 font-medium">
                            {celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)]}
                        </Text>
                    </View>
                </View>

                {/* Completed Tasks */}
                <View className="mb-4">
                    <Text className="text-white text-lg font-semibold mb-3">✅ Completed This Sprint</Text>
                    {completedTasks.map(task => (
                        <View 
                            key={task.id}
                            className="bg-gray-800 p-4 rounded-xl mb-2 flex-row items-center"
                        >
                            <View 
                                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: getDimensionColor(task.dimension) + '30' }}
                            >
                                <MaterialCommunityIcons 
                                    name={getDimensionIcon(task.dimension) as any} 
                                    size={20} 
                                    color={getDimensionColor(task.dimension)} 
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-medium">{task.title}</Text>
                                <Text className="text-gray-400 text-sm">{task.dimension}</Text>
                            </View>
                            <View className="bg-emerald-500/20 px-3 py-1 rounded-full">
                                <Text className="text-emerald-400 font-semibold">+{task.points}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Incomplete Tasks */}
                {incompleteTasks.length > 0 && (
                    <View className="mb-4">
                        <Text className="text-white text-lg font-semibold mb-3">⏳ Carried Over</Text>
                        {incompleteTasks.map(task => (
                            <View 
                                key={task.id}
                                className="bg-gray-800 p-4 rounded-xl mb-2 border-l-4 border-yellow-500"
                            >
                                <View className="flex-row items-center mb-2">
                                    <View 
                                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: getDimensionColor(task.dimension) + '30' }}
                                    >
                                        <MaterialCommunityIcons 
                                            name={getDimensionIcon(task.dimension) as any} 
                                            size={16} 
                                            color={getDimensionColor(task.dimension)} 
                                        />
                                    </View>
                                    <Text className="text-white font-medium flex-1">{task.title}</Text>
                                    <Text className="text-gray-500">{task.points} pts</Text>
                                </View>
                                <Text className="text-yellow-400 text-sm ml-11">Reason: {task.reason}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Dimension Analysis */}
                <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                    <Text className="text-white text-lg font-semibold mb-4">Life Dimension Distribution</Text>
                    {LIFE_WHEEL_DIMENSIONS.slice(0, 5).map(dim => {
                        const dimTasks = completedTasks.filter(t => t.dimension === dim.id);
                        const dimPoints = dimTasks.reduce((sum, t) => sum + t.points, 0);
                        const percentage = totalCompleted > 0 ? Math.round((dimPoints / totalCompleted) * 100) : 0;
                        
                        return (
                            <View key={dim.id} className="mb-3">
                                <View className="flex-row justify-between mb-1">
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons name={dim.icon as any} size={16} color={dim.color} />
                                        <Text className="text-white ml-2">{dim.name}</Text>
                                    </View>
                                    <Text className="text-gray-400">{percentage}%</Text>
                                </View>
                                <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <View 
                                        className="h-full"
                                        style={{ width: `${percentage}%`, backgroundColor: dim.color }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Coach Insights */}
                <View className="bg-gray-800 rounded-2xl p-6 mb-6">
                    <View className="flex-row items-center mb-4">
                        <MaterialCommunityIcons name="robot" size={24} color="#10B981" />
                        <Text className="text-white text-lg font-semibold ml-2">Coach Insights</Text>
                    </View>
                    
                    <View className="space-y-3">
                        <View className="flex-row items-start">
                            <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                            <Text className="text-gray-300 ml-3 flex-1">
                                Strong performance in Health dimension - keep the momentum!
                            </Text>
                        </View>
                        <View className="flex-row items-start mt-3">
                            <MaterialCommunityIcons name="alert-circle" size={20} color="#F59E0B" />
                            <Text className="text-gray-300 ml-3 flex-1">
                                Finance dimension needs attention next sprint
                            </Text>
                        </View>
                        <View className="flex-row items-start mt-3">
                            <MaterialCommunityIcons name="lightbulb" size={20} color="#3B82F6" />
                            <Text className="text-gray-300 ml-3 flex-1">
                                Consider reducing planned points by 5 for better completion rate
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mb-6">
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/sensai/retrospective')}
                        className="flex-1 bg-gray-700 p-4 rounded-xl flex-row items-center justify-center"
                    >
                        <MaterialCommunityIcons name="thought-bubble" size={20} color="#fff" />
                        <Text className="text-white font-semibold ml-2">Start Retro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-1 bg-emerald-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold">Done</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
