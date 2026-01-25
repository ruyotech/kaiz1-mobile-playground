/**
 * Community Hooks - Custom hooks for community feature
 * 
 * These hooks provide a clean interface for components to interact with 
 * community data and actions, following the Single Responsibility Principle.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useCommunityStore } from '../store/communityStore';
import type {
    LeaderboardPeriod,
    LeaderboardCategory,
    SuccessStory,
} from '../types/models';

// ==========================================
// Community Home Hook
// ==========================================

/**
 * Hook for community home screen data
 */
export const useCommunityHome = () => {
    const {
        currentMember,
        featuredArticle,
        activePoll,
        weeklyChallenge,
        activityFeed,
        loading,
        error,
        fetchCommunityHome,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchCommunityHome();
    }, []);

    return {
        currentMember,
        featuredArticle,
        activePoll,
        weeklyChallenge,
        activityFeed,
        loading,
        error,
        refresh: fetchCommunityHome,
        clearError,
    };
};

// ==========================================
// Articles Hook
// ==========================================

/**
 * Hook for knowledge hub articles
 */
export const useCommunityArticles = (initialCategory?: string) => {
    const {
        articles,
        featuredArticle,
        articlesPagination,
        loading,
        error,
        fetchArticles,
        clearError,
        resetPagination,
    } = useCommunityStore();

    useEffect(() => {
        fetchArticles(initialCategory);
    }, [initialCategory]);

    const loadMore = useCallback(() => {
        fetchArticles(initialCategory, true);
    }, [initialCategory]);

    const refresh = useCallback(() => {
        resetPagination('articlesPagination');
        fetchArticles(initialCategory);
    }, [initialCategory]);

    return {
        articles,
        featuredArticle,
        loading,
        error,
        hasMore: articlesPagination.hasMore,
        isLoadingMore: articlesPagination.isLoadingMore,
        loadMore,
        refresh,
        clearError,
    };
};

// ==========================================
// Questions Hook
// ==========================================

/**
 * Hook for Q&A questions
 */
export const useCommunityQuestions = (status?: string, tag?: string) => {
    const {
        questions,
        questionsPagination,
        loading,
        error,
        fetchQuestions,
        upvoteQuestion,
        postQuestion,
        clearError,
        resetPagination,
    } = useCommunityStore();

    useEffect(() => {
        fetchQuestions(status, tag);
    }, [status, tag]);

    const loadMore = useCallback(() => {
        fetchQuestions(status, tag, true);
    }, [status, tag]);

    const refresh = useCallback(() => {
        resetPagination('questionsPagination');
        fetchQuestions(status, tag);
    }, [status, tag]);

    return {
        questions,
        loading,
        error,
        hasMore: questionsPagination.hasMore,
        isLoadingMore: questionsPagination.isLoadingMore,
        loadMore,
        refresh,
        upvoteQuestion,
        postQuestion,
        clearError,
    };
};

/**
 * Hook for question detail
 */
export const useQuestionDetail = (questionId: string) => {
    const {
        currentQuestion,
        answers,
        loading,
        error,
        fetchQuestionDetail,
        upvoteAnswer,
        postAnswer,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        if (questionId) {
            fetchQuestionDetail(questionId);
        }
    }, [questionId]);

    const refresh = useCallback(() => {
        fetchQuestionDetail(questionId);
    }, [questionId]);

    const submitAnswer = useCallback((body: string) => {
        return postAnswer(questionId, body);
    }, [questionId]);

    return {
        question: currentQuestion,
        answers,
        loading,
        error,
        refresh,
        upvoteAnswer,
        submitAnswer,
        clearError,
    };
};

// ==========================================
// Stories Hook
// ==========================================

/**
 * Hook for success stories
 */
export const useCommunityStories = (category?: string) => {
    const {
        stories,
        storiesPagination,
        loading,
        error,
        fetchStories,
        likeStory,
        celebrateStory,
        postStory,
        clearError,
        resetPagination,
    } = useCommunityStore();

    useEffect(() => {
        fetchStories(category);
    }, [category]);

    const loadMore = useCallback(() => {
        fetchStories(category, true);
    }, [category]);

    const refresh = useCallback(() => {
        resetPagination('storiesPagination');
        fetchStories(category);
    }, [category]);

    return {
        stories,
        loading,
        error,
        hasMore: storiesPagination.hasMore,
        isLoadingMore: storiesPagination.isLoadingMore,
        loadMore,
        refresh,
        likeStory,
        celebrateStory,
        postStory,
        clearError,
    };
};

