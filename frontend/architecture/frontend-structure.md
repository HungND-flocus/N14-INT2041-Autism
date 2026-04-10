# Frontend Architecture SOP

## Purpose
Defines the frontend structure, component hierarchy, and interaction patterns for SpeechSpark.

## Technology
- HTML5 + CSS3 + Vanilla JavaScript
- No framework (maximize simplicity and accessibility)
- Web Speech API for voice interaction
- CSS custom properties for theming
- CSS Grid + Flexbox for layouts

## Page Structure
All child-facing pages share:
```
<header> — Companion character + audio guidance button
<main> — Primary content area (max 800px centered)
<footer> — Navigation tabs (max 4 icons)
```

Parent/teacher dashboard uses:
```
<header> — Logo + user menu
<aside> — Side navigation
<main> — Dashboard content (max 1200px)
```

## Component Hierarchy
```
frontend/
├── public/
│   ├── index.html (Homepage)
│   ├── onboarding.html
│   ├── personalize.html
│   ├── dashboard.html (Child)
│   ├── lessons.html (Library)
│   ├── lesson-detail.html
│   ├── practice.html (Lesson Player)
│   ├── results.html
│   ├── review.html (Error Review)
│   ├── admin.html (Parent/Teacher Dashboard)
│   └── settings.html (Accessibility)
├── assets/
│   ├── css/
│   │   ├── design-tokens.css (CSS custom properties)
│   │   ├── components.css
│   │   ├── layouts.css
│   │   └── animations.css
│   ├── js/
│   │   ├── app.js (Router + global state)
│   │   ├── speech.js (Web Speech API wrapper)
│   │   ├── adaptive.js (Difficulty engine)
│   │   ├── audio.js (Audio playback)
│   │   └── rewards.js (Badges/stars/animations)
│   ├── audio/ (Sound effects + prompts)
│   └── images/ (Icons, companions, lesson images)
└── README.md
```

## Interaction Patterns
1. **Touch/Click**: Primary interaction. All targets ≥48px.
2. **Voice**: Secondary. Mic button → listen → feedback loop.
3. **Drag & Drop**: For sentence construction tasks. HTML5 native.
4. **Audio Playback**: Speaker buttons trigger lesson audio.

## Accessibility Requirements
- All images have alt text
- All audio has visual fallback
- High contrast mode via CSS custom property toggle
- Large text mode via font-size scale
- Keyboard navigation for all interactive elements
- ARIA labels on all buttons and interactive elements
