/**
 * SensAI Interventions Screen
 * 
 * Displays all active interventions and history.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { InterventionCard } from '../../../components/sensai';
import { InterventionType } from '../../../types/sensai.types';

type FilterType = 'all' | 'capacity' | 'balance' | 'execution';

export default function InterventionsScreen() {
    const router = useRouter();
    const {
        activeInterventions,
        interventionHistory,
        loading,
        fetchActiveInterventions,
        acknowledgeIntervention,
        dismissIntervention,
    } = useSensAIStore();

    const [refreshing, setRefreshing] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        fetchActiveInterventions();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchActiveInterventions();
        setRefreshing(false);
    };

    const filteredInterventions = activeInterventions.filter(i => {
        if (filter === 'all') return true;
        return i.category === filter;
    });

    const unacknowledgedCount = activeInterventions.filter(i => !i.acknowledged).length;

    const FILTERS: { key: FilterType; label: string; icon: string }[] = [
        { key: 'all', label: 'All', icon: 'view-grid' },
        { key: 'capacity', label: 'Capacity', icon: 'gauge' },
        { key: 'balance', label: 'Balance', icon: 'scale-balance' },
        { key: 'execution', label: 'Execution', icon: 'run-fast' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                </TouchableOpacity>
                <View className="flex-1 ml-4">
                    <Text className="text-lg font-bold text-gray-900">Interventions</Text>
                    {unacknowledgedCount > 0 && (
                        <Text className="text-sm text-amber-600">
                            {unacknowledgedCount} need attention
                        </Text>
                    )}
                </View>
            </View>

            {/* Filter Tabs */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="border-b border-gray-100"
            >
                <View className="flex-row px-4 py-2">
                    {FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f.key}
                            onPress={() => setFilter(f.key)}
                            className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                                filter === f.key ? 'bg-blue-100' : 'bg-gray-100'
                            }`}
                        >
                            <MaterialCommunityIcons 
                                name={f.icon as any} 
                                size={16} 
                                color={filter === f.key ? '#3B82F6' : '#6B7280'} 
                            />
                            <Text className={`ml-2 text-sm font-medium ${
                                filter === f.key ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                                {f.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Active Interventions */}
                <View className="px-4 pt-4">
                    {filteredInterventions.length > 0 ? (
                        filteredInterventions.map((intervention) => (
                            <InterventionCard
                                key={intervention.id}
                                intervention={intervention}
                                expanded={expandedId === intervention.id}
                                onToggleExpand={() => setExpandedId(
                                    expandedId === intervention.id ? null : intervention.id
                                )}
                                onAcknowledge={(action) => acknowledgeIntervention(intervention.id, action)}
                                onDismiss={intervention.type === 'nudge' ? 
                                    () => dismissIntervention(intervention.id) : undefined
                                }
                            />
                        ))
                    ) : (
                        <View className="bg-green-50 rounded-2xl p-8 items-center">
                            <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4">
                                <MaterialCommunityIcons name="check" size={32} color="white" />
                            </View>
                            <Text className="text-lg font-bold text-green-900">All Clear!</Text>
                            <Text className="text-sm text-green-700 text-center mt-2">
                                No active interventions. You're on track.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Intervention Types Explanation */}
                <View className="px-4 mt-8 mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-4">Intervention Types</Text>
                    
                    <View className="bg-white rounded-xl p-4 border border-gray-100">
                        {[
                            { type: 'alert', icon: 'alert-octagon', color: '#EF4444', label: 'Alert', desc: 'Immediate issue - blocks progress' },
                            { type: 'warning', icon: 'alert', color: '#F59E0B', label: 'Warning', desc: 'Potential problem forming' },
                            { type: 'nudge', icon: 'lightbulb-on-outline', color: '#3B82F6', label: 'Nudge', desc: 'Opportunity or suggestion' },
                            { type: 'celebration', icon: 'party-popper', color: '#10B981', label: 'Celebration', desc: 'Achievement unlocked!' },
                        ].map((item, index) => (
                            <View 
                                key={item.type}
                                className={`flex-row items-center py-3 ${
                                    index < 3 ? 'border-b border-gray-100' : ''
                                }`}
                            >
                                <View 
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: `${item.color}20` }}
                                >
                                    <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-sm font-semibold text-gray-900">{item.label}</Text>
                                    <Text className="text-xs text-gray-500">{item.desc}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* History Toggle */}
                <TouchableOpacity
                    onPress={() => setShowHistory(!showHistory)}
                    className="mx-4 mb-4 flex-row items-center justify-between bg-gray-100 rounded-xl p-4"
                >
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="history" size={20} color="#6B7280" />
                        <Text className="ml-2 text-gray-700 font-medium">Intervention History</Text>
                    </View>
                    <MaterialCommunityIcons 
                        name={showHistory ? 'chevron-up' : 'chevron-down'} 
                        size={20} 
                        color="#6B7280" 
                    />
                </TouchableOpacity>

                {showHistory && interventionHistory.length > 0 && (
                    <View className="px-4 mb-8">
                        {interventionHistory.slice(0, 10).map((intervention) => (
                            <View 
                                key={intervention.id}
                                className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-100"
                            >
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons 
                                        name={intervention.overridden ? 'skip-forward' : 'check-circle'} 
                                        size={18} 
                                        color={intervention.overridden ? '#F59E0B' : '#10B981'} 
                                    />
                                    <Text className="ml-2 text-sm text-gray-600 flex-1" numberOfLines={1}>
                                        {intervention.title}
                                    </Text>
                                    <Text className="text-xs text-gray-400">
                                        {new Date(intervention.acknowledgedAt || '').toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
