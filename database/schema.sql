-- FluencyPlus Database Schema

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

CREATE TABLE public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(50) NOT NULL CHECK (char_length(trim(word)) BETWEEN 1 AND 50),
    language_code VARCHAR(10) NOT NULL,
    image_url TEXT NOT NULL CHECK (image_url ~* '^https?://.+\.(png|jpg|jpeg)(\?.*)?$'),
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_language VARCHAR(10) NOT NULL,
    reward_sticker VARCHAR(100),
    next_story_slug VARCHAR(100),
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.story_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    page_number INT NOT NULL CHECK (page_number BETWEEN 1 AND 20),
    title VARCHAR(200) NOT NULL,
    caption TEXT,
    illustration_emoji VARCHAR(10),
    illustration_title VARCHAR(200),
    illustration_caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (story_id, page_number)
);

CREATE TABLE public.story_blanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_page_id UUID NOT NULL REFERENCES public.story_pages(id) ON DELETE CASCADE,
    blank_order INT NOT NULL CHECK (blank_order BETWEEN 1 AND 3),
    prompt_text TEXT NOT NULL,
    segment_before TEXT NOT NULL,
    segment_after TEXT NOT NULL,
    correct_flashcard_id UUID NOT NULL REFERENCES public.flashcards(id),
    distractor_1_id UUID NOT NULL REFERENCES public.flashcards(id),
    distractor_2_id UUID NOT NULL REFERENCES public.flashcards(id),
    distractor_3_id UUID NOT NULL REFERENCES public.flashcards(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (story_page_id, blank_order),
    CHECK (
        correct_flashcard_id <> distractor_1_id AND
        correct_flashcard_id <> distractor_2_id AND
        correct_flashcard_id <> distractor_3_id AND
        distractor_1_id <> distractor_2_id AND
        distractor_1_id <> distractor_3_id AND
        distractor_2_id <> distractor_3_id
    )
);

CREATE TABLE public.child_story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    current_page INT NOT NULL DEFAULT 1 CHECK (current_page >= 1),
    wrong_attempts INT NOT NULL DEFAULT 0 CHECK (wrong_attempts >= 0),
    completed_blanks INT NOT NULL DEFAULT 0 CHECK (completed_blanks >= 0),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (child_id, story_id)
);

CREATE TABLE public.blank_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    story_page_id UUID NOT NULL REFERENCES public.story_pages(id) ON DELETE CASCADE,
    story_blank_id UUID NOT NULL REFERENCES public.story_blanks(id) ON DELETE CASCADE,
    chosen_flashcard_id UUID NOT NULL REFERENCES public.flashcards(id),
    correct_flashcard_id UUID NOT NULL REFERENCES public.flashcards(id),
    is_correct BOOLEAN NOT NULL,
    attempt_number INT NOT NULL CHECK (attempt_number >= 1),
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_story_pages_story_page ON public.story_pages(story_id, page_number);
CREATE INDEX idx_story_blanks_page_order ON public.story_blanks(story_page_id, blank_order);
CREATE INDEX idx_blank_answers_child_story ON public.blank_answers(child_id, story_id, story_page_id, story_blank_id);
CREATE INDEX idx_child_story_progress_child_story ON public.child_story_progress(child_id, story_id);
