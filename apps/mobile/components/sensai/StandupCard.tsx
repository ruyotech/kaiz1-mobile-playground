/**
 * StandupCard Component
 * 
 * Displays daily standup summary and quick access.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DailyStandup, SprintHealth } from '../../types/sensai.types';
import { useTranslation } from '../../hooks';

interface StandupCardProps {
    standup: DailyStandup | null;
    sprintHealth: SprintHealth | null;
    onStartStandup: () => void;
    onViewStandup?: () => void;
}

export function StandupCard({ standup, sprintHealth, onStartStandup, onViewStandup }: StandupCardProps) {
    const { t } = useTranslation();
    const hasCompletedToday = standup?.status === 'completed';
    const wasSkipped = standup?.status === 'skipped';

    if (hasCompletedToday && standup) {
        return (
            <TouchableOpacity 
                onPress={onViewStandup}
                className="bg-green-50 border border-green-200 rounded-2xl p-4"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center mb-3">
                    <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="check" size={24} color="white" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-base font-bold text-green-900">{t('sensai.standup.complete')}</Text>
                        <Text className="text-sm text-green-700">
                            {new Date(standup.completedAt || '').toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#10B981" />
                </View>

                {/* Summary */}
                <View className="flex-row">
                    <View className="flex-1 bg-white/60 rounded-lg p-2 mr-2">
                        <Text className="text-xs text-gray-500">{t('sensai.standup.yesterday')}</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            {standup.completedYesterday.length} {t('tasks.title').toLowerCase()}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white/60 rounded-lg p-2 mr-2">
                        <Text className="text-xs text-gray-500">{t('sensai.standup.todayPlan')}</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            {standup.focusToday.length} {t('tasks.title').toLowerCase()}
                        </Text>
                    </View>
                    <View className="flex-1 bg-white/60 rounded-lg p-2">
                        <Text className="text-xs text-gray-500">{t('sensai.standup.blockers')}</Text>
                        <Text className={`text-sm font-semibold ${
                            standup.blockers.length > 0 ? 'text-amber-600' : 'text-gray-900'
                        }`}>
                            {standup.blockers.length}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    if (wasSkipped) {
        return (
            <View className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center">
                        <MaterialCommunityIcons name="calendar-remove" size={24} color="white" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-base font-bold text-gray-700">{t('sensai.standup.skipped')}</Text>
                        <Text className="text-sm text-gray-500">{t('sensai.standup.skippedMessage')}</Text>
                    </View>
                    <TouchableOpacity 
                        onPress={onStartStandup}
                        className="bg-gray-200 px-4 py-2 rounded-full"
                    >
                        <Text className="text-gray-700 font-medium">{t('common.start')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Pending standup
    return (
        <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
                    <MaterialCommunityIcons name="clipboard-check-outline" size={26} color="white" />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="text-lg font-bold text-blue-900">{t('sensai.standup.dailyStandup')}</Text>
                    <Text className="text-sm text-blue-700">{t('sensai.standup.readyMessage')}</Text>
                </View>
            </View>

            {/* Sprint Health Preview */}
            {sprintHealth && (
                <View className="bg-white/60 rounded-xl p-3 mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm text-gray-600">{t('sensai.standup.sprintProgress')}</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                            {t('sensai.standup.dayOfSprint', { current: sprintHealth.dayOfSprint, total: sprintHealth.totalDays })}
                        </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View 
                            className={`h-full rounded-full ${
                                sprintHealth.healthStatus === 'on_track' || sprintHealth.healthStatus === 'ahead'
                                    ? 'bg-green-500'
                                    : sprintHealth.healthStatus === 'at_risk'
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                            }`}
                            style={{ width: `${sprintHealth.completionPercentage}%` }}
                        />
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-xs text-gray-500">
                            {sprintHealth.completedPoints}/{sprintHealth.committedPoints} {t('common.pts')}
                        </Text>
                        <Text className="text-xs text-gray-500">
                            {sprintHealth.completionPercentage}% {t('common.complete')}
                        </Text>
                    </View>
                </View>
            )}

            <TouchableOpacity 
                onPress={onStartStandup}
                className="bg-blue-600 py-4 rounded-xl items-center flex-row justify-center"
                activeOpacity={0.8}
            >
                <MaterialCommunityIcons name="play" size={20} color="white" />
                <Text className="text-white font-bold text-base ml-2">{t('sensai.standup.startStandup')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                onPress={() => {/* Skip logic */}}
                className="mt-2 py-2 items-center"
            >
                <Text className="text-blue-600 text-sm">{t('sensai.standup.skipToday')}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default StandupCard;
