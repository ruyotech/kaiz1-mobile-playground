import { AppContext } from '../store/navigationStore';

export interface NavIcon {
    name: string;
    icon: string;
    route: string;
}

export interface MoreMenuItem {
    name: string;
    icon: string;
    route: string;
}

export const NAV_CONFIGS: Record<AppContext, NavIcon[]> = {
    sdlc: [
        { name: 'Sprint', icon: 'view-dashboard-outline', route: '/(tabs)/sdlc/calendar' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    sensai: [
        { name: 'Coach', icon: 'robot', route: '/(tabs)/sensai' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    mindset: [
        { name: 'Mindset', icon: 'creation', route: '/(tabs)/motivation' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    essentia: [
        { name: 'Today', icon: 'book-open-page-variant', route: '/(tabs)/essentia' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    challenges: [
        { name: 'Active', icon: 'target', route: '/(tabs)/challenges' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    pomodoro: [
        { name: 'Focus', icon: 'circle-slice-8', route: '/(tabs)/pomodoro' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    bills: [
        { name: 'Bills', icon: 'currency-usd', route: '/(tabs)/bills' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    community: [
        { name: 'Hub', icon: 'account-group', route: '/(tabs)/community' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
};

export const MORE_MENUS: Record<AppContext, MoreMenuItem[]> = {
    sdlc: [
        { name: 'Task Search', icon: 'magnify', route: '/(tabs)/sdlc/search-tasks' },
        { name: 'Backlog', icon: 'inbox', route: '/(tabs)/sdlc/backlog' },
        { name: 'Reports', icon: 'chart-line', route: '/(tabs)/sdlc/reports' },
        { name: 'Velocity', icon: 'speedometer', route: '/(tabs)/sdlc/velocity' },
        { name: 'Retrospective', icon: 'comment-multiple', route: '/(tabs)/sdlc/retro' },
        { name: 'Epics', icon: 'bookmark-multiple', route: '/(tabs)/sdlc/epics' },
        { name: 'Knowledge Hub', icon: 'school', route: '/(tabs)/sdlc/wiki' },
        { name: 'Templates', icon: 'file-document-multiple', route: 'templates' },
    ],
    sensai: [
        { name: 'Daily Standup', icon: 'coffee', route: '/(tabs)/sensai/standup' },
        { name: 'Sprint Planning', icon: 'calendar-plus', route: '/(tabs)/sensai/planning' },
        { name: 'Sprint Review', icon: 'presentation', route: '/(tabs)/sensai/review' },
        { name: 'Retrospective', icon: 'comment-multiple-outline', route: '/(tabs)/sensai/retrospective' },
        { name: 'Interventions', icon: 'alert-decagram', route: '/(tabs)/sensai/interventions' },
        { name: 'Life Wheel', icon: 'chart-donut', route: '/(tabs)/sensai/lifewheel' },
        { name: 'Velocity', icon: 'speedometer', route: '/(tabs)/sensai/velocity' },
        { name: 'Quick Intake', icon: 'plus-box', route: '/(tabs)/sensai/intake' },
        { name: 'Analytics', icon: 'chart-box-outline', route: '/(tabs)/sensai/analytics' },
        { name: 'Settings', icon: 'cog-outline', route: '/(tabs)/sensai/settings' },
    ],
    mindset: [
        { name: 'Favorites', icon: 'heart', route: '/(tabs)/motivation/favorites' },
        { name: 'Themes', icon: 'palette', route: '/(tabs)/motivation/themes' },
        { name: 'Analytics', icon: 'chart-box', route: '/(tabs)/motivation/analytics' },
        { name: 'Settings', icon: 'cog', route: '/(tabs)/settings' },
    ],
    essentia: [
        { name: 'Explore Books', icon: 'compass-outline', route: '/(tabs)/essentia/explore' },
        { name: 'My Library', icon: 'bookshelf', route: '/(tabs)/essentia/library' },
        { name: 'Growth Stats', icon: 'chart-line', route: '/(tabs)/essentia/growth' },
        { name: 'Highlights', icon: 'marker', route: '/(tabs)/essentia/highlights' },
        { name: 'Flashcards', icon: 'cards-outline', route: '/(tabs)/essentia/flashcards' },
        { name: 'Reading Goals', icon: 'flag-checkered', route: '/(tabs)/essentia/goals' },
        { name: 'Collections', icon: 'folder-multiple', route: '/(tabs)/essentia/collections' },
        { name: 'Settings', icon: 'cog-outline', route: '/(tabs)/settings' },
    ],
    challenges: [
        { name: 'Create Challenge', icon: 'plus-circle', route: '/(tabs)/challenges/create' },
        { name: 'Templates', icon: 'book-open-variant', route: '/(tabs)/challenges/templates' },
        { name: 'Completed', icon: 'trophy', route: '/(tabs)/challenges/completed' },
        { name: 'Community', icon: 'account-group', route: '/(tabs)/challenges/community' },
        { name: 'Leaderboard', icon: 'podium', route: '/(tabs)/challenges/leaderboard' },
        { name: 'Settings', icon: 'cog', route: '/(tabs)/settings' },
    ],
    pomodoro: [
        { name: 'Settings', icon: 'cog', route: '/(tabs)/pomodoro/settings' },
        { name: 'History', icon: 'history', route: '/(tabs)/pomodoro/history' },
        { name: 'Focus Analytics', icon: 'chart-line', route: '/(tabs)/reports?tab=focus' },
    ],
    bills: [
        { name: 'Categories', icon: 'tag-multiple', route: '/(tabs)/bills/categories' },
        { name: 'Recurring', icon: 'calendar-repeat', route: '/(tabs)/bills/recurring' },
        { name: 'Reports', icon: 'chart-pie', route: '/(tabs)/bills/reports' },
        { name: 'Settings', icon: 'cog', route: '/(tabs)/settings' },
    ],
    community: [
        { name: 'Knowledge Hub', icon: 'school', route: '/(tabs)/community/knowledge' },
        { name: 'Q&A Forum', icon: 'help-circle', route: '/(tabs)/community/questions' },
        { name: 'Success Stories', icon: 'party-popper', route: '/(tabs)/community/wins' },
        { name: 'Templates', icon: 'file-document-multiple', route: '/(tabs)/community/templates' },
        { name: 'Leaderboard', icon: 'podium-gold', route: '/(tabs)/community/leaderboard' },
        { name: 'Support Circle', icon: 'account-heart', route: '/(tabs)/community/support' },
        { name: 'My Profile', icon: 'account-circle', route: '/(tabs)/community/profile' },
    ],
};

export interface App {
    id: AppContext;
    name: string;
    icon: string;
    color: string;
    route: string;
}

export const APPS: App[] = [
    { id: 'sdlc', name: 'Tasks', icon: 'view-dashboard-outline', color: '#3B82F6', route: '/(tabs)/sdlc' },
    { id: 'sensai', name: 'SensAI', icon: 'robot', color: '#10B981', route: '/(tabs)/sensai' },
    { id: 'challenges', name: 'Challenges', icon: 'target', color: '#F59E0B', route: '/(tabs)/challenges' },
    { id: 'pomodoro', name: 'Focus', icon: 'circle-slice-8', color: '#EF4444', route: '/(tabs)/pomodoro' },
    { id: 'essentia', name: 'Essentia', icon: 'brain', color: '#8B5CF6', route: '/(tabs)/essentia' },
    { id: 'mindset', name: 'Mindset', icon: 'creation', color: '#EC4899', route: '/(tabs)/motivation' },
    { id: 'community', name: 'Community', icon: 'account-group', color: '#06B6D4', route: '/(tabs)/community' },
];
