/**
 * SensAI Dashboard Screen
 * 
 * Main hub for the AI Scrum Master featuring:
 * - Coach messages
 * - Sprint health overview
 * - Daily standup access
 * - Active interventions
 * - Quick actions
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';
import { useAuthStore } from '../../../store/authStore';
import { useTranslation } from '../../../hooks';
import {
    CoachMessage,
    InterventionCard,
    SprintHealthCard,
    VelocityCard,
    StandupCard,
    QuickActionsBar,
    getSensAIQuickActions,
} from '../../../components/sensai';

export default function SensAIDashboard() {
    const router = useRouter();
    const { t } = useTranslation();
    const { user } = useAuthStore();
    const {
        isInitialized,
        loading,
        error,
        velocityMetrics,
        currentSprintHealth,
        todayStandup,
        activeInterventions,
        coachMessages,
        initialize,
        refreshData,
        acknowledgeIntervention,
        dismissIntervention,
        clearError,
    } = useSensAIStore();

    const [refreshing, setRefreshing] = useState(false);
    const [expandedIntervention, setExpandedIntervention] = useState<string | null>(null);

    useEffect(() => {
        if (user?.id && !isInitialized) {
            initialize(user.id);
        }
    }, [user?.id, isInitialized]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshData();
        setRefreshing(false);
    };

    const quickActions = getSensAIQuickActions({
        onStandup: () => router.push('/(tabs)/sensai/standup' as any),
        onPlanning: () => router.push('/(tabs)/sensai/planning' as any),
        onIntake: () => router.push('/(tabs)/sensai/intake' as any),
        onInterventions: () => router.push('/(tabs)/sensai/interventions' as any),
        onLifeWheel: () => router.push('/(tabs)/sensai/lifewheel' as any),
        interventionCount: activeInterventions.filter(i => !i.acknowledged).length,
    });

    const latestMessage = coachMessages.find(m => !m.read);
    const urgentInterventions = activeInterventions.filter(
        i => !i.acknowledged && (i.urgency === 'high' || i.urgency === 'medium')
    ).slice(0, 2);

    if (!isInitialized && loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-gray-500 mt-4">{t('sensai.initializing')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-4 pt-4 pb-2">
                    <View className="flex-row items-center justify-between">
                        <View>
                            <Text className="text-2xl font-bold text-gray-900">{t('sensai.title')}</Text>
                            <Text className="text-sm text-gray-500">{t('sensai.subtitle')}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/sensai/settings' as any)}
                            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                        >
                            <MaterialCommunityIcons name="cog-outline" size={22} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Actions */}
                <QuickActionsBar actions={quickActions} />

                {/* Coach Message */}
                {latestMessage && (
                    <View className="px-4 mt-2">
                        <CoachMessage
                            message={latestMessage}
                            onDismiss={() => useSensAIStore.getState().markMessageRead(latestMessage.id)}
                        />
                    </View>
                )}

                {/* Daily Standup Card */}
                <View className="px-4 mt-4">
                    <StandupCard
                        standup={todayStandup}
                        sprintHealth={currentSprintHealth}
                        onStartStandup={() => router.push('/(tabs)/sensai/standup' as any)}
                        onViewStandup={() => router.push('/(tabs)/sensai/standup' as any)}
                    />
                </View>

                {/* Urgent Interventions */}
                {urgentInterventions.length > 0 && (
                    <View className="px-4 mt-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-gray-900">{t('sensai.needsAttention')}</Text>
                            {activeInterventions.length > 2 && (
                                <TouchableOpacity
                                    onPress={() => router.push('/(tabs)/sensai/interventions' as any)}
                                >
                                    <Text className="text-blue-600 text-sm font-medium">{t('common.seeAll')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {urgentInterventions.map(intervention => (
                            <InterventionCard
                                key={intervention.id}
                                intervention={intervention}
                                expanded={expandedIntervention === intervention.id}
                                onToggleExpand={() => setExpandedIntervention(
                                    expandedIntervention === intervention.id ? null : intervention.id
                                )}
                                onAcknowledge={(action) => acknowledgeIntervention(intervention.id, action)}
                                onDismiss={() => dismissIntervention(intervention.id)}
                            />
                        ))}
                    </View>
                )}

                {/* Sprint Health */}
                {currentSprintHealth && (
                    <View className="px-4 mt-6">
                        <Text className="text-lg font-bold text-gray-900 mb-3">{t('sensai.sprintHealth.title')}</Text>
                        <SprintHealthCard health={currentSprintHealth} />
                    </View>
                )}

                {/* Velocity Overview */}
                {velocityMetrics && (
                    <View className="px-4 mt-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-gray-900">{t('sensai.yourVelocity')}</Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(tabs)/sensai/velocity' as any)}
                            >
                                <Text className="text-blue-600 text-sm font-medium">{t('sensai.details')}</Text>
                            </TouchableOpacity>
                        </View>
                        <VelocityCard metrics={velocityMetrics} showChart={false} />
                    </View>
                )}

                {/* Ceremonies Section */}
                <View className="px-4 mt-6 mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-lg font-bold text-gray-900">{t('sprints.sprintCeremonies')}</Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/sensai/ceremonies' as any)}
                        >
                            <Text className="text-blue-600 text-sm font-medium">{t('common.viewAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="flex-row">
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/sensai/planning' as any)}
                            className="flex-1 bg-blue-50 rounded-xl p-4 mr-2"
                        >
                            <MaterialCommunityIcons name="clipboard-list-outline" size={28} color="#3B82F6" />
                            <Text className="text-sm font-semibold text-blue-900 mt-2">{t('sensai.ceremonies.sprintPlanning')}</Text>
                            <Text className="text-xs text-blue-600 mt-1">{t('sensai.planYourWeek')}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/sensai/review' as any)}
                            className="flex-1 bg-purple-50 rounded-xl p-4 ml-2"
                        >
                            <MaterialCommunityIcons name="trophy-outline" size={28} color="#8B5CF6" />
                            <Text className="text-sm font-semibold text-purple-900 mt-2">{t('sensai.ceremonies.sprintReview')}</Text>
                            <Text className="text-xs text-purple-600 mt-1">{t('sensai.celebrateWins')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
