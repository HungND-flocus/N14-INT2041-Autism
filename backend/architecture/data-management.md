# Backend Architecture SOP: Data Management

## Purpose
Handles all data operations for SpeechSpark: user profiles, lesson content, progress tracking.

## Data Source
**Supabase** — PostgreSQL database with Row Level Security.

## Tables
1. `profiles` — User profiles (children, parents, teachers, admins)
2. `lessons` — Lesson content with tasks
3. `progress` — Per-child, per-lesson completion records
4. `badges` — Achievement definitions
5. `child_badges` — Earned badges per child
6. `lesson_tasks` — Individual tasks within lessons
7. `error_logs` — Pronunciation/interaction errors for review

## Key Operations
- **Create Profile** → INSERT into profiles with role and preferences
- **Get Lessons** → SELECT with filters (topic, difficulty, skills)
- **Record Progress** → INSERT progress record + UPDATE profile stats
- **Get Dashboard Data** → Aggregated queries for charts/stats
- **Adaptive Logic** → Query recent errors to adjust next lesson difficulty

## Edge Cases
- If child has no progress records → show onboarding suggestions
- If lesson has no tasks → mark as draft, don't show to children
- If progress score < 40% for 3 consecutive lessons → auto-reduce difficulty
- If session exceeds configured duration → trigger break reminder

## Security Rules
- Children can only read their own profiles and progress
- Parents can read/write profiles of linked children
- Admins can CRUD all lessons
- No direct database access from frontend without RLS
