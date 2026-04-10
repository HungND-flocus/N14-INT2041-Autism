# Backend Architecture SOP: Adaptive Learning Engine

## Purpose
Dynamically adjusts lesson difficulty and content based on child's real-time performance.

## Inputs
- Recent progress records (last 5 lessons)
- Current lesson task performance (in-session)
- Error frequency by type
- Session duration elapsed
- Child's configured support level

## Decision Rules

### Difficulty Adjustment
| Condition | Action |
|-----------|--------|
| 3+ consecutive correct, fast (<5s each) | Increase difficulty: next lesson +1 level |
| Score ≥ 80% on current lesson | Suggest harder lesson in same topic |
| Score 50-79% | Stay at current difficulty |
| Score < 50% for current lesson | Decrease difficulty: next lesson -1 level |
| 3 consecutive lessons < 40% | Alert parent, auto-reduce to easiest |

### In-Session Adaptation
| Condition | Action |
|-----------|--------|
| 2 failures on same task | Show hint automatically |
| 3 failures on same task | Play slow audio + visual hint |
| 4 failures on same task | Skip with encouragement, log for review |
| Silence > 5 seconds | Show prompt, play audio again |
| Session time > configured limit | Show break suggestion |

### Topic Preference
- Track which topics child engages with most (time spent + completion rate)
- Weight suggested lessons toward preferred topics (60/40 split with needed practice)

## Output
- `next_lesson_suggestion`: Recommended next lesson ID + difficulty
- `difficulty_adjustment`: -1, 0, or +1
- `session_alert`: null | "break_suggested" | "parent_alert"
- `adapted_hints`: Array of hint objects for current session