// ==========================================
// Templates Hook
// ==========================================

/**
 * Hook for community templates
 */
export const useCommunityTemplates = (type?: string) => {
    const {
        templates,
        featuredTemplates,
        templatesPagination,
        loading,
        error,
        fetchTemplates,
        fetchFeaturedTemplates,
        downloadTemplate,
        rateTemplate,
        bookmarkTemplate,
        clearError,
        resetPagination,
    } = useCommunityStore();

    useEffect(() => {
        fetchTemplates(type);
        fetchFeaturedTemplates();
    }, [type]);

    const loadMore = useCallback(() => {
        fetchTemplates(type, true);
    }, [type]);

    const refresh = useCallback(() => {
        resetPagination('templatesPagination');
        fetchTemplates(type);
    }, [type]);

    return {
        templates,
        featuredTemplates,
        loading,
        error,
        hasMore: templatesPagination.hasMore,
        isLoadingMore: templatesPagination.isLoadingMore,
        loadMore,
        refresh,
        downloadTemplate,
        rateTemplate,
        bookmarkTemplate,
        clearError,
    };
};

// ==========================================
// Leaderboard Hook
// ==========================================

/**
 * Hook for community leaderboard
 */
export const useCommunityLeaderboard = (
    initialPeriod: LeaderboardPeriod = 'weekly',
    initialCategory: LeaderboardCategory = 'reputation'
) => {
    const {
        leaderboard,
        userRank,
        filters,
        loading,
        error,
        fetchLeaderboard,
        setFilters,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchLeaderboard(initialPeriod, initialCategory);
    }, []);

    const changePeriod = useCallback((period: LeaderboardPeriod) => {
        setFilters({ leaderboardPeriod: period });
        fetchLeaderboard(period, filters.leaderboardCategory);
    }, [filters.leaderboardCategory]);

    const changeCategory = useCallback((category: LeaderboardCategory) => {
        setFilters({ leaderboardCategory: category });
        fetchLeaderboard(filters.leaderboardPeriod, category);
    }, [filters.leaderboardPeriod]);

    const refresh = useCallback(() => {
        fetchLeaderboard(filters.leaderboardPeriod, filters.leaderboardCategory);
    }, [filters.leaderboardPeriod, filters.leaderboardCategory]);

    return {
        leaderboard,
        userRank,
        currentPeriod: filters.leaderboardPeriod,
        currentCategory: filters.leaderboardCategory,
        loading,
        error,
        changePeriod,
        changeCategory,
        refresh,
        clearError,
    };
};

// ==========================================
// Partners Hook
// ==========================================

/**
 * Hook for accountability partners
 */
export const useCommunityPartners = () => {
    const {
        partners,
        partnerRequests,
        loading,
        error,
        fetchPartners,
        fetchPartnerRequests,
        sendPartnerRequest,
        respondToPartnerRequest,
        removePartner,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchPartners();
        fetchPartnerRequests();
    }, []);

    const refresh = useCallback(() => {
        fetchPartners();
        fetchPartnerRequests();
    }, []);

    return {
        partners,
        partnerRequests,
        loading,
        error,
        refresh,
        sendPartnerRequest,
        respondToPartnerRequest,
        removePartner,
        clearError,
    };
};

// ==========================================
// Groups Hook
// ==========================================

/**
 * Hook for motivation groups
 */
export const useCommunityGroups = () => {
    const {
        motivationGroups,
        loading,
        error,
        fetchMotivationGroups,
        joinGroup,
        leaveGroup,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchMotivationGroups();
    }, []);

    const joinedGroups = useMemo(() => 
        motivationGroups.filter(g => g.isJoined),
        [motivationGroups]
    );

    const availableGroups = useMemo(() => 
        motivationGroups.filter(g => !g.isJoined),
        [motivationGroups]
    );

    return {
        allGroups: motivationGroups,
        joinedGroups,
        availableGroups,
        loading,
        error,
        refresh: fetchMotivationGroups,
        joinGroup,
        leaveGroup,
        clearError,
    };
};

