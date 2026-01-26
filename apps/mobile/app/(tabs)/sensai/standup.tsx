/**
 * SensAI Standup Screen
 * 
 * Daily standup ceremony for checking in on progress,
 * identifying blockers, and setting focus for the day.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { SprintHealthCard, CoachMessage } from '../../../components/sensai';
import { StandupTask, StandupBlocker } from '../../../types/sensai.types';

type StandupStep = 'yesterday' | 'today' | 'blockers' | 'summary';

export default function StandupScreen() {
    const router = useRouter();
    const {
        todayStandup,
        currentSprintHealth,
        loading,
        getTodayStandup,
        completeStandup,
        convertBlockerToTask,
    } = useSensAIStore();

    const [step, setStep] = useState<StandupStep>('yesterday');
    const [blockerInput, setBlockerInput] = useState('');
    const [blockers, setBlockers] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'struggling' | null>(null);

    useEffect(() => {
        getTodayStandup();
    }, []);

    const completedYesterday = todayStandup?.completedYesterday || [];
    const focusToday = todayStandup?.focusToday || [];
    const existingBlockers = todayStandup?.blockers || [];

    const handleAddBlocker = () => {
        if (blockerInput.trim()) {
            setBlockers([...blockers, blockerInput.trim()]);
            setBlockerInput('');
        }
    };

    const handleRemoveBlocker = (index: number) => {
        setBlockers(blockers.filter((_, i) => i !== index));
    };

    const handleComplete = async () => {
        await completeStandup(blockers, notes, mood || undefined);
        router.back();
    };

    const renderStepIndicator = () => (
        <View className="flex-row items-center justify-center py-4">
            {['yesterday', 'today', 'blockers', 'summary'].map((s, i) => (
                <View key={s} className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-full items-center justify-center ${
                        step === s ? 'bg-blue-600' : 
                        ['yesterday', 'today', 'blockers', 'summary'].indexOf(step) > i ? 'bg-green-500' : 'bg-gray-200'
                    }`}>
                        {['yesterday', 'today', 'blockers', 'summary'].indexOf(step) > i ? (
                            <MaterialCommunityIcons name="check" size={18} color="white" />
                        ) : (
                            <Text className={step === s ? 'text-white font-bold' : 'text-gray-500'}>{i + 1}</Text>
                        )}
                    </View>
                    {i < 3 && <View className="w-8 h-0.5 bg-gray-200" />}
                </View>
            ))}
        </View>
    );

    const renderYesterdayStep = () => (
        <View className="flex-1">
            <View className="px-4 mb-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">What shipped yesterday?</Text>
                <Text className="text-sm text-gray-500">Review your completed tasks</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {completedYesterday.length > 0 ? (
                    completedYesterday.map((task: StandupTask) => (
                        <View key={task.taskId} className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3">
                            <View className="flex-row items-center">
                                <MaterialCommunityIcons name="check-circle" size={24} color="#10B981" />
                                <View className="flex-1 ml-3">
                                    <Text className="text-base font-medium text-gray-900">{task.title}</Text>
                                    <Text className="text-sm text-gray-500">{task.points} points</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="bg-gray-50 rounded-xl p-6 items-center">
                        <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={40} color="#9CA3AF" />
                        <Text className="text-gray-500 mt-2">No tasks completed yesterday</Text>
                        <Text className="text-sm text-gray-400 mt-1">That's okay, let's focus on today</Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-4 pb-4">
                <TouchableOpacity
                    onPress={() => setStep('today')}
                    className="bg-blue-600 py-4 rounded-xl items-center"
                >
                    <Text className="text-white font-bold text-base">Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderTodayStep = () => (
        <View className="flex-1">
            <View className="px-4 mb-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">What's the focus today?</Text>
                <Text className="text-sm text-gray-500">Your top priorities for the day</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {focusToday.length > 0 ? (
                    focusToday.map((task: StandupTask, index: number) => (
                        <View key={task.taskId} className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                            <View className="flex-row items-center">
                                <View className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                                    <Text className="text-white font-bold">{index + 1}</Text>
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-base font-medium text-gray-900">{task.title}</Text>
                                    <Text className="text-sm text-gray-500">{task.points} points</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View className="bg-amber-50 rounded-xl p-6 items-center">
                        <MaterialCommunityIcons name="calendar-alert" size={40} color="#F59E0B" />
                        <Text className="text-amber-700 mt-2">No tasks planned for today</Text>
                        <Text className="text-sm text-amber-600 mt-1">Consider adding tasks to your sprint</Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-4 pb-4 flex-row">
                <TouchableOpacity
                    onPress={() => setStep('yesterday')}
                    className="flex-1 bg-gray-100 py-4 rounded-xl items-center mr-2"
                >
                    <Text className="text-gray-700 font-medium">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStep('blockers')}
                    className="flex-2 bg-blue-600 py-4 rounded-xl items-center ml-2 flex-1"
                >
                    <Text className="text-white font-bold">Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderBlockersStep = () => (
        <KeyboardAvoidingView 
            className="flex-1" 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View className="px-4 mb-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">Any blockers?</Text>
                <Text className="text-sm text-gray-500">What's slowing you down or stopping progress?</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Existing blockers from previous days */}
                {existingBlockers.filter(b => !b.convertedToTask).map((blocker: StandupBlocker) => (
                    <View key={blocker.id} className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                        <View className="flex-row items-start">
                            <MaterialCommunityIcons name="alert-circle" size={20} color="#EF4444" />
                            <View className="flex-1 ml-3">
                                <Text className="text-sm text-gray-900">{blocker.description}</Text>
                                <TouchableOpacity
                                    onPress={() => convertBlockerToTask(blocker.id)}
                                    className="mt-2 flex-row items-center"
                                >
                                    <MaterialCommunityIcons name="arrow-right-circle" size={16} color="#3B82F6" />
                                    <Text className="text-blue-600 text-xs ml-1">Convert to task</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* New blockers */}
                {blockers.map((blocker, index) => (
                    <View key={index} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                        <View className="flex-row items-start">
                            <MaterialCommunityIcons name="alert" size={20} color="#F59E0B" />
                            <Text className="flex-1 ml-3 text-sm text-gray-900">{blocker}</Text>
                            <TouchableOpacity onPress={() => handleRemoveBlocker(index)}>
                                <MaterialCommunityIcons name="close-circle" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                {/* Add blocker input */}
                <View className="flex-row items-center mb-4">
                    <TextInput
                        value={blockerInput}
                        onChangeText={setBlockerInput}
                        placeholder="Describe a blocker..."
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-base"
                        multiline
                        onSubmitEditing={handleAddBlocker}
                    />
                    <TouchableOpacity
                        onPress={handleAddBlocker}
                        className="ml-2 bg-blue-600 w-12 h-12 rounded-xl items-center justify-center"
                        disabled={!blockerInput.trim()}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {blockers.length === 0 && existingBlockers.length === 0 && (
                    <View className="bg-green-50 rounded-xl p-4 items-center">
                        <MaterialCommunityIcons name="check-circle" size={32} color="#10B981" />
                        <Text className="text-green-700 mt-2">No blockers - clear path ahead!</Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-4 pb-4 flex-row">
                <TouchableOpacity
                    onPress={() => setStep('today')}
                    className="flex-1 bg-gray-100 py-4 rounded-xl items-center mr-2"
                >
                    <Text className="text-gray-700 font-medium">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setStep('summary')}
                    className="flex-2 bg-blue-600 py-4 rounded-xl items-center ml-2 flex-1"
                >
                    <Text className="text-white font-bold">Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

    const renderSummaryStep = () => (
        <KeyboardAvoidingView 
            className="flex-1" 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View className="px-4 mb-4">
                <Text className="text-xl font-bold text-gray-900 mb-2">How are you feeling?</Text>
                <Text className="text-sm text-gray-500">Quick check-in before we wrap up</Text>
            </View>

            <ScrollView className="flex-1 px-4">
                {/* Mood Selection */}
                <View className="flex-row justify-between mb-6">
                    {[
                        { value: 'great', emoji: '🚀', label: 'Great' },
                        { value: 'good', emoji: '😊', label: 'Good' },
                        { value: 'okay', emoji: '😐', label: 'Okay' },
                        { value: 'struggling', emoji: '😓', label: 'Struggling' },
                    ].map((option) => (
                        <TouchableOpacity
                            key={option.value}
                            onPress={() => setMood(option.value as any)}
                            className={`flex-1 mx-1 py-4 rounded-xl items-center ${
                                mood === option.value ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <Text className="text-2xl mb-1">{option.emoji}</Text>
                            <Text className={`text-xs ${mood === option.value ? 'text-blue-700 font-semibold' : 'text-gray-600'}`}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Optional Notes */}
                <Text className="text-sm font-medium text-gray-700 mb-2">Any notes? (Optional)</Text>
                <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Quick thoughts for the day..."
                    className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base mb-6"
                    multiline
                    numberOfLines={3}
                />

                {/* Summary */}
                <View className="bg-gray-50 rounded-xl p-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">Standup Summary</Text>
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-green-600">{completedYesterday.length}</Text>
                            <Text className="text-xs text-gray-500">Completed</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-blue-600">{focusToday.length}</Text>
                            <Text className="text-xs text-gray-500">Today's Focus</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-2xl font-bold text-amber-600">{blockers.length + existingBlockers.length}</Text>
                            <Text className="text-xs text-gray-500">Blockers</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View className="px-4 pb-4 flex-row">
                <TouchableOpacity
                    onPress={() => setStep('blockers')}
                    className="flex-1 bg-gray-100 py-4 rounded-xl items-center mr-2"
                >
                    <Text className="text-gray-700 font-medium">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleComplete}
                    disabled={loading}
                    className="flex-2 bg-green-600 py-4 rounded-xl items-center ml-2 flex-1 flex-row justify-center"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="check" size={20} color="white" />
                            <Text className="text-white font-bold ml-2">Complete</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );

    // If standup is already completed
    if (todayStandup?.status === 'completed') {
        return (
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
                <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-gray-900 ml-4">Today's Standup</Text>
                </View>

                <ScrollView className="flex-1 px-4 pt-4">
                    <View className="bg-green-50 border border-green-200 rounded-2xl p-6 items-center mb-6">
                        <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4">
                            <MaterialCommunityIcons name="check" size={36} color="white" />
                        </View>
                        <Text className="text-xl font-bold text-green-900">Standup Complete!</Text>
                        <Text className="text-sm text-green-700 mt-1">
                            Completed at {new Date(todayStandup.completedAt || '').toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </Text>
                    </View>

                    {currentSprintHealth && (
                        <View className="mb-6">
                            <Text className="text-lg font-bold text-gray-900 mb-3">Sprint Health</Text>
                            <SprintHealthCard health={currentSprintHealth} />
                        </View>
                    )}

                    <CoachMessage
                        message={{
                            id: 'standup-done',
                            type: 'celebration',
                            tone: 'celebratory',
                            title: 'Stay focused!',
                            message: `You have ${todayStandup.focusToday.length} tasks to tackle today. Make progress, not perfection.`,
                            timestamp: new Date().toISOString(),
                            read: true,
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="close" size={24} color="#374151" />
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-900 ml-4">Daily Standup</Text>
            </View>

            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* Content */}
            {step === 'yesterday' && renderYesterdayStep()}
            {step === 'today' && renderTodayStep()}
            {step === 'blockers' && renderBlockersStep()}
            {step === 'summary' && renderSummaryStep()}
        </SafeAreaView>
    );
}
