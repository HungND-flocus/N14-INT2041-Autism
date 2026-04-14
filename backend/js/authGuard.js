// SpeechSpark - Auth Guard
// Requires: supabaseClient.js and db.js loaded first
// Include this script on pages that require authentication

const AuthGuard = {
    /**
     * Determine the correct redirect page after login based on profile completeness.
     * @param {string} userId
     * @returns {string} URL to redirect to
     */
    async getPostLoginRedirect(userId) {
        try {
            const profile = await DB.getProfile(userId);

            // Parent role → always go to admin
            if (profile.role === 'parent') {
                return 'admin.html';
            }

            // Child role → check profile completeness
            if (!DB.isOnboardingComplete(profile)) {
                return 'onboarding.html';
            }
            if (!DB.isPersonalizeComplete(profile)) {
                return 'personalize.html';
            }

            return 'dashboard.html';
        } catch (err) {
            console.error('AuthGuard error:', err);
            // If profile doesn't exist yet (new signup), go to onboarding
            return 'onboarding.html';
        }
    },

    /**
     * Check if user is logged in. If not, redirect to auth.html.
     * If logged in, return the user object.
     * Use on protected pages (dashboard, lessons, practice, etc.)
     */
    async requireAuth() {
        const session = await DB.getSession();
        if (!session) {
            window.location.href = 'auth.html';
            return null;
        }
        return session.user;
    },

    /**
     * If user is already logged in, skip auth page and go to the right place.
     * Use on auth.html and signup.html.
     */
    async redirectIfLoggedIn() {
        const session = await DB.getSession();
        if (session) {
            const redirect = await this.getPostLoginRedirect(session.user.id);
            window.location.href = redirect;
            return true;
        }
        return false;
    }
};

console.log('✅ AuthGuard Module Loaded');
