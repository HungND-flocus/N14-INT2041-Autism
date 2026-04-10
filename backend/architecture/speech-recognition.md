# Backend Architecture SOP: Speech Recognition

## Purpose
Handles speech input from children, compares against expected pronunciation, and provides similarity feedback.

## Technology
**Web Speech API** (browser-native) — no external API needed for basic recognition.

## Flow
1. Child taps microphone button → browser requests mic permission
2. `SpeechRecognition` API starts listening
3. On result → compare recognized text with expected answer
4. Calculate similarity score (Levenshtein distance / fuzzy match)
5. Return feedback: "correct" (≥80%) / "close" (50-79%) / "try again" (<50%)

## Feedback Rules
- **Correct (≥80%)**: Play celebration sound, show star animation, advance
- **Close (50-79%)**: Play encouraging sound, show "almost!" with hint, allow retry
- **Try Again (<50%)**: Play gentle prompt, show visual hint, slow down audio model
- **Silence (>5 seconds)**: Auto-show hint, play prompt again slowly
- **3 failures**: Auto-skip with support note, log error for review

## Edge Cases
- Browser doesn't support Web Speech API → fall back to tap-to-choose mode
- Noisy environment → increase similarity threshold tolerance
- Child speaks different language → only match against lesson language

## Privacy
- No audio is stored on servers
- All recognition happens client-side in the browser
- Parents can disable voice features in accessibility settings

## Limitations
- Web Speech API accuracy varies by browser
- Vietnamese speech recognition has lower accuracy than English
- This is a PRACTICE TOOL, not a diagnostic instrument
