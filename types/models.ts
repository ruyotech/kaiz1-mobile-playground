// User Management
export interface User {
    id: string;
    email: string;
    fullName: string;
    accountType: 'individual' | 'family_adult' | 'family_child' | 'corporate';
    subscriptionTier: 'free' | 'pro' | 'family' | 'corporate' | 'enterprise';
    timezone: string;
    avatarUrl: string | null;
    createdAt: string;
}

export interface Family {
    id: string;
    name: string;
    ownerId: string;
    memberIds: string[];
    createdAt: string;
}

// SDLC - Life Wheel
export interface LifeWheelArea {
    id: string;
    name: string;
    icon: string;
    color: string;
}

// SDLC - Eisenhower Matrix
export interface EisenhowerQuadrant {
    id: string;
    name: string;
    label: string;
    color: string;
}

// SDLC - Sprints (52 weeks)
export interface Sprint {
    id: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    status: 'planned' | 'active' | 'completed';
    totalPoints: number;
    completedPoints: number;
}

// SDLC - Epics
export interface Epic {
    id: string;
    title: string;
    description: string;
    userId: string;
    lifeWheelAreaId: string;
    targetSprintId: string;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    totalPoints: number;
    completedPoints: number;
    color: string;
    icon: string;
    startDate: string;
    endDate: string;
    taskIds: string[];
    createdAt: string;
}

// SDLC - Tasks
export interface Task {
    id: string;
    title: string;
    description: string;
    userId: string;
    epicId: string | null;
    lifeWheelAreaId: string;
    eisenhowerQuadrantId: string;
    sprintId: string | null;
    storyPoints: 1 | 2 | 3 | 5 | 8 | 13 | 21;
    status: 'draft' | 'todo' | 'in_progress' | 'done';
    isDraft: boolean;
    aiConfidence: number | null;
    createdFromTemplateId: string | null;
    createdAt: string;
    completedAt: string | null;
    // Recurring task support
    isRecurring?: boolean;
    recurrencePattern?: {
        frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
        interval: number; // e.g., every 2 weeks
        endDate?: string | null; // when to stop recurring
    };
}

export interface TaskHistory {
    id: string;
    taskId: string;
    fieldName: string;
    oldValue: string;
    newValue: string;
    changedByUserId: string;
    timestamp: string;
}

export interface TaskComment {
    id: string;
    taskId: string;
    userId: string | null;
    commentText: string;
    isAiGenerated: boolean;
    timestamp: string;
}

export interface TaskTemplate {
    id: string;
    name: string;
    description: string;
    defaultStoryPoints: number;
    defaultLifeWheelAreaId: string;
    defaultEisenhowerQuadrantId: string;
    userId: string;
    createdAt: string;
}

// Bills
export interface BillCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Bill {
    id: string;
    userId: string;
    categoryId: string;
    vendorName: string;
    amount: number;
    dueDate: string;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    paymentStatus: 'unpaid' | 'paid' | 'overdue';
    isDraft: boolean;
    aiConfidence: number | null;
    rawOcrData: any;
    fileUrl: string;
    createdAt: string;
}

// Motivation - Mindset Content (Kaiz Contextual System)
export type LifeWheelDimensionTag = 
    | 'lw-1' // Health & Fitness
    | 'lw-2' // Career & Work
    | 'lw-3' // Finance & Money
    | 'lw-4' // Personal Growth
    | 'lw-5' // Relationships & Family
    | 'lw-6' // Social Life
    | 'lw-7' // Fun & Recreation
    | 'lw-8' // Environment & Home
    | 'generic' // Universal/No specific dimension
    | 'q2_growth'; // Eisenhower Q2 specific

export type MindsetThemePreset = 
    | 'dark'
    | 'nature'
    | 'cyberpunk'
    | 'minimalist'
    | 'gradient-blue'
    | 'gradient-purple'
    | 'gradient-sunset';

export interface MindsetContent {
    id: string;
    body: string; // The quote/message text
    author: string | null; // Attribution (can be null for system-generated)
    dimensionTag: LifeWheelDimensionTag; // Primary Life Wheel dimension
    secondaryTags?: LifeWheelDimensionTag[]; // Additional relevant dimensions
    themePreset: MindsetThemePreset; // Visual theme identifier
    assetUrl?: string; // Background image/video URL
    assetType?: 'image' | 'video'; // Asset media type
    interventionWeight: number; // 0-100: Higher = more targeted for intervention
    emotionalTone?: 'motivational' | 'reflective' | 'actionable' | 'calming';
    dwellTimeMs?: number; // User engagement tracking
    isFavorite?: boolean;
    createdAt: string;
    lastShownAt?: string;
}

