/**
 * Sprint Planning Screen
 * 
 * Facilitates sprint planning ceremony with capacity-based task selection,
 * commitment visualization, and balanced dimension distribution.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { useTaskStore } from '../../../store/taskStore';
import { LIFE_WHEEL_DIMENSIONS } from '../../../types/sensai.types';

interface PlanningTask {
    id: string;
    title: string;
    points: number;
    dimension: string;
    selected: boolean;
}

export default function SprintPlanningScreen() {
    const { currentSprintHealth, velocityMetrics, startCeremony } = useSensAIStore();
    const [step, setStep] = useState<'capacity' | 'select' | 'review' | 'commit'>('capacity');
    const [capacity, setCapacity] = useState(velocityMetrics?.averageCompleted || 40);
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [sprintGoal, setSprintGoal] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    
    // Mock backlog tasks - in real implementation, would come from taskStore
    const [backlogTasks] = useState<PlanningTask[]>([
        { id: '1', title: 'Complete project proposal', points: 5, dimension: 'career', selected: false },
        { id: '2', title: 'Morning workout routine', points: 3, dimension: 'health', selected: false },
        { id: '3', title: 'Family dinner planning', points: 2, dimension: 'family', selected: false },
        { id: '4', title: 'Review investment portfolio', points: 5, dimension: 'finance', selected: false },
        { id: '5', title: 'Read 3 chapters of book', points: 3, dimension: 'growth', selected: false },
        { id: '6', title: 'Coffee with friend', points: 2, dimension: 'social', selected: false },
        { id: '7', title: 'Meditation practice', points: 2, dimension: 'spirit', selected: false },
        { id: '8', title: 'Creative writing session', points: 3, dimension: 'creativity', selected: false },
        { id: '9', title: 'Declutter home office', points: 4, dimension: 'environment', selected: false },
    ]);

    const selectedPoints = backlogTasks
        .filter(t => selectedTasks.includes(t.id))
        .reduce((sum, t) => sum + t.points, 0);

    const capacityUsed = Math.round((selectedPoints / capacity) * 100);
    const isOvercommitted = capacityUsed > 100;

    const dimensionCounts = selectedTasks.reduce((acc, taskId) => {
        const task = backlogTasks.find(t => t.id === taskId);
        if (task) {
            acc[task.dimension] = (acc[task.dimension] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const handleStartPlanning = async () => {
        await startCeremony('planning');
        setIsStarted(true);
    };

    const toggleTaskSelection = (taskId: string) => {
        setSelectedTasks(prev => 
            prev.includes(taskId) 
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const getDimensionColor = (dimension: string) => {
        const dim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dimension);
        return dim?.color || '#6B7280';
    };

    const renderCapacityStep = () => (
        <View className="flex-1 p-4">
            <View className="bg-gray-800 rounded-2xl p-6 mb-6">
                <Text className="text-white text-xl font-semibold mb-2">Set Your Sprint Capacity</Text>
                <Text className="text-gray-400 mb-6">
                    Based on your velocity, I recommend {velocityMetrics?.averageCompleted || 40} points for this sprint.
                </Text>
                
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        onPress={() => setCapacity(Math.max(10, capacity - 5))}
                        className="bg-gray-700 w-12 h-12 rounded-full items-center justify-center"
                    >
                        <MaterialCommunityIcons name="minus" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    <View className="items-center">
                        <Text className="text-white text-4xl font-bold">{capacity}</Text>
                        <Text className="text-gray-400">points</Text>
                    </View>
                    
                    <TouchableOpacity
                        onPress={() => setCapacity(capacity + 5)}
                        className="bg-gray-700 w-12 h-12 rounded-full items-center justify-center"
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {capacity > (velocityMetrics?.averageCompleted || 40) * 1.2 && (
                    <View className="bg-yellow-500/20 p-3 rounded-lg flex-row items-center">
                        <MaterialCommunityIcons name="alert" size={20} color="#EAB308" />
                        <Text className="text-yellow-400 ml-2 flex-1">
                            This is 20%+ above your average. Consider realistic commitments.
                        </Text>
                    </View>
                )}
            </View>

            <View className="bg-gray-800 rounded-2xl p-6">
                <Text className="text-white text-lg font-semibold mb-4">Your Velocity History</Text>
                <View className="flex-row justify-between">
                    <View className="items-center">
                        <Text className="text-gray-400 text-sm">Average</Text>
                        <Text className="text-white text-xl font-bold">{velocityMetrics?.averageCompleted || 38}</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-gray-400 text-sm">Best Sprint</Text>
                        <Text className="text-emerald-400 text-xl font-bold">52</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-gray-400 text-sm">Last Sprint</Text>
                        <Text className="text-white text-xl font-bold">{velocityMetrics?.currentSprintCompleted || 35}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => setStep('select')}
                className="bg-emerald-500 mt-6 p-4 rounded-xl"
            >
                <Text className="text-white text-center font-semibold text-lg">Continue to Task Selection</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSelectStep = () => (
        <View className="flex-1 p-4">
            {/* Capacity indicator */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-semibold">Capacity: {selectedPoints}/{capacity} points</Text>
                    <Text className={isOvercommitted ? 'text-red-400' : 'text-emerald-400'}>
                        {capacityUsed}%
                    </Text>
                </View>
                <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <View 
                        className={`h-full ${isOvercommitted ? 'bg-red-500' : capacityUsed > 85 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(capacityUsed, 100)}%` }}
                    />
                </View>
            </View>

            {/* Dimension balance */}
            <View className="flex-row flex-wrap mb-4">
                {Object.entries(dimensionCounts).map(([dim, count]) => (
                    <View 
                        key={dim}
                        className="px-3 py-1 rounded-full mr-2 mb-2"
                        style={{ backgroundColor: getDimensionColor(dim) + '30' }}
                    >
                        <Text style={{ color: getDimensionColor(dim) }}>{dim}: {count}</Text>
                    </View>
                ))}
            </View>

            {/* Task list */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <Text className="text-gray-400 text-sm mb-3">Select tasks for this sprint:</Text>
                {backlogTasks.map(task => (
                    <TouchableOpacity
                        key={task.id}
                        onPress={() => toggleTaskSelection(task.id)}
                        className={`bg-gray-800 p-4 rounded-xl mb-3 flex-row items-center border-2 ${
                            selectedTasks.includes(task.id) ? 'border-emerald-500' : 'border-transparent'
                        }`}
                    >
                        <View 
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: getDimensionColor(task.dimension) + '30' }}
                        >
                            <MaterialCommunityIcons 
                                name={selectedTasks.includes(task.id) ? 'check' : 'plus'} 
                                size={20} 
                                color={selectedTasks.includes(task.id) ? '#10B981' : getDimensionColor(task.dimension)} 
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-medium">{task.title}</Text>
                            <Text className="text-gray-400 text-sm">{task.dimension}</Text>
                        </View>
                        <View className="bg-gray-700 px-3 py-1 rounded-full">
                            <Text className="text-white font-semibold">{task.points}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="flex-row gap-3 mt-4">
                <TouchableOpacity
                    onPress={() => setStep('capacity')}
                    className="flex-1 bg-gray-700 p-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStep('review')}
                    className="flex-1 bg-emerald-500 p-4 rounded-xl"
                    disabled={selectedTasks.length === 0}
                >
                    <Text className="text-white text-center font-semibold">Review Sprint</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderReviewStep = () => (
        <ScrollView className="flex-1 p-4">
            <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                <Text className="text-white text-xl font-semibold mb-4">Sprint Summary</Text>
                
                <View className="flex-row justify-between mb-4">
                    <View>
                        <Text className="text-gray-400 text-sm">Tasks</Text>
                        <Text className="text-white text-2xl font-bold">{selectedTasks.length}</Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm">Points</Text>
                        <Text className="text-white text-2xl font-bold">{selectedPoints}</Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-sm">Capacity</Text>
                        <Text className={`text-2xl font-bold ${isOvercommitted ? 'text-red-400' : 'text-emerald-400'}`}>
                            {capacityUsed}%
                        </Text>
                    </View>
                </View>

                {isOvercommitted && (
                    <View className="bg-red-500/20 p-4 rounded-xl mb-4">
                        <View className="flex-row items-center mb-2">
                            <MaterialCommunityIcons name="alert-circle" size={24} color="#EF4444" />
                            <Text className="text-red-400 font-semibold ml-2">Overcommitment Warning</Text>
                        </View>
                        <Text className="text-red-300">
                            You've committed to {capacityUsed - 100}% more than your capacity. 
                            Consider removing {Math.ceil((selectedPoints - capacity) / 3)} tasks.
                        </Text>
                    </View>
                )}
            </View>

            <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                <Text className="text-white text-lg font-semibold mb-4">Dimension Balance</Text>
                {LIFE_WHEEL_DIMENSIONS.map(dim => {
                    const count = dimensionCounts[dim.id] || 0;
                    return (
                        <View key={dim.id} className="flex-row items-center mb-3">
                            <View 
                                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                style={{ backgroundColor: dim.color + '30' }}
                            >
                                <MaterialCommunityIcons name={dim.icon as any} size={16} color={dim.color} />
                            </View>
                            <Text className="text-white flex-1">{dim.name}</Text>
                            <View className="flex-row">
                                {[...Array(Math.min(count, 5))].map((_, i) => (
                                    <View 
                                        key={i} 
                                        className="w-3 h-3 rounded-full mr-1"
                                        style={{ backgroundColor: dim.color }}
                                    />
                                ))}
                                {count === 0 && (
                                    <Text className="text-gray-500 text-sm">No tasks</Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                <Text className="text-white text-lg font-semibold mb-3">Sprint Goal</Text>
                <TextInput
                    value={sprintGoal}
                    onChangeText={setSprintGoal}
                    placeholder="What's the main focus of this sprint?"
                    placeholderTextColor="#6B7280"
                    className="bg-gray-700 text-white p-4 rounded-xl"
                    multiline
                />
            </View>

            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={() => setStep('select')}
                    className="flex-1 bg-gray-700 p-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStep('commit')}
                    className="flex-1 bg-emerald-500 p-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">Commit Sprint</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    const renderCommitStep = () => (
        <View className="flex-1 p-4 justify-center items-center">
            <View className="bg-emerald-500/20 w-24 h-24 rounded-full items-center justify-center mb-6">
                <MaterialCommunityIcons name="check-circle" size={64} color="#10B981" />
            </View>
            
            <Text className="text-white text-2xl font-bold mb-2">Sprint Committed!</Text>
            <Text className="text-gray-400 text-center mb-8">
                You've committed to {selectedTasks.length} tasks ({selectedPoints} points) for this sprint.
            </Text>

            {sprintGoal && (
                <View className="bg-gray-800 p-4 rounded-xl mb-6 w-full">
                    <Text className="text-gray-400 text-sm mb-1">Sprint Goal</Text>
                    <Text className="text-white">{sprintGoal}</Text>
                </View>
            )}

            <View className="bg-gray-800 rounded-2xl p-6 w-full mb-6">
                <Text className="text-white font-semibold mb-4">Coach's Notes:</Text>
                <View className="flex-row items-start mb-3">
                    <MaterialCommunityIcons name="lightbulb" size={20} color="#EAB308" />
                    <Text className="text-gray-300 ml-3 flex-1">
                        Focus on completing your highest priority tasks first
                    </Text>
                </View>
                <View className="flex-row items-start mb-3">
                    <MaterialCommunityIcons name="calendar-check" size={20} color="#10B981" />
                    <Text className="text-gray-300 ml-3 flex-1">
                        Daily standups start at your preferred time
                    </Text>
                </View>
                <View className="flex-row items-start">
                    <MaterialCommunityIcons name="shield-check" size={20} color="#3B82F6" />
                    <Text className="text-gray-300 ml-3 flex-1">
                        I'll monitor your progress and intervene if needed
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => router.back()}
                className="bg-emerald-500 w-full p-4 rounded-xl"
            >
                <Text className="text-white text-center font-semibold text-lg">Start Sprint</Text>
            </TouchableOpacity>
        </View>
    );

    if (!isStarted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                {/* Header */}
                <View className="flex-row items-center p-4 border-b border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-semibold">Sprint Planning</Text>
                </View>

                <View className="flex-1 justify-center items-center p-6">
                    <View className="bg-blue-500/20 w-24 h-24 rounded-full items-center justify-center mb-6">
                        <MaterialCommunityIcons name="calendar-plus" size={48} color="#3B82F6" />
                    </View>
                    
                    <Text className="text-white text-2xl font-bold mb-2 text-center">
                        Ready to Plan Your Sprint?
                    </Text>
                    <Text className="text-gray-400 text-center mb-8">
                        Let's select tasks for the upcoming sprint based on your capacity and life balance goals.
                    </Text>

                    <View className="bg-gray-800 rounded-2xl p-6 w-full mb-6">
                        <Text className="text-white font-semibold mb-4">Planning includes:</Text>
                        {[
                            { icon: 'speedometer', text: 'Capacity setting based on velocity' },
                            { icon: 'checkbox-marked', text: 'Task selection from backlog' },
                            { icon: 'chart-donut', text: 'Life dimension balance check' },
                            { icon: 'flag-checkered', text: 'Sprint goal definition' },
                        ].map((item, idx) => (
                            <View key={idx} className="flex-row items-center mb-3">
                                <MaterialCommunityIcons name={item.icon as any} size={20} color="#10B981" />
                                <Text className="text-gray-300 ml-3">{item.text}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleStartPlanning}
                        className="bg-emerald-500 w-full p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold text-lg">Start Planning</Text>
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
                <Text className="text-white text-xl font-semibold flex-1">Sprint Planning</Text>
                
                {/* Step indicator */}
                <View className="flex-row">
                    {['capacity', 'select', 'review', 'commit'].map((s, idx) => (
                        <View 
                            key={s}
                            className={`w-2 h-2 rounded-full mx-1 ${
                                ['capacity', 'select', 'review', 'commit'].indexOf(step) >= idx 
                                    ? 'bg-emerald-500' 
                                    : 'bg-gray-600'
                            }`}
                        />
                    ))}
                </View>
            </View>

            {step === 'capacity' && renderCapacityStep()}
            {step === 'select' && renderSelectStep()}
            {step === 'review' && renderReviewStep()}
            {step === 'commit' && renderCommitStep()}
        </SafeAreaView>
    );
}