// ==========================================
// Activity Feed Hook
// ==========================================

/**
 * Hook for community activity feed
 */
export const useCommunityActivity = () => {
    const {
        activityFeed,
        activityPagination,
        error,
        fetchActivityFeed,
        celebrateActivity,
        clearError,
        resetPagination,
    } = useCommunityStore();

    useEffect(() => {
        fetchActivityFeed();
    }, []);

    const loadMore = useCallback(() => {
        fetchActivityFeed(true);
    }, []);

    const refresh = useCallback(() => {
        resetPagination('activityPagination');
        fetchActivityFeed();
    }, []);

    return {
        activities: activityFeed,
        hasMore: activityPagination.hasMore,
        isLoadingMore: activityPagination.isLoadingMore,
        loadMore,
        refresh,
        celebrateActivity,
        error,
        clearError,
    };
};

// ==========================================
// Poll & Weekly Challenge Hook
// ==========================================

/**
 * Hook for active poll and weekly challenge
 */
export const useCommunityEngagement = () => {
    const {
        activePoll,
        weeklyChallenge,
        votePoll,
        joinWeeklyChallenge,
        error,
        clearError,
    } = useCommunityStore();

    const hasVoted = useMemo(() => 
        !!activePoll?.userVotedOptionId,
        [activePoll]
    );

    const hasJoinedChallenge = useMemo(() => 
        !!weeklyChallenge?.isJoined,
        [weeklyChallenge]
    );

    const pollResults = useMemo(() => {
        if (!activePoll) return null;
        return activePoll.options.map(opt => ({
            ...opt,
            percentage: activePoll.totalVotes > 0 
                ? Math.round((opt.voteCount / activePoll.totalVotes) * 100)
                : 0,
        }));
    }, [activePoll]);

    return {
        poll: activePoll,
        pollResults,
        hasVoted,
        votePoll,
        challenge: weeklyChallenge,
        hasJoinedChallenge,
        joinWeeklyChallenge,
        error,
        clearError,
    };
};

// ==========================================
// Feature Requests Hook
// ==========================================

/**
 * Hook for feature requests
 */
export const useFeatureRequests = () => {
    const {
        featureRequests,
        loading,
        error,
        fetchFeatureRequests,
        submitFeatureRequest,
        upvoteFeatureRequest,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchFeatureRequests();
    }, []);

    return {
        featureRequests,
        loading,
        error,
        refresh: fetchFeatureRequests,
        submitFeatureRequest,
        upvoteFeatureRequest,
        clearError,
    };
};

// ==========================================
// Social Interactions Hook
// ==========================================

/**
 * Hook for social features (compliments & kudos)
 */
export const useCommunityKudos = () => {
    const {
        receivedCompliments,
        publicKudos,
        error,
        fetchReceivedCompliments,
        sendCompliment,
        sendKudos,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchReceivedCompliments();
    }, []);

    const unreadCompliments = useMemo(() => 
        receivedCompliments.filter(c => !c.isRead),
        [receivedCompliments]
    );

    return {
        receivedCompliments,
        unreadCompliments,
        publicKudos,
        error,
        refresh: fetchReceivedCompliments,
        sendCompliment,
        sendKudos,
        clearError,
    };
};

// ==========================================
// Member Profile Hook
// ==========================================

/**
 * Hook for current member profile
 */
export const useCommunityProfile = () => {
    const {
        currentMember,
        allBadges,
        loading,
        error,
        fetchCurrentMember,
        fetchAllBadges,
        updateProfile,
        clearError,
    } = useCommunityStore();

    useEffect(() => {
        fetchCurrentMember();
        fetchAllBadges();
    }, []);

    const earnedBadges = useMemo(() => {
        if (!currentMember || !allBadges.length) return [];
        return allBadges.filter(badge => 
            currentMember.badges.includes(badge.type)
        );
    }, [currentMember, allBadges]);

    const unearnedBadges = useMemo(() => {
        if (!currentMember || !allBadges.length) return [];
        return allBadges.filter(badge => 
            !currentMember.badges.includes(badge.type)
        );
    }, [currentMember, allBadges]);

    return {
        member: currentMember,
        allBadges,
        earnedBadges,
        unearnedBadges,
        loading,
        error,
        refresh: fetchCurrentMember,
        updateProfile,
        clearError,
    };
};
