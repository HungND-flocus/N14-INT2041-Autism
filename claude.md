# Project Constitution — SpeechSpark (Luyện Nói Vui)

> **This file is LAW.** All schemas, rules, and architectural invariants are defined here.

---

## 1. Project Identity
- **Name:** SpeechSpark — Interactive Speech Practice for Children
- **Vietnamese Name:** Luyện Nói Vui
- **Type:** Web Application (Frontend + Backend)
- **Location:** `c:\Users\Dell\.gemini\antigravity\scratch\Skill-Master`
- **Initialized:** 2026-04-10

## 2. Discovery Answers

### 🎯 North Star
Build an interactive, child-friendly website for speech therapy practice for children with language difficulties. Focus on multimodal interaction (touch, voice, audio, images), adaptive difficulty, gamification, and progress tracking — WITHOUT making medical claims.

### 🔌 Integrations
- **Stitch MCP** → UI/UX screen generation
- **Supabase** → Database (users, lessons, progress)
- **Web Speech API** → Browser-native speech recognition
- **Audio/TTS** → Text-to-speech for lesson prompts

### 📦 Source of Truth
- **Lesson Content** → Supabase database (structured JSON)
- **User Profiles** → Supabase auth + profiles table
- **Progress Data** → Supabase (per-child, per-lesson tracking)
- **UI Designs** → Stitch project screens

### 📬 Delivery Payload
- Frontend HTML/CSS/JS pages in `frontend/`
- Backend architecture/tools in `backend/`
- Stitch-generated UI screens
- Progress dashboards for parents/teachers

### ⚖️ Behavioral Rules
1. **NEVER** claim to diagnose or treat medical conditions
2. **ALWAYS** use encouraging, positive feedback (never punishing)
3. Child UI: minimal text, large icons, bright friendly colors, audio guidance
4. Adaptive: reduce difficulty on repeated failures, increase on success
5. Session limits: suggest breaks after configured time
6. All feedback is "supportive practice tool" language only
7. Vietnamese language primary, interface language selectable

## 3. Data Schema

### User Profile
```json
{
  "id": "uuid",
  "name": "string",
  "nickname": "string",
  "age_group": "3-4 | 4-5 | 5-6 | 6-7 | 7+",
  "support_level": "light | moderate | high",
  "goals": ["pronunciation", "vocabulary", "short_sentences", "communication"],
  "avatar": "string (preset key)",
  "companion": "pet | robot | superhero",
  "feedback_mode": "audio | visual | vibration | combined",
  "session_duration_minutes": 5 | 10 | 15,
  "language": "vi | en",
  "role": "child | parent | teacher | admin",
  "accessibility": {
    "audio_guidance": true,
    "slow_speech": false,
    "large_text": false,
    "high_contrast": false,
    "auto_play_audio": true,
    "ai_support_level": "low | medium | high"
  }
}
```

### Lesson
```json
{
  "id": "uuid",
  "title": "string",
  "topic": "animals | food | family | school | emotions | ...",
  "difficulty": "easy | medium | hard",
  "skills": ["listening", "speaking", "vocabulary", "sentences", "communication"],
  "duration_minutes": 5,
  "star_rating": 0-5,
  "description_parent": "string",
  "tasks": [
    {
      "type": "listen_choose_image | listen_repeat | choose_word | drag_drop | speak_context | dialogue | reflex_game",
      "prompt_text": "string",
      "prompt_audio": "url",
      "options": [],
      "correct_answer": "string | index",
      "hint": { "image": "url", "syllable": "string", "slow_audio": "url" }
    }
  ],
  "sections": {
    "warmup": [...],
    "introduction": [...],
    "practice": [...],
    "extended": [...],
    "conclusion": [...]
  }
}
```

### Progress Record
```json
{
  "child_id": "uuid",
  "lesson_id": "uuid",
  "completed_at": "timestamp",
  "score": 0-100,
  "correct_count": "int",
  "total_tasks": "int",
  "attempts": "int",
  "errors": [
    { "task_id": "uuid", "error_type": "wrong_pronunciation | no_repeat | wrong_image | skipped" }
  ],
  "badges_earned": ["string"],
  "duration_seconds": "int"
}
```

## 4. Sitemap (11 Pages)

| # | Page | Route | Device | Priority |
|---|------|-------|--------|----------|
| 1 | Homepage | `/` | Desktop | P0 |
| 2 | Onboarding | `/onboarding` | Desktop | P0 |
| 3 | Personalization | `/personalize` | Desktop | P1 |
| 4 | Child Dashboard | `/dashboard` | Desktop | P0 |
| 5 | Lesson Library | `/lessons` | Desktop | P0 |
| 6 | Lesson Detail | `/lessons/:id` | Desktop | P1 |
| 7 | Lesson Player | `/practice` | Desktop | P0 |
| 8 | Results & Rewards | `/results` | Desktop | P1 |
| 9 | Error Review | `/review` | Desktop | P2 |
| 10 | Parent/Teacher Dashboard | `/admin` | Desktop | P0 |
| 11 | Accessibility Settings | `/settings` | Desktop | P2 |

## 5. Architectural Invariants
- Frontend lives in `frontend/`
- Backend lives in `backend/`
- Stitch files live in `.stitch/`
- Skills remain in `.agent/skills/`
- No hardcoded API keys in source files
- Child-facing UI: max 2-3 choices per screen
- All audio content must have visual fallback
- All interactive elements must be touch-friendly (min 48px tap target)

## 6. Behavioral Rules (System)
1. Self-Annealing: every error → analyze → patch → test → update architecture
2. `claude.md` is law; planning files are memory
3. No code in `tools/` without approved Blueprint
4. Update `progress.md` after every meaningful action

## 7. Maintenance Log
| Date | Change | Author |
|------|--------|--------|
| 2026-04-10 | Constitution initialized with discovery answers | System Pilot |
| 2026-04-10 | Data schemas defined (User, Lesson, Progress) | System Pilot |
| 2026-04-10 | Sitemap defined (11 pages) | System Pilot |
