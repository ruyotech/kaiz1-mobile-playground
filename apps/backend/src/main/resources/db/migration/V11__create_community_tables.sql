-- V11: Community Module Tables
-- This migration creates all tables required for the community feature
-- IMPORTANT: Table and column names MUST match JPA entity annotations exactly

-- =============================================================================
-- COMMUNITY MEMBERS
-- Table: community_members (from CommunityMember entity)
-- =============================================================================
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id),
    display_name VARCHAR(100) NOT NULL,
    avatar VARCHAR(50) DEFAULT '👤',
    bio VARCHAR(500),
    level INTEGER DEFAULT 1,
    level_title VARCHAR(50) DEFAULT 'Novice',
    reputation_points INTEGER DEFAULT 0,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    is_online BOOLEAN DEFAULT FALSE,
    sprints_completed INTEGER DEFAULT 0,
    helpful_answers INTEGER DEFAULT 0,
    templates_shared INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    show_activity BOOLEAN DEFAULT TRUE,
    accept_partner_requests BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_role CHECK (role IN ('MEMBER', 'CONTRIBUTOR', 'MENTOR', 'MODERATOR', 'ADMIN'))
);

-- ElementCollection: community_member_badges
CREATE TABLE community_member_badges (
    member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    PRIMARY KEY (member_id, badge_type)
);

-- =============================================================================
-- COMMUNITY BADGES (Metadata)
-- Table: community_badges (from CommunityBadge entity)
-- =============================================================================
CREATE TABLE community_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_type VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500) NOT NULL,
    icon VARCHAR(100),
    rarity VARCHAR(20) NOT NULL DEFAULT 'COMMON',
    xp_reward INTEGER DEFAULT 50,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_rarity CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY'))
);

-- =============================================================================
-- ARTICLES (Knowledge Hub)
-- Table: community_articles (from Article entity)
-- =============================================================================
CREATE TABLE community_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    cover_image_url VARCHAR(500),
    author_id UUID NOT NULL REFERENCES community_members(id),
    published_at TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    read_time_minutes INTEGER DEFAULT 5,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_article_category CHECK (category IN ('FEATURE', 'STRATEGY', 'PRODUCTIVITY', 'WELLNESS', 'FINANCE', 'ANNOUNCEMENT'))
);

