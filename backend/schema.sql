-- Database schema for SpeechSpark: Luyện Nói Vui

-- Enums
CREATE TYPE user_role AS ENUM ('child', 'parent', 'teacher', 'admin');
CREATE TYPE task_type AS ENUM ('listen_choose', 'listen_repeat', 'short_sentence');
CREATE TYPE lesson_difficulty AS ENUM ('easy', 'medium', 'hard');

-- 1. Profiles Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'child',
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    -- Child specific fields
    age_group TEXT,
    support_level TEXT,
    feedback_mode TEXT DEFAULT 'combined',
    -- Parent/Child relationship
    parent_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Lessons Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty lesson_difficulty DEFAULT 'easy',
    duration_minutes INTEGER DEFAULT 5,
    cover_image_url TEXT,
    target_skills TEXT[],
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Lesson Tasks Table
CREATE TABLE lesson_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    task_order INTEGER NOT NULL,
    type task_type NOT NULL,
    instruction_text TEXT NOT NULL,
    instruction_audio_url TEXT,
    target_word TEXT,
    -- Options for 'listen_choose'
    options JSONB, -- Array of objects: { "image_url": "...", "is_correct": boolean }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Progress Table
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- 0-100
    attempts JSONB, -- Array of objects counting correct/incorrect per task
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Error Logs Table (For adaptive learning engine)
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES lesson_tasks(id) ON DELETE SET NULL,
    error_type TEXT NOT NULL, -- e.g., 'pronunciation', 'skipped', 'wrong_choice'
    audio_recording_url TEXT, -- Client native speech API fallback
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Badges Table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL
);

-- 7. Child Badges Table
CREATE TABLE child_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(child_id, badge_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_badges ENABLE ROW LEVEL SECURITY;

-- Lesson Read access (Public/Authenticated)
CREATE POLICY "Lessons are readable by everyone" ON lessons FOR SELECT USING (is_published = true);
CREATE POLICY "Tasks are readable by everyone" ON lesson_tasks FOR SELECT USING (true);
CREATE POLICY "Badges are readable by everyone" ON badges FOR SELECT USING (true);

-- User controls their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Parents can view linked child profiles" ON profiles FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Progress tracking
CREATE POLICY "Children can insert progress" ON progress FOR INSERT WITH CHECK (auth.uid() = child_id);
CREATE POLICY "Children can view own progress" ON progress FOR SELECT USING (auth.uid() = child_id);
CREATE POLICY "Parents can view child progress" ON progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = progress.child_id AND parent_id = auth.uid())
);
