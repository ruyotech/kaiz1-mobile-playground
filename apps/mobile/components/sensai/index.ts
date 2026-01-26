/**
 * SensAI Components Index
 * 
 * Export all SensAI components from a single entry point.
 */

// Core Components
export { CoachMessage } from './CoachMessage';
export { InterventionCard } from './InterventionCard';
export { SprintHealthCard } from './SprintHealthCard';
export { VelocityCard } from './VelocityCard';
export { LifeWheelChart } from './LifeWheelChart';
export { StandupCard } from './StandupCard';
export { CeremonyCard } from './CeremonyCard';
export { QuickActionsBar } from './QuickActionsBar';

// Quick Actions Helper
export interface QuickActionConfig {
    onStandup: () => void;
    onPlanning: () => void;
    onIntake: () => void;
    onInterventions: () => void;
    onLifeWheel: () => void;
    interventionCount?: number;
}

export interface QuickAction {
    id: string;
    label: string;
    icon: string;
    onPress: () => void;
    badge?: number;
    color?: string;
}

export function getSensAIQuickActions(config: QuickActionConfig): QuickAction[] {
    return [
        {
            id: 'standup',
            label: 'Standup',
            icon: 'coffee',
            onPress: config.onStandup,
            color: '#10B981',
        },
        {
            id: 'planning',
            label: 'Planning',
            icon: 'calendar-plus',
            onPress: config.onPlanning,
            color: '#3B82F6',
        },
        {
            id: 'intake',
            label: 'Quick Add',
            icon: 'plus-box',
            onPress: config.onIntake,
            color: '#8B5CF6',
        },
        {
            id: 'interventions',
            label: 'Alerts',
            icon: 'alert-decagram',
            onPress: config.onInterventions,
            badge: config.interventionCount,
            color: '#F59E0B',
        },
        {
            id: 'lifewheel',
            label: 'Life Wheel',
            icon: 'chart-donut',
            onPress: config.onLifeWheel,
            color: '#EC4899',
        },
    ];
}
