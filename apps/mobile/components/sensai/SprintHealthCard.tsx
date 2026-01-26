/**
 * SprintHealthCard Component
 * 
 * Displays current sprint health with progress indicators
 * and status information.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SprintHealth } from '../../types/sensai.types';

interface SprintHealthCardProps {
    health: SprintHealth;
    compact?: boolean;
}

const STATUS_STYLES = {
    on_track: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        progressBg: 'bg-green-500',
        icon: 'check-circle',
        iconColor: '#10B981',
        label: 'On Track',
        labelColor: 'text-green-700',
    },
    ahead: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        progressBg: 'bg-blue-500',
        icon: 'rocket-launch',
        iconColor: '#3B82F6',
        label: 'Ahead',
        labelColor: 'text-blue-700',
    },
    at_risk: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        progressBg: 'bg-amber-500',
        icon: 'alert',
        iconColor: '#F59E0B',
        label: 'At Risk',
        labelColor: 'text-amber-700',
    },
    behind: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        progressBg: 'bg-red-500',
        icon: 'alert-octagon',
        iconColor: '#EF4444',
        label: 'Behind',
        labelColor: 'text-red-700',
    },
};

export function SprintHealthCard({ health, compact = false }: SprintHealthCardProps) {
    const style = STATUS_STYLES[health.healthStatus];

    if (compact) {
        return (
            <View className={`${style.bg} ${style.border} border rounded-xl p-3 flex-row items-center`}>
                <MaterialCommunityIcons 
                    name={style.icon as any} 
                    size={20} 
                    color={style.iconColor} 
                />
                <Text className={`ml-2 font-semibold ${style.labelColor}`}>
                    {style.label}
                </Text>
                <View className="flex-1 mx-3">
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View 
                            className={`h-full ${style.progressBg} rounded-full`}
                            style={{ width: `${Math.min(health.completionPercentage, 100)}%` }}
                        />
                    </View>
                </View>
                <Text className="text-sm font-bold text-gray-900">
                    {health.completionPercentage}%
                </Text>
            </View>
        );
    }

    return (
        <View className={`${style.bg} ${style.border} border rounded-2xl p-4`}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full items-center justify-center`} 
                          style={{ backgroundColor: `${style.iconColor}20` }}>
                        <MaterialCommunityIcons 
                            name={style.icon as any} 
                            size={22} 
                            color={style.iconColor} 
                        />
                    </View>
                    <View className="ml-3">
                        <Text className="text-lg font-bold text-gray-900">Sprint Health</Text>
                        <Text className={`text-sm font-medium ${style.labelColor}`}>{style.label}</Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-2xl font-bold text-gray-900">{health.completionPercentage}%</Text>
                    <Text className="text-xs text-gray-500">Complete</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View className="mb-4">
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View 
                        className={`h-full ${style.progressBg} rounded-full`}
                        style={{ width: `${Math.min(health.completionPercentage, 100)}%` }}
                    />
                </View>
                {/* Expected Progress Marker */}
                <View 
                    className="absolute h-3 w-0.5 bg-gray-400"
                    style={{ left: `${health.expectedPercentage}%`, top: 0 }}
                />
            </View>

            {/* Stats Grid */}
            <View className="flex-row">
                <View className="flex-1 items-center border-r border-gray-200">
                    <Text className="text-xs text-gray-500">Day</Text>
                    <Text className="text-lg font-bold text-gray-900">
                        {health.dayOfSprint}/{health.totalDays}
                    </Text>
                </View>
                <View className="flex-1 items-center border-r border-gray-200">
                    <Text className="text-xs text-gray-500">Completed</Text>
                    <Text className="text-lg font-bold text-gray-900">
                        {health.completedPoints} pts
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-500">Remaining</Text>
                    <Text className="text-lg font-bold text-gray-900">
                        {health.remainingPoints} pts
                    </Text>
                </View>
            </View>

            {/* Trend Indicator */}
            {health.burndownTrend !== 'healthy' && (
                <View className={`mt-3 p-2 rounded-lg ${
                    health.burndownTrend === 'concerning' ? 'bg-amber-100' : 'bg-red-100'
                }`}>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons 
                            name="trending-down" 
                            size={16} 
                            color={health.burndownTrend === 'concerning' ? '#F59E0B' : '#EF4444'} 
                        />
                        <Text className={`ml-2 text-xs ${
                            health.burndownTrend === 'concerning' ? 'text-amber-700' : 'text-red-700'
                        }`}>
                            {health.burndownTrend === 'concerning' 
                                ? 'Burndown is flattening - consider focusing on priorities'
                                : 'Sprint at risk - immediate action needed'}
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

export default SprintHealthCard;
