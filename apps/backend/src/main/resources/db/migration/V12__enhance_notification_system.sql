-- V12: Enhanced Notification System for Production
-- Adds category, priority, pinned, archived, actions, deep links, expiration
-- Also creates notification_preferences table for user settings

-- =====================================================
-- 1. ALTER notifications table to add new columns
-- =====================================================

-- Add category column
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS category VARCHAR(20) NOT NULL DEFAULT 'system';

-- Add priority column
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS priority VARCHAR(10) NOT NULL DEFAULT 'medium';

-- Add pinned flag
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;

-- Add archived flag
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_archived BOOLEAN NOT NULL DEFAULT false;

-- Add read_at timestamp
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Add icon and color customization
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS icon_color VARCHAR(20);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add short body for collapsed view
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS short_body VARCHAR(200);

-- Add deep link for navigation
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS deep_link VARCHAR(255);

-- Add expiration
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Add actions as JSONB (array of action objects)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS actions JSONB;

-- Add group key for grouping similar notifications
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS group_key VARCHAR(100);

-- Update type constraint to support all new types
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS chk_notification_type;

-- Add new constraint with all notification types
ALTER TABLE notifications ADD CONSTRAINT chk_notification_type CHECK (type IN (
    -- Task notifications
    'TASK_ASSIGNED', 'TASK_COMPLETED', 'TASK_OVERDUE', 'TASK_REMINDER', 
    'TASK_STATUS_CHANGED', 'TASK_COMMENT', 'TASK_SHARED',
    'SPRINT_STARTED', 'SPRINT_ENDING', 'SPRINT_COMPLETED', 'EPIC_MILESTONE',
    -- Challenge notifications
    'CHALLENGE_REMINDER', 'CHALLENGE_STREAK', 'CHALLENGE_COMPLETED', 
    'CHALLENGE_MILESTONE', 'CHALLENGE_INVITATION', 'CHALLENGE_CHEERED', 
    'CHALLENGE_PARTNER_UPDATE',
    -- Community notifications
    'PARTNER_REQUEST', 'PARTNER_ACCEPTED', 'KUDOS_RECEIVED', 
    'COMPLIMENT_RECEIVED', 'GROUP_INVITATION', 'GROUP_ACTIVITY',
    'QUESTION_ANSWERED', 'STORY_LIKED', 'STORY_COMMENT', 
    'LEADERBOARD_RANK_UP', 'BADGE_EARNED',
    -- Essentia/Learning notifications
    'LEARNING_REMINDER', 'STREAK_AT_RISK', 'STREAK_MILESTONE', 
    'BOOK_COMPLETED', 'CHALLENGE_PROGRESS', 'FLASHCARD_REVIEW',
    -- Event notifications
    'BIRTHDAY_REMINDER', 'EVENT_REMINDER', 'BILL_DUE', 'ANNIVERSARY',
    -- System notifications
    'FEATURE_ANNOUNCEMENT', 'APP_UPDATE', 'TIP_OF_DAY', 
    'WEEKLY_SUMMARY', 'ACHIEVEMENT_UNLOCKED',
    -- AI notifications
    'AI_INSIGHT', 'AI_RECOMMENDATION', 'AI_DAILY_BRIEF', 'AI_WEEKLY_REVIEW',
    -- Legacy types (for backward compatibility)
    'AI_SCRUM_MASTER', 'SYSTEM', 'CHALLENGE', 'FAMILY', 'REMINDER', 'ACHIEVEMENT'
));

-- Add constraint for category
ALTER TABLE notifications ADD CONSTRAINT chk_notification_category CHECK (category IN (
    'tasks', 'challenges', 'community', 'essentia', 'events', 'system', 'ai'
));

-- Add constraint for priority
ALTER TABLE notifications ADD CONSTRAINT chk_notification_priority CHECK (priority IN (
    'low', 'medium', 'high', 'urgent'
));

-- =====================================================
-- 2. Add new indexes for efficient querying
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_is_pinned ON notifications(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_notifications_is_archived ON notifications(is_archived);
CREATE INDEX IF NOT EXISTS idx_notifications_user_category ON notifications(user_id, category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_pinned ON notifications(user_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_notifications_user_not_archived ON notifications(user_id, is_archived) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_group_key ON notifications(group_key) WHERE group_key IS NOT NULL;

-- =====================================================
-- 3. Create notification_preferences table
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Global settings
    enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Quiet hours
    quiet_hours_enabled BOOLEAN NOT NULL DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '07:00',
    
    -- Push notification settings
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    push_sound BOOLEAN NOT NULL DEFAULT true,
    push_vibrate BOOLEAN NOT NULL DEFAULT true,
    
    -- Category preferences (JSONB for flexibility)
    -- Format: { "tasks": { "enabled": true, "push": true, "inApp": true, "email": false }, ... }
    category_preferences JSONB NOT NULL DEFAULT '{
        "tasks": {"enabled": true, "push": true, "inApp": true, "email": false},
        "challenges": {"enabled": true, "push": true, "inApp": true, "email": false},
        "community": {"enabled": true, "push": true, "inApp": true, "email": false},
        "essentia": {"enabled": true, "push": true, "inApp": true, "email": false},
        "events": {"enabled": true, "push": true, "inApp": true, "email": true},
        "system": {"enabled": true, "push": false, "inApp": true, "email": false},
        "ai": {"enabled": true, "push": true, "inApp": true, "email": false}
    }'::jsonb,
    
    -- Type-specific overrides (optional, JSONB)
    type_preferences JSONB,
    
    -- Smart features
    smart_grouping BOOLEAN NOT NULL DEFAULT true,
    daily_digest BOOLEAN NOT NULL DEFAULT false,
    daily_digest_time TIME DEFAULT '08:00',
    weekly_recap BOOLEAN NOT NULL DEFAULT true,
    
    -- FCM/APNs tokens for push notifications
    fcm_token VARCHAR(500),
    apns_token VARCHAR(500),
    
    -- Audit columns
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(36),
    updated_by VARCHAR(36)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. Migrate existing data to use new category field
-- =====================================================

-- Map old types to categories
UPDATE notifications SET category = 'ai' WHERE type IN ('AI_SCRUM_MASTER');
UPDATE notifications SET category = 'challenges' WHERE type IN ('CHALLENGE');
UPDATE notifications SET category = 'events' WHERE type IN ('FAMILY', 'REMINDER');
UPDATE notifications SET category = 'system' WHERE type IN ('SYSTEM', 'ACHIEVEMENT');

-- Set default priority for existing notifications
UPDATE notifications SET priority = 'medium' WHERE priority IS NULL;
