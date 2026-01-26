/**
 * SensAI Velocity Screen
 * 
 * Detailed velocity analytics and history.
 */

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { VelocityCard } from '../../../components/sensai';

export default function VelocityScreen() {
    const router = useRouter();
    const {
        velocityMetrics,
        loading,
        calculateVelocity,
    } = useSensAIStore();

    const [refreshing, setRefreshing] = React.useState(false);
    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        calculateVelocity();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await calculateVelocity();
        setRefreshing(false);
    };

    const chartHeight = 150;
    const maxVelocity = velocityMetrics 
        ? Math.max(...velocityMetrics.velocityHistory.map(v => Math.max(v.committedPoints, v.completedPoints)), 1)
        : 1;

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900 ml-4">Velocity</Text>
            </View>

            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Main Velocity Card */}
                {velocityMetrics && (
                    <View className="px-4 pt-4">
                        <VelocityCard metrics={velocityMetrics} showChart={true} />
                    </View>
                )}

                {/* Velocity Explanation */}
                <View className="px-4 mt-6">
                    <View className="bg-blue-50 rounded-xl p-4">
                        <View className="flex-row items-start">
                            <MaterialCommunityIcons name="information" size={20} color="#3B82F6" />
                            <View className="ml-3 flex-1">
                                <Text className="text-sm font-semibold text-blue-900">What is Velocity?</Text>
                                <Text className="text-xs text-blue-700 mt-1">
                                    Velocity is the average story points you complete per sprint, 
                                    calculated from your last 4 sprints. It helps predict what you 
                                    can realistically accomplish.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Detailed Sprint History */}
                <View className="px-4 mt-6">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Sprint History</Text>
                    
                    {/* Chart */}
                    {velocityMetrics && velocityMetrics.velocityHistory.length > 0 && (
                        <View className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
                            <View className="flex-row items-center mb-4">
                                <View className="flex-row items-center mr-6">
                                    <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                                    <Text className="text-xs text-gray-600">Committed</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                                    <Text className="text-xs text-gray-600">Completed</Text>
                                </View>
                            </View>
                            
                            <View className="flex-row items-end justify-between" style={{ height: chartHeight }}>
                                {velocityMetrics.velocityHistory.slice(-8).map((sprint, index) => {
                                    const committedHeight = (sprint.committedPoints / maxVelocity) * chartHeight;
                                    const completedHeight = (sprint.completedPoints / maxVelocity) * chartHeight;
                                    
                                    return (
                                        <View key={sprint.sprintId} className="items-center flex-1 mx-1">
                                            <View className="flex-row items-end h-full">
                                                <View 
                                                    className="w-3 bg-blue-300 rounded-t mr-0.5"
                                                    style={{ height: Math.max(committedHeight, 4) }}
                                                />
                                                <View 
                                                    className="w-3 bg-green-500 rounded-t"
                                                    style={{ height: Math.max(completedHeight, 4) }}
                                                />
                                            </View>
                                            <Text className="text-[9px] text-gray-400 mt-2">
                                                W{sprint.weekNumber}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )}

                    {/* Sprint Details List */}
                    {velocityMetrics?.velocityHistory.slice().reverse().map((sprint) => (
                        <View 
                            key={sprint.sprintId}
                            className="bg-white rounded-xl p-4 border border-gray-100 mb-3"
                        >
                            <View className="flex-row items-center justify-between mb-3">
                                <View>
                                    <Text className="text-base font-semibold text-gray-900">
                                        Week {sprint.weekNumber}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        {new Date(sprint.startDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })} - {new Date(sprint.endDate).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric' 
                                        })}
                                    </Text>
                                </View>
                                <View className={`px-3 py-1 rounded-full ${
                                    sprint.completionRate >= 90 ? 'bg-green-100' :
                                    sprint.completionRate >= 70 ? 'bg-amber-100' : 'bg-red-100'
                                }`}>
                                    <Text className={`text-sm font-semibold ${
                                        sprint.completionRate >= 90 ? 'text-green-700' :
                                        sprint.completionRate >= 70 ? 'text-amber-700' : 'text-red-700'
                                    }`}>
                                        {sprint.completionRate.toFixed(0)}%
                                    </Text>
                                </View>
                            </View>
                            
                            <View className="flex-row">
                                <View className="flex-1 items-center">
                                    <Text className="text-xs text-gray-500">Committed</Text>
                                    <Text className="text-lg font-bold text-blue-600">{sprint.committedPoints}</Text>
                                </View>
                                <View className="flex-1 items-center border-l border-r border-gray-100">
                                    <Text className="text-xs text-gray-500">Completed</Text>
                                    <Text className="text-lg font-bold text-green-600">{sprint.completedPoints}</Text>
                                </View>
                                <View className="flex-1 items-center">
                                    <Text className="text-xs text-gray-500">Delta</Text>
                                    <Text className={`text-lg font-bold ${
                                        sprint.completedPoints >= sprint.committedPoints ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {sprint.completedPoints >= sprint.committedPoints ? '+' : ''}
                                        {sprint.completedPoints - sprint.committedPoints}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Velocity Tips */}
                <View className="px-4 mt-4 mb-8">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Improve Your Velocity</Text>
                    
                    <View className="bg-white rounded-xl border border-gray-100">
                        {[
                            { icon: 'target', title: 'Plan realistically', desc: 'Commit to what you can actually complete' },
                            { icon: 'clock-outline', title: 'Protect focus time', desc: 'Block uninterrupted work sessions' },
                            { icon: 'format-list-checks', title: 'Break down tasks', desc: 'Smaller tasks = faster completion' },
                            { icon: 'chart-line', title: 'Track consistently', desc: 'Log progress daily for accurate data' },
                        ].map((tip, index) => (
                            <View 
                                key={index}
                                className={`flex-row items-center p-4 ${
                                    index < 3 ? 'border-b border-gray-100' : ''
                                }`}
                            >
                                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                                    <MaterialCommunityIcons name={tip.icon as any} size={20} color="#3B82F6" />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-sm font-medium text-gray-900">{tip.title}</Text>
                                    <Text className="text-xs text-gray-500">{tip.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
