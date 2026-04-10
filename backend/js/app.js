import { supabase } from './supabaseClient.js';
import { SpeechEngine } from './speechEngine.js';

// Global App State
const state = {
    user: null,
    currentLesson: null,
    speechEngine: new SpeechEngine()
};

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log("SpeechSpark App Initialized");
    
    // Check if speech engine is supported
    if (!state.speechEngine.isSupported) {
        console.warn("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
        showNotification("Trình duyệt của bạn không hỗ trợ tính năng nhận diện giọng nói. Hãy dùng trình duyệt Chrome nhé!");
    }

    // Attach global listeners for UI buttons
    attachGlobalListeners();
});

function attachGlobalListeners() {
    // Demo: Attach to practice button if it exists
    const practiceBtn = document.querySelector('.btn-practice-speak'); // hypothetical class
    if (practiceBtn) {
        practiceBtn.addEventListener('click', handlePracticeClick);
    }
}

async function handlePracticeClick(e) {
    const btn = e.currentTarget;
    const targetWord = btn.dataset.targetWord || "con mèo"; // Default for demo

    btn.classList.add('recording');
    console.log("Listening for word:", targetWord);

    try {
        const result = await state.speechEngine.listen(5000);
        btn.classList.remove('recording');
        
        console.log("Heard:", result.text);
        
        const match = SpeechEngine.checkMatch(result, targetWord);
        if (match.isMatch) {
            handleSuccess(match);
        } else {
            handleError(match);
        }
    } catch (error) {
        btn.classList.remove('recording');
        console.error("Listen error:", error);
    }
}

function handleSuccess(matchInfo) {
    console.log("Great job! Matched with confidence:", matchInfo.confidence);
    // UI logic to show ✨ Success state
}

function handleError(matchInfo) {
    console.log("Didn't match target word. Reason:", matchInfo.reason);
    // UI logic to show 🔄 Try Again state 
    // Trigger adaptive logic (e.g., lower difficulty or show hint)
}

function showNotification(message) {
    // Simple alert for now - would be a custom UI component
    alert(message);
}
