export type AppContext = 'sdlc' | 'motivation' | 'books' | 'bills' | 'challenges';

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
        { name: 'Backlog', icon: 'format-list-checks', route: '/(tabs)/sdlc' },
        { name: 'Sprint', icon: 'clock-fast', route: '/(tabs)/sdlc/calendar' },
        { name: 'Dashboard', icon: 'view-dashboard', route: '/(tabs)' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    motivation: [
        { name: 'Daily', icon: 'lightbulb-on', route: '/(tabs)/motivation' },
        { name: 'Share', icon: 'share-variant', route: 'share' },
        { name: 'Settings', icon: 'cog', route: 'settings' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    books: [
        { name: 'Library', icon: 'book-open-variant', route: '/(tabs)/books' },
        { name: 'Favorites', icon: 'heart', route: 'favorites' },
        { name: 'Search', icon: 'magnify', route: 'search' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    bills: [
        { name: 'All', icon: 'cash-multiple', route: '/(tabs)/bills' },
        { name: 'Paid', icon: 'check-circle', route: 'paid' },
        { name: 'Unpaid', icon: 'alert-circle', route: 'unpaid' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
    challenges: [
        { name: 'Active', icon: 'trophy', route: '/(tabs)/challenges' },
        { name: 'Board', icon: 'podium', route: 'leaderboard' },
        { name: 'History', icon: 'history', route: 'history' },
        { name: 'More', icon: 'dots-horizontal', route: 'more' },
    ],
};

export const MORE_MENUS: Record<AppContext, MoreMenuItem[]> = {
    sdlc: [
        { name: 'Reports', icon: 'chart-line', route: '/(tabs)/sdlc/reports' },
        { name: 'Velocity', icon: 'speedometer', route: 'velocity' },
        { name: 'Retrospective', icon: 'comment-multiple', route: 'retro' },
        { name: 'Epics', icon: 'bookmark-multiple', route: 'epics' },
        { name: 'Templates', icon: 'file-document-multiple', route: 'templates' },
    ],
    motivation: [
        { name: 'Categories', icon: 'tag-multiple', route: 'categories' },
        { name: 'Favorites', icon: 'heart', route: 'favorites' },
        { name: 'History', icon: 'history', route: 'history' },
    ],
    books: [
        { name: 'Categories', icon: 'tag-multiple', route: 'categories' },
        { name: 'Reading List', icon: 'book-clock', route: 'reading-list' },
        { name: 'Notes', icon: 'note-text', route: 'notes' },
    ],
    bills: [
        { name: 'Categories', icon: 'tag-multiple', route: 'categories' },
        { name: 'Recurring', icon: 'sync', route: 'recurring' },
        { name: 'Analytics', icon: 'chart-pie', route: 'analytics' },
    ],
    challenges: [
        { name: 'Create', icon: 'plus-circle', route: 'create' },
        { name: 'Friends', icon: 'account-group', route: 'friends' },
        { name: 'Achievements', icon: 'trophy-variant', route: 'achievements' },
    ],
};

export interface App {
    id: AppContext | 'report' | 'community';
    name: string;
    icon: string;
    color: string;
    route: string;
}

export const APPS: App[] = [
    { id: 'sdlc', name: 'Tasks', icon: 'check-circle', color: '#3B82F6', route: '/(tabs)/sdlc' },
    { id: 'bills', name: 'Bills', icon: 'cash-multiple', color: '#10B981', route: '/(tabs)/bills' },
    { id: 'challenges', name: 'Challenges', icon: 'trophy', color: '#F59E0B', route: '/(tabs)/challenges' },
    { id: 'books', name: 'Books', icon: 'book-open-variant', color: '#8B5CF6', route: '/(tabs)/books' },
    { id: 'motivation', name: 'Motivation', icon: 'lightbulb-on', color: '#EC4899', route: '/(tabs)/motivation' },
    { id: 'report', name: 'Reports', icon: 'chart-box', color: '#06B6D4', route: '/reports' },
    { id: 'community', name: 'Community', icon: 'account-group', color: '#EF4444', route: '/community' },
];