-- ElementCollection: article_tags (from @CollectionTable(name = "article_tags"))
CREATE TABLE article_tags (
    article_id UUID NOT NULL REFERENCES community_articles(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- ElementCollection: article_likes (from @CollectionTable(name = "article_likes"))
CREATE TABLE article_likes (
    article_id UUID NOT NULL REFERENCES community_articles(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (article_id, member_id)
);

-- ElementCollection: article_bookmarks (from @CollectionTable(name = "article_bookmarks"))
CREATE TABLE article_bookmarks (
    article_id UUID NOT NULL REFERENCES community_articles(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (article_id, member_id)
);

-- =============================================================================
-- QUESTIONS (Q&A Forum)
-- Table: community_questions (from Question entity)
-- =============================================================================
CREATE TABLE community_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    body TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES community_members(id),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    view_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    accepted_answer_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_question_status CHECK (status IN ('OPEN', 'ANSWERED', 'CLOSED'))
);

-- ElementCollection: question_tags (from @CollectionTable(name = "question_tags"))
CREATE TABLE question_tags (
    question_id UUID NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- ElementCollection: question_upvotes (from @CollectionTable(name = "question_upvotes"))
CREATE TABLE question_upvotes (
    question_id UUID NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (question_id, member_id)
);

-- =============================================================================
-- ANSWERS
-- Table: community_answers (from Answer entity)
-- =============================================================================
CREATE TABLE community_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES community_questions(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES community_members(id),
    upvote_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- ElementCollection: answer_upvotes (from @CollectionTable(name = "answer_upvotes"))
CREATE TABLE answer_upvotes (
    answer_id UUID NOT NULL REFERENCES community_answers(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (answer_id, member_id)
);

-- =============================================================================
-- SUCCESS STORIES
-- Table: community_stories (from SuccessStory entity)
-- =============================================================================
CREATE TABLE community_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES community_members(id),
    title VARCHAR(200) NOT NULL,
    story TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    life_wheel_area_id VARCHAR(50),
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    celebrate_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_story_category CHECK (category IN ('SPRINT_COMPLETE', 'CHALLENGE_DONE', 'HABIT_STREAK', 'MILESTONE', 'TRANSFORMATION', 'OTHER'))
);

-- ElementCollection: story_image_urls (from @CollectionTable(name = "story_image_urls"))
CREATE TABLE story_image_urls (
    story_id UUID NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL
);

-- ElementCollection: story_metrics (embeddable, from @CollectionTable(name = "story_metrics"))
CREATE TABLE story_metrics (
    story_id UUID NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
    metric_label VARCHAR(100),
    metric_value VARCHAR(100)
);

-- ElementCollection: story_likes (from @CollectionTable(name = "story_likes"))
CREATE TABLE story_likes (
    story_id UUID NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (story_id, member_id)
);

-- ElementCollection: story_celebrates (from @CollectionTable(name = "story_celebrates"))
CREATE TABLE story_celebrates (
    story_id UUID NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (story_id, member_id)
);

-- =============================================================================
-- STORY COMMENTS
-- Table: community_story_comments (from StoryComment entity)
-- =============================================================================
CREATE TABLE community_story_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID NOT NULL REFERENCES community_stories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES community_members(id),
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- =============================================================================
-- TEMPLATES
-- Table: community_templates (from CommunityTemplate entity)
-- =============================================================================
CREATE TABLE community_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    author_id UUID NOT NULL REFERENCES community_members(id),
    content TEXT NOT NULL,
    life_wheel_area_id VARCHAR(50),
    download_count INTEGER DEFAULT 0,
    rating DOUBLE PRECISION DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    preview_image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_template_type CHECK (template_type IN ('SPRINT_PLAN', 'EPIC', 'RITUAL', 'CHALLENGE', 'PROCESS', 'CHECKLIST'))
);

-- ElementCollection: template_tags (from @CollectionTable(name = "template_tags"))
CREATE TABLE template_tags (
    template_id UUID NOT NULL REFERENCES community_templates(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- ElementCollection: template_bookmarks (from @CollectionTable(name = "template_bookmarks"))
CREATE TABLE template_bookmarks (
    template_id UUID NOT NULL REFERENCES community_templates(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (template_id, member_id)
);

-- =============================================================================
-- MOTIVATION GROUPS
-- Table: community_groups (from MotivationGroup entity)
-- =============================================================================
CREATE TABLE community_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    cover_image_url VARCHAR(500),
    life_wheel_area_id VARCHAR(50),
    member_count INTEGER DEFAULT 0,
    max_members INTEGER DEFAULT 100,
    is_private BOOLEAN DEFAULT FALSE,
    creator_id UUID NOT NULL REFERENCES community_members(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- ElementCollection: group_tags (from @CollectionTable(name = "group_tags"))
CREATE TABLE group_tags (
    group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

-- ElementCollection: group_members (from @CollectionTable(name = "group_members"))
CREATE TABLE group_members (
    group_id UUID NOT NULL REFERENCES community_groups(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (group_id, member_id)
);

-- =============================================================================
-- ACCOUNTABILITY PARTNERS
-- Table: community_partners (from AccountabilityPartner entity)
-- =============================================================================
CREATE TABLE community_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES community_members(id),
    partner_id UUID NOT NULL REFERENCES community_members(id),
    connected_since TIMESTAMP NOT NULL,
    last_interaction TIMESTAMP,
    check_in_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    UNIQUE(member_id, partner_id)
);

-- ElementCollection: partner_shared_challenges (from @CollectionTable(name = "partner_shared_challenges"))
CREATE TABLE partner_shared_challenges (
    partnership_id UUID NOT NULL REFERENCES community_partners(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL,
    PRIMARY KEY (partnership_id, challenge_id)
);

-- =============================================================================
-- PARTNER REQUESTS
-- Table: community_partner_requests (from PartnerRequest entity)
-- =============================================================================
CREATE TABLE community_partner_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_member_id UUID NOT NULL REFERENCES community_members(id),
    to_member_id UUID NOT NULL REFERENCES community_members(id),
    message VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_request_status CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED'))
);

-- =============================================================================
-- COMMUNITY ACTIVITIES (Feed)
-- Table: community_activities (from CommunityActivity entity)
-- =============================================================================
CREATE TABLE community_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL REFERENCES community_members(id),
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    metadata TEXT,
    celebrate_count INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_activity_type CHECK (activity_type IN ('SPRINT_COMPLETED', 'CHALLENGE_JOINED', 'CHALLENGE_COMPLETED', 'BADGE_EARNED', 'STREAK_MILESTONE', 'TEMPLATE_SHARED', 'QUESTION_ANSWERED', 'STORY_POSTED', 'LEVEL_UP'))
);

-- ElementCollection: activity_celebrates (from @CollectionTable(name = "activity_celebrates"))
CREATE TABLE activity_celebrates (
    activity_id UUID NOT NULL REFERENCES community_activities(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (activity_id, member_id)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Member indexes
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_level ON community_members(level DESC);
CREATE INDEX idx_community_members_reputation ON community_members(reputation_points DESC);

-- Article indexes
CREATE INDEX idx_articles_author ON community_articles(author_id);
CREATE INDEX idx_articles_category ON community_articles(category);
CREATE INDEX idx_articles_published ON community_articles(is_published, published_at DESC);
CREATE INDEX idx_articles_featured ON community_articles(is_featured) WHERE is_featured = TRUE;

-- Question indexes
CREATE INDEX idx_questions_author ON community_questions(author_id);
CREATE INDEX idx_questions_status ON community_questions(status);
CREATE INDEX idx_questions_created ON community_questions(created_at DESC);

-- Answer indexes
CREATE INDEX idx_answers_question ON community_answers(question_id);
CREATE INDEX idx_answers_author ON community_answers(author_id);

-- Story indexes
CREATE INDEX idx_stories_author ON community_stories(author_id);
CREATE INDEX idx_stories_category ON community_stories(category);
CREATE INDEX idx_stories_created ON community_stories(created_at DESC);

-- Template indexes
CREATE INDEX idx_templates_author ON community_templates(author_id);
CREATE INDEX idx_templates_type ON community_templates(template_type);
CREATE INDEX idx_templates_featured ON community_templates(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_templates_downloads ON community_templates(download_count DESC);

-- Group indexes
CREATE INDEX idx_groups_creator ON community_groups(creator_id);

-- Activity indexes
CREATE INDEX idx_activities_member ON community_activities(member_id);
CREATE INDEX idx_activities_type ON community_activities(activity_type);
CREATE INDEX idx_activities_created ON community_activities(created_at DESC);

-- Partner indexes
CREATE INDEX idx_partners_member ON community_partners(member_id);
CREATE INDEX idx_partners_partner ON community_partners(partner_id);

-- Partner request indexes
CREATE INDEX idx_partner_requests_from ON community_partner_requests(from_member_id);
CREATE INDEX idx_partner_requests_to ON community_partner_requests(to_member_id);
CREATE INDEX idx_partner_requests_status ON community_partner_requests(status);

-- =============================================================================
-- SECRET COMPLIMENTS
-- Table: community_compliments (from SecretCompliment entity)
-- =============================================================================
CREATE TABLE community_compliments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    to_member_id UUID NOT NULL REFERENCES community_members(id),
    message VARCHAR(500) NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_compliment_category CHECK (category IN ('ENCOURAGEMENT', 'APPRECIATION', 'RECOGNITION', 'MOTIVATION'))
);

CREATE INDEX idx_compliments_to_member ON community_compliments(to_member_id);

-- =============================================================================
-- KUDOS
-- Table: community_kudos (from Kudos entity)
-- =============================================================================
CREATE TABLE community_kudos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_member_id UUID NOT NULL REFERENCES community_members(id),
    to_member_id UUID NOT NULL REFERENCES community_members(id),
    message VARCHAR(300) NOT NULL,
    reason VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

CREATE INDEX idx_kudos_from_member ON community_kudos(from_member_id);
CREATE INDEX idx_kudos_to_member ON community_kudos(to_member_id);

-- =============================================================================
-- COMMUNITY POLLS
-- Table: community_polls (from CommunityPoll entity)
-- =============================================================================
CREATE TABLE community_polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question VARCHAR(500) NOT NULL,
    total_votes INTEGER DEFAULT 0,
    ends_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- ElementCollection: poll_options (from @CollectionTable(name = "poll_options"))
CREATE TABLE poll_options (
    poll_id UUID NOT NULL REFERENCES community_polls(id) ON DELETE CASCADE,
    option_order INTEGER,
    option_id UUID,
    option_text VARCHAR(200),
    vote_count INTEGER DEFAULT 0
);

-- ElementCollection: poll_votes (from @CollectionTable(name = "poll_votes"))
CREATE TABLE poll_votes (
    poll_id UUID NOT NULL REFERENCES community_polls(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    option_id UUID NOT NULL,
    PRIMARY KEY (poll_id, member_id)
);

CREATE INDEX idx_polls_active ON community_polls(is_active);

-- =============================================================================
-- FEATURE REQUESTS
-- Table: community_feature_requests (from FeatureRequest entity)
-- =============================================================================
CREATE TABLE community_feature_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES community_members(id),
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
    upvote_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    official_response TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36),
    CONSTRAINT valid_feature_status CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DECLINED'))
);

-- ElementCollection: feature_request_upvotes (from @CollectionTable(name = "feature_request_upvotes"))
CREATE TABLE feature_request_upvotes (
    request_id UUID NOT NULL REFERENCES community_feature_requests(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (request_id, member_id)
);

CREATE INDEX idx_feature_requests_author ON community_feature_requests(author_id);
CREATE INDEX idx_feature_requests_status ON community_feature_requests(status);

-- =============================================================================
-- WEEKLY CHALLENGES
-- Table: community_weekly_challenges (from WeeklyChallenge entity)
-- =============================================================================
CREATE TABLE community_weekly_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    life_wheel_area_id VARCHAR(50),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    participant_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    reward_xp INTEGER DEFAULT 100,
    reward_badge VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- ElementCollection: weekly_challenge_participants (from @CollectionTable(name = "weekly_challenge_participants"))
CREATE TABLE weekly_challenge_participants (
    challenge_id UUID NOT NULL REFERENCES community_weekly_challenges(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (challenge_id, member_id)
);

-- ElementCollection: weekly_challenge_completions (from @CollectionTable(name = "weekly_challenge_completions"))
CREATE TABLE weekly_challenge_completions (
    challenge_id UUID NOT NULL REFERENCES community_weekly_challenges(id) ON DELETE CASCADE,
    member_id UUID NOT NULL,
    PRIMARY KEY (challenge_id, member_id)
);

CREATE INDEX idx_weekly_challenges_dates ON community_weekly_challenges(start_date, end_date);
