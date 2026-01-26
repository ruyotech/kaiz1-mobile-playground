/**
 * QuickActionsBar Component
 * 
 * Provides quick access to common SensAI actions.
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface QuickAction {
    id: string;
    icon: string;
    label: string;
    color: string;
    onPress: () => void;
    badge?: number;
}

interface QuickActionsBarProps {
    actions: QuickAction[];
}

export function QuickActionsBar({ actions }: QuickActionsBarProps) {
    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="py-2"
        >
            {actions.map((action, index) => (
                <TouchableOpacity
                    key={action.id}
                    onPress={action.onPress}
                    className={`items-center justify-center px-4 py-3 rounded-2xl mr-3 ${
                        index === 0 ? 'ml-4' : ''
                    }`}
                    style={{ backgroundColor: `${action.color}15` }}
                    activeOpacity={0.7}
                >
                    <View className="relative">
                        <View 
                            className="w-12 h-12 rounded-full items-center justify-center"
                            style={{ backgroundColor: `${action.color}25` }}
                        >
                            <MaterialCommunityIcons 
                                name={action.icon as any} 
                                size={24} 
                                color={action.color} 
                            />
                        </View>
                        {action.badge !== undefined && action.badge > 0 && (
                            <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full items-center justify-center">
                                <Text className="text-white text-xs font-bold">
                                    {action.badge > 9 ? '9+' : action.badge}
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text 
                        className="text-xs font-medium mt-2 text-center"
                        style={{ color: action.color }}
                        numberOfLines={1}
                    >
                        {action.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

// Predefined quick actions for SensAI
export const getSensAIQuickActions = (options: {
    onStandup: () => void;
    onPlanning: () => void;
    onIntake: () => void;
    onInterventions: () => void;
    onLifeWheel: () => void;
    interventionCount?: number;
}): QuickAction[] => [
    {
        id: 'standup',
        icon: 'clipboard-check-outline',
        label: 'Standup',
        color: '#10B981',
        onPress: options.onStandup,
    },
    {
        id: 'planning',
        icon: 'calendar-edit',
        label: 'Planning',
        color: '#3B82F6',
        onPress: options.onPlanning,
    },
    {
        id: 'intake',
        icon: 'microphone-plus',
        label: 'Quick Add',
        color: '#8B5CF6',
        onPress: options.onIntake,
    },
    {
        id: 'interventions',
        icon: 'shield-alert-outline',
        label: 'Alerts',
        color: '#F59E0B',
        onPress: options.onInterventions,
        badge: options.interventionCount,
    },
    {
        id: 'lifewheel',
        icon: 'chart-donut',
        label: 'Life Wheel',
        color: '#EC4899',
        onPress: options.onLifeWheel,
    },
];

export default QuickActionsBar;