export interface MindsetFavorite {
    id: string;
    userId: string;
    contentId: string;
    savedAt: string;
    note?: string; // User's personal note on why they saved it
}

export interface MindsetTheme {
    id: MindsetThemePreset;
    name: string;
    backgroundColor: string;
    textColor: string;
    accentColor: string;
    defaultAsset?: string; // Default background for this theme
    gradientColors?: string[]; // For gradient themes
}

export interface MindsetSession {
    id: string;
    userId: string;
    startedAt: string;
    endedAt?: string;
    contentViewedIds: string[];
    totalDwellTime: number; // milliseconds
    actionsTriggered: {
        internalized: number; // Added to journal
        operationalized: number; // Converted to tasks
        favorited: number;
    };
}

// Note: Legacy Quote interfaces removed - replaced by MindsetContent system

// Books
export interface BookSummary {
    id: string;
    title: string;
    author: string;
    lifeWheelAreaId: string;
    coverUrl: string | null;
    content: string;
    keyTakeaways: string[];
    createdAt: string;
}

// Challenges
export type ChallengeMetricType = 'count' | 'yesno' | 'streak' | 'time' | 'completion';
export type ChallengeRecurrence = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
export type ChallengeVisibility = 'private' | 'shared' | 'community';
export type ChallengeStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface Challenge {
    id: string;
    name: string;
    description?: string;
    lifeWheelAreaId: string;
    metricType: ChallengeMetricType;
    targetValue?: number; // for count, time types
    unit?: string; // steps, minutes, pages, etc.
    duration: number; // in days
    recurrence: ChallengeRecurrence;
    customRecurrencePattern?: {
        daysOfWeek?: number[]; // 0-6, Sunday = 0
        timesPerWeek?: number;
    };
    
    // Status & Dates
    status: ChallengeStatus;
    startDate: string;
    endDate: string;
    
    // Motivation & Rewards
    whyStatement?: string;
    rewardDescription?: string;
    
    // Flexibility
    graceDays: number; // missed days allowed
    
    // Sprint Integration
    sprintIntegration: boolean;
    pointValue?: number; // story points per completion
    linkedTaskIds?: string[]; // auto-generated sprint tasks
    
    // Social
    challengeType: 'solo' | 'group';
    visibility: ChallengeVisibility;
    createdByUserId: string;
    accountabilityPartnerIds?: string[];
    
    // Notifications
    reminderEnabled: boolean;
    reminderTime?: string; // HH:mm format
    
    // Progress Tracking
    currentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    totalMissed: number;
    
    // Metadata
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

export interface ChallengeTemplate {
    id: string;
    name: string;
    description: string;
    lifeWheelAreaId: string;
    metricType: ChallengeMetricType;
    targetValue?: number;
    unit?: string;
    suggestedDuration: number; // in days
    recurrence: ChallengeRecurrence;
    icon: string;
    tags: string[];
    popularityScore: number;
    difficulty: 'easy' | 'moderate' | 'hard';
}

export interface ChallengeParticipant {
    id: string;
    challengeId: string;
    userId: string;
    joinedAt: string;
    currentProgress: number;
    lastUpdated: string;
    streakDays: number;
    isAccountabilityPartner: boolean; // can view only, not log
}

export interface ChallengeEntry {
    id: string;
    challengeId: string;
    userId: string;
    date: string; // YYYY-MM-DD
    value: number | boolean; // depends on metric type
    note?: string;
    timestamp: string;
    synced: boolean; // offline support
    reactions: Array<{
        userId: string;
        type: 'thumbsup' | 'fire' | 'muscle' | 'celebrate';
    }>;
}

export interface ChallengeAnalytics {
    challengeId: string;
    completionRate: number; // percentage
    averageValue?: number; // for count/time types
    bestDay?: string;
    worstDay?: string;
    totalImpact: number; // contribution to life wheel
    consistencyScore: number; // 0-100
}

// Notifications
export interface Notification {
    id: string;
    userId: string;
    type: 'ai_scrum_master' | 'system' | 'challenge' | 'family';
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

// Helper types for API responses
export interface ApiResponse<T> {
    data: T;
    error: string | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}
