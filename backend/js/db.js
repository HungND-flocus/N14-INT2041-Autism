// SpeechSpark - Database Helper Module
// Requires: supabaseClient.js loaded first (provides global `supabaseClient`)

const DB = {
    // ==================== AUTH ====================
    async signUp(email, password, fullName, phone, username, role = 'child') {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, role } }
        });
        if (error) throw error;

        // Create profile
        if (data.user) {
            const { error: profileError } = await supabaseClient
                .from('profiles')
                .insert({
                    id: data.user.id,
                    role,
                    full_name: fullName,
                    phone_number: phone,
                    username
                });
            if (profileError) console.error('Profile creation error:', profileError);
        }
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return session;
    },

    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    // ==================== PROFILES ====================
    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    async updateProfile(userId, updates) {
        // Handle cases where profile might not exist (e.g. auth user created but profile trigger failed)
        const { data: existing } = await supabaseClient
            .from('profiles')
            .select('id')
            .eq('id', userId)
            .maybeSingle();

        if (existing) {
            const { data, error } = await supabaseClient
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabaseClient
                .from('profiles')
                .insert({ id: userId, role: 'child', ...updates, updated_at: new Date().toISOString() })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    /**
     * Check if onboarding is complete (nickname, age_group, support_level, language)
     */
    isOnboardingComplete(profile) {
        return !!(profile.nickname && profile.age_group && profile.support_level && profile.language);
    },

    /**
     * Check if personalization is complete (avatar_url, companion_type, feedback_mode, session_duration_minutes)
     */
    isPersonalizeComplete(profile) {
        return !!(profile.avatar_url && profile.companion_type && profile.feedback_mode && profile.session_duration_minutes);
    },

    // ==================== LESSONS ====================
    async getLessons() {
        const { data, error } = await supabaseClient
            .from('lessons')
            .select('*')
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    },

    async getLessonByCategory(category) {
        const { data, error } = await supabaseClient
            .from('lessons')
            .select('*')
            .eq('category', category)
            .single();
        if (error) throw error;
        return data;
    },

    async getLessonTasks(lessonId) {
        const { data, error } = await supabaseClient
            .from('lesson_tasks')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('task_order', { ascending: true });
        if (error) throw error;
        return data;
    },

    // ==================== PROGRESS ====================
    async getProgressForUser(userId) {
        const { data, error } = await supabaseClient
            .from('lesson_progress')
            .select('*, lessons(*)')
            .eq('child_id', userId);
        if (error) throw error;
        return data || [];
    },

    async getProgressForLesson(userId, lessonId) {
        const { data, error } = await supabaseClient
            .from('lesson_progress')
            .select('*')
            .eq('child_id', userId)
            .eq('lesson_id', lessonId)
            .maybeSingle();
        if (error) throw error;
        return data;
    },

    async upsertProgress(userId, lessonId, questionsCompleted, totalQuestions, score, stars) {
        const status = questionsCompleted >= totalQuestions ? 'completed' : 'in_progress';

        // Check if record exists
        const existing = await this.getProgressForLesson(userId, lessonId);

        if (existing) {
            const { data, error } = await supabaseClient
                .from('lesson_progress')
                .update({
                    questions_completed: questionsCompleted,
                    total_questions: totalQuestions,
                    score,
                    stars_earned: stars,
                    status,
                    last_played_at: new Date().toISOString()
                })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabaseClient
                .from('lesson_progress')
                .insert({
                    child_id: userId,
                    lesson_id: lessonId,
                    questions_completed: questionsCompleted,
                    total_questions: totalQuestions,
                    score,
                    stars_earned: stars,
                    status,
                    last_played_at: new Date().toISOString()
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    /**
     * Calculate total stars for a user across all lessons
     */
    async getTotalStars(userId) {
        const progress = await this.getProgressForUser(userId);
        return progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    },

    /**
     * Calculate overall progress percentage
     */
    async getOverallProgress(userId) {
        const progress = await this.getProgressForUser(userId);
        if (progress.length === 0) return 0;
        const totalCompleted = progress.reduce((sum, p) => sum + (p.questions_completed || 0), 0);
        const totalQuestions = progress.reduce((sum, p) => sum + (p.total_questions || 3), 0);
        // We have 3 lessons × 3 questions = 9 total
        return Math.round((totalCompleted / 9) * 100);
    },

    // ==================== ACHIEVEMENTS ====================
    async getAchievements(userId) {
        const { data, error } = await supabaseClient
            .from('achievements')
            .select('*')
            .eq('child_id', userId);
        if (error) throw error;
        return data || [];
    },

    async addAchievement(userId, badgeName, description, iconUrl) {
        // Check if already earned
        const existing = await this.getAchievements(userId);
        if (existing.find(a => a.badge_name === badgeName)) return null;

        const { data, error } = await supabaseClient
            .from('achievements')
            .insert({
                child_id: userId,
                badge_name: badgeName,
                description,
                icon_url: iconUrl
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /**
     * Check and award badges based on current progress
     * Returns array of newly earned badges
     */
    async checkAndAwardBadges(userId) {
        const progress = await this.getProgressForUser(userId);
        const existingBadges = await this.getAchievements(userId);
        const existingNames = existingBadges.map(b => b.badge_name);
        const newBadges = [];

        const BADGE_DEFS = [
            { 
                name: 'Nhà Thám Hiểm', 
                category: 'nature', 
                description: 'Hoàn thành bài Thiên Nhiên',
                icon: '🌿'
            },
            { 
                name: 'Bạn Của Muông Thú', 
                category: 'animals', 
                description: 'Hoàn thành bài Động Vật',
                icon: '🐾'
            },
            { 
                name: 'Ngôi Sao Gia Đình', 
                category: 'family', 
                description: 'Hoàn thành bài Gia Đình',
                icon: '💕'
            },
            { 
                name: 'Siêu Sao Ngôn Ngữ', 
                category: 'all', 
                description: 'Hoàn thành tất cả bài học',
                icon: '🏆'
            }
        ];

        for (const badge of BADGE_DEFS) {
            if (existingNames.includes(badge.name)) continue;

            if (badge.category === 'all') {
                // Check all lessons completed
                const completedLessons = progress.filter(p => p.status === 'completed');
                if (completedLessons.length >= 3) {
                    const awarded = await this.addAchievement(userId, badge.name, badge.description, badge.icon);
                    if (awarded) newBadges.push(awarded);
                }
            } else {
                // Check specific category
                const lessonProgress = progress.find(p => p.lessons?.category === badge.category);
                if (lessonProgress && lessonProgress.status === 'completed') {
                    const awarded = await this.addAchievement(userId, badge.name, badge.description, badge.icon);
                    if (awarded) newBadges.push(awarded);
                }
            }
        }

        return newBadges;
    },

    // ==================== STARS ====================
    async updateTotalStars(userId) {
        const totalStars = await this.getTotalStars(userId);
        await this.updateProfile(userId, { total_stars: totalStars });
        return totalStars;
    }
};

console.log('✅ DB Helper Module Loaded');
