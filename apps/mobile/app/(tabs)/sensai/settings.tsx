/**
 * SensAI Settings Screen
 * 
 * Configuration for AI coach preferences, notification schedules,
 * intervention thresholds, and dimension priorities.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { LIFE_WHEEL_DIMENSIONS, CoachTone } from '../../../types/sensai.types';

export default function SettingsScreen() {
    const { settings, updateSettings } = useSensAIStore();
    
    const [coachTone, setCoachTone] = useState<CoachTone>(settings?.coachTone || 'direct');
    const [interventionsEnabled, setInterventionsEnabled] = useState(settings?.interventionsEnabled ?? true);
    const [dailyStandupTime, setDailyStandupTime] = useState(settings?.dailyStandupTime || '09:00');
    const [sprintLength, setSprintLength] = useState(settings?.sprintLengthDays || 14);
    const [maxDailyCapacity, setMaxDailyCapacity] = useState(settings?.maxDailyCapacity || 8);
    const [overcommitThreshold, setOvercommitThreshold] = useState(settings?.overcommitThreshold || 0.15);
    const [dimensionAlertThreshold, setDimensionAlertThreshold] = useState(settings?.dimensionAlertThreshold || 5);
    const [dimensionPriorities, setDimensionPriorities] = useState<Record<string, number>>(
        settings?.dimensionPriorities || {}
    );

    const toneOptions: { id: CoachTone; label: string; description: string; icon: string }[] = [
        { id: 'supportive', label: 'Supportive', description: 'Gentle guidance and encouragement', icon: 'heart' },
        { id: 'direct', label: 'Direct', description: 'Clear, actionable feedback', icon: 'target' },
        { id: 'challenging', label: 'Challenging', description: 'Push you to achieve more', icon: 'fire' },
    ];

    const handleSave = async () => {
        await updateSettings({
            coachTone,
            interventionsEnabled,
            dailyStandupTime,
            sprintLengthDays: sprintLength,
            maxDailyCapacity,
            overcommitThreshold,
            dimensionAlertThreshold,
            dimensionPriorities,
        });
        router.back();
    };

    const renderSection = (title: string, children: React.ReactNode) => (
        <View className="mb-6">
            <Text className="text-gray-400 text-sm uppercase tracking-wide mb-3">{title}</Text>
            <View className="bg-gray-800 rounded-2xl overflow-hidden">
                {children}
            </View>
        </View>
    );

    const renderSettingRow = (
        icon: string,
        title: string,
        subtitle?: string,
        rightElement?: React.ReactNode,
        onPress?: () => void
    ) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={!onPress}
            className="flex-row items-center p-4 border-b border-gray-700"
        >
            <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center mr-3">
                <MaterialCommunityIcons name={icon as any} size={20} color="#10B981" />
            </View>
            <View className="flex-1">
                <Text className="text-white font-medium">{title}</Text>
                {subtitle && <Text className="text-gray-400 text-sm">{subtitle}</Text>}
            </View>
            {rightElement}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-semibold">SensAI Settings</Text>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-emerald-400 font-semibold">Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Coach Personality */}
                {renderSection('Coach Personality', (
                    <View className="p-4">
                        <Text className="text-white font-medium mb-3">Communication Style</Text>
                        {toneOptions.map(option => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => setCoachTone(option.id)}
                                className={`flex-row items-center p-3 rounded-xl mb-2 ${
                                    coachTone === option.id ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-gray-700'
                                }`}
                            >
                                <MaterialCommunityIcons 
                                    name={option.icon as any} 
                                    size={24} 
                                    color={coachTone === option.id ? '#10B981' : '#6B7280'} 
                                />
                                <View className="ml-3 flex-1">
                                    <Text className={`font-medium ${
                                        coachTone === option.id ? 'text-emerald-400' : 'text-white'
                                    }`}>
                                        {option.label}
                                    </Text>
                                    <Text className="text-gray-400 text-sm">{option.description}</Text>
                                </View>
                                {coachTone === option.id && (
                                    <MaterialCommunityIcons name="check-circle" size={20} color="#10B981" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}

                {/* Interventions */}
                {renderSection('Interventions', (
                    <>
                        {renderSettingRow(
                            'bell-alert',
                            'Enable Interventions',
                            'Get proactive guidance from your coach',
                            <Switch
                                value={interventionsEnabled}
                                onValueChange={setInterventionsEnabled}
                                trackColor={{ false: '#374151', true: '#10B98150' }}
                                thumbColor={interventionsEnabled ? '#10B981' : '#6B7280'}
                            />
                        )}
                        {renderSettingRow(
                            'alert-circle',
                            'Overcommit Threshold',
                            `Alert when ${Math.round(overcommitThreshold * 100)}% over capacity`,
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setOvercommitThreshold(Math.max(0.05, overcommitThreshold - 0.05))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="minus" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="text-white mx-3 w-12 text-center">
                                    {Math.round(overcommitThreshold * 100)}%
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setOvercommitThreshold(Math.min(0.5, overcommitThreshold + 0.05))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                        {renderSettingRow(
                            'chart-donut',
                            'Dimension Alert',
                            `Alert when any dimension drops below ${dimensionAlertThreshold}`,
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setDimensionAlertThreshold(Math.max(1, dimensionAlertThreshold - 1))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="minus" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="text-white mx-3 w-8 text-center">{dimensionAlertThreshold}</Text>
                                <TouchableOpacity
                                    onPress={() => setDimensionAlertThreshold(Math.min(8, dimensionAlertThreshold + 1))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ))}

                {/* Schedule */}
                {renderSection('Schedule', (
                    <>
                        {renderSettingRow(
                            'coffee',
                            'Daily Standup Time',
                            'When to prompt for daily check-in',
                            <TouchableOpacity className="bg-gray-700 px-3 py-2 rounded-lg">
                                <Text className="text-white">{dailyStandupTime}</Text>
                            </TouchableOpacity>
                        )}
                        {renderSettingRow(
                            'calendar-range',
                            'Sprint Length',
                            'Duration of each sprint cycle',
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setSprintLength(Math.max(7, sprintLength - 7))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="minus" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="text-white mx-3 w-16 text-center">{sprintLength} days</Text>
                                <TouchableOpacity
                                    onPress={() => setSprintLength(Math.min(28, sprintLength + 7))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                        {renderSettingRow(
                            'battery-charging',
                            'Max Daily Capacity',
                            'Maximum points per day before warning',
                            <View className="flex-row items-center">
                                <TouchableOpacity
                                    onPress={() => setMaxDailyCapacity(Math.max(4, maxDailyCapacity - 1))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="minus" size={16} color="#fff" />
                                </TouchableOpacity>
                                <Text className="text-white mx-3 w-8 text-center">{maxDailyCapacity}</Text>
                                <TouchableOpacity
                                    onPress={() => setMaxDailyCapacity(Math.min(16, maxDailyCapacity + 1))}
                                    className="w-8 h-8 bg-gray-700 rounded-full items-center justify-center"
                                >
                                    <MaterialCommunityIcons name="plus" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                ))}

                {/* Dimension Priorities */}
                {renderSection('Dimension Priorities', (
                    <View className="p-4">
                        <Text className="text-gray-400 text-sm mb-3">
                            Rate your focus priority for each life dimension (1-10)
                        </Text>
                        {LIFE_WHEEL_DIMENSIONS.map(dim => (
                            <View key={dim.id} className="flex-row items-center py-3 border-b border-gray-700">
                                <MaterialCommunityIcons name={dim.icon as any} size={20} color={dim.color} />
                                <Text className="text-white ml-3 flex-1">{dim.name}</Text>
                                <View className="flex-row items-center">
                                    {[...Array(10)].map((_, idx) => {
                                        const priority = dimensionPriorities[dim.id] || 5;
                                        const isActive = idx < priority;
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                onPress={() => setDimensionPriorities({
                                                    ...dimensionPriorities,
                                                    [dim.id]: idx + 1,
                                                })}
                                                className="p-1"
                                            >
                                                <View 
                                                    className={`w-2 h-4 rounded-sm ${isActive ? '' : 'bg-gray-700'}`}
                                                    style={isActive ? { backgroundColor: dim.color } : {}}
                                                />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Data & Privacy */}
                {renderSection('Data & Privacy', (
                    <>
                        {renderSettingRow(
                            'download',
                            'Export Data',
                            'Download your SensAI analytics',
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />,
                            () => {}
                        )}
                        {renderSettingRow(
                            'delete',
                            'Clear History',
                            'Remove all standup and intervention history',
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#EF4444" />,
                            () => {}
                        )}
                        {renderSettingRow(
                            'shield-check',
                            'Privacy Policy',
                            'How we use your data',
                            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />,
                            () => {}
                        )}
                    </>
                ))}

                {/* Version Info */}
                <View className="items-center py-6">
                    <MaterialCommunityIcons name="robot" size={32} color="#10B981" />
                    <Text className="text-gray-500 text-sm mt-2">SensAI v1.0.0</Text>
                    <Text className="text-gray-600 text-xs">Your AI Scrum Master</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
