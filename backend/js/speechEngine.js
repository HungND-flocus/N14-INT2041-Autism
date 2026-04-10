/**
 * Adaptive Web Speech API Engine for SpeechSpark
 * Implements the logic defined in backend/architecture/speech-recognition.md
 */

export class SpeechEngine {
    constructor() {
        this.recognition = null;
        this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        if (this.isSupported) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            // Configuration for primary target: children
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'vi-VN'; // Vietnamese primary
            this.recognition.maxAlternatives = 3;
        }
    }

    /**
     * Start listening and return a promise that resolves with the transcribed text.
     */
    listen(timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            if (!this.isSupported) {
                return reject(new Error("Speech Recognition not supported in this browser."));
            }

            let timeoutId;
            let resultProcessed = false;

            this.recognition.onresult = (event) => {
                if (resultProcessed) return;
                resultProcessed = true;
                clearTimeout(timeoutId);
                
                // Get the best result
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                const alternatives = [];
                
                // Gather alternatives for fuzzy matching
                for (let i = 0; i < event.results[0].length; i++) {
                    alternatives.push(event.results[0][i].transcript.toLowerCase().trim());
                }
                
                resolve({
                    text: transcript,
                    alternatives,
                    confidence: event.results[0][0].confidence
                });
            };

            this.recognition.onerror = (event) => {
                if (resultProcessed) return;
                resultProcessed = true;
                clearTimeout(timeoutId);
                console.error("Speech Recognition Error:", event.error);
                reject(event.error);
            };

            this.recognition.onend = () => {
                if (!resultProcessed) {
                    resultProcessed = true;
                    clearTimeout(timeoutId);
                    resolve({ text: "", alternatives: [], confidence: 0, _note: "No speech detected" });
                }
            };

            try {
                this.recognition.start();
                
                timeoutId = setTimeout(() => {
                    if (!resultProcessed) {
                        this.recognition.stop();
                        reject(new Error("Timeout: No speech detected within the given timeframe."));
                    }
                }, timeoutMs);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Compare transcribed text with target text using fuzzy matching and phonetic approximations.
     * Children often mispronounce consonants.
     */
    static checkMatch(transcribedResult, targetWord, toleranceLevel = 'medium') {
        if (!transcribedResult.text || transcribedResult.text === "") return { isMatch: false, reason: "No input" };
        
        const target = targetWord.toLowerCase().trim();
        
        // Exact match on the primary transcript
        if (transcribedResult.text === target) return { isMatch: true, confidence: 1.0 };
        
        // Match in alternatives
        if (transcribedResult.alternatives.includes(target)) {
            return { isMatch: true, confidence: 0.8, reason: "Matched alternative" };
        }

        // Fuzzy match: check if the target word is contained within the speech
        if (transcribedResult.text.includes(target)) {
             return { isMatch: true, confidence: 0.7, reason: "Contains target" };
        }

        // Add phonetic normalization (e.g., specific Vietnamese child errors like 'r'->'g', 'tr'->'ch')
        const normalize = (str) => {
             return str.replace(/r/g, 'g')
                       .replace(/tr/g, 'ch')
                       .replace(/s/g, 'x');
        };

        if (normalize(transcribedResult.text) === normalize(target)) {
             return { isMatch: true, confidence: 0.6, reason: "Phonetic match" };
        }

        return { isMatch: false, reason: "No acceptable match found" };
    }
}
