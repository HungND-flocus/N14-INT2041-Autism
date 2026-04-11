-- SpeechSpark Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles: Extends Supabase auth.users to store additional information, including personalization.
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'child' CHECK (role IN ('parent', 'child', 'admin')),
    full_name VARCHAR(100),
    -- Personalize Data
    avatar_url VARCHAR(255),
    companion_type VARCHAR(50),      -- e.g. 'Robot', 'Thú cưng', 'Siêu nhân'
    feedback_mode VARCHAR(50),       -- e.g. 'Âm thanh', 'Hình ảnh', 'Rung', 'Kết hợp'
    session_duration_minutes INT,    -- e.g. 5, 10, 15
    phone_number VARCHAR(20),
    username VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Parent-Child Relationship: Allows parents to manage multiple children accounts.
CREATE TABLE public.parent_child (
    parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_id, child_id)
);

-- 3. Lessons: Available speech therapy lessons.
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Lesson Progress: Tracks each child's progress on specific lessons.
CREATE TABLE public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'in_progress', 'completed')),
    score INT DEFAULT 0,
    time_spent_seconds INT DEFAULT 0,
    last_played_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(child_id, lesson_id)
);

-- 5. Achievements: Gamification elements to reward children.
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
