document.addEventListener('DOMContentLoaded', () => {
    // Map of button/link text content to destination HTML pages
    const routes = [
        { text: '🚀 Bắt Đầu', url: 'auth.html', exact: false },
        { text: '👨‍👩‍👧 Phụ huynh', url: 'auth.html?role=parent', exact: false },
        { text: '📖 Học tiếp', url: 'practice.html', exact: false },
        { text: '📚 Chọn bài học', url: 'lessons.html', exact: false },
        { text: '📚 Chọn bài', url: 'lessons.html', exact: false },
        { text: 'Học bài tiếp', url: 'dashboard.html', exact: false },
        { text: 'Xem lại lỗi', url: 'review.html', exact: false },
        { text: 'Quay về', url: 'dashboard.html', exact: false },
        { text: 'Luyện lại', url: 'practice.html', exact: false },
        { text: 'Lưu cài đặt', url: 'admin.html', exact: false },
        { text: 'Cài đặt', url: 'settings.html', exact: true },
        // Bottom Nav
        { text: 'Play', url: 'dashboard.html', exact: true },
        { text: 'Library', url: 'lessons.html', exact: true },
        { text: 'Progress', url: 'achievements.html', exact: true },
        { text: 'Milestones', url: 'achievements.html', exact: true },
        { text: 'Parents', url: 'admin.html', exact: true }
    ];

    // Find all clickable elements
    const elements = document.querySelectorAll('button, a, div[class*="cursor-pointer"]');
    
    elements.forEach(el => {
        const text = el.textContent.trim();
        if (!text) return;

        // Try to find a matching route
        for (const route of routes) {
            const match = route.exact ? text === route.text : text.includes(route.text);
            if (match) {
                // Attach navigation
                el.addEventListener('click', (e) => {
                    // Only prevent default if it's not already a valid link with an href
                    if (el.tagName !== 'A' || el.getAttribute('href') === '#') {
                        e.preventDefault();
                        console.log(`Navigating to ${route.url} via '${route.text}'`);
                        window.location.href = route.url;
                    }
                });
                
                // If it's an <a> tag pointing to #, update its href explicitly for better UX
                if (el.tagName === 'A' && el.getAttribute('href') === '#') {
                    el.href = route.url;
                }
                break; // Stop looking after first match
            }
        }
    });

    // Special cases: Back buttons (often just icons)
    const backButtons = document.querySelectorAll('button:has(span:contains("arrow_back")), .material-symbols-outlined:contains("arrow_back")');
    backButtons.forEach(btn => {
        // Go back in history
        btn.addEventListener('click', () => { window.history.back(); });
    });
});

// Polyfill for :has and :contains if needed, but we keep it safe
document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
    if (icon.textContent.trim() === 'arrow_back') {
         icon.closest('button, a, div')?.addEventListener('click', () => {
             window.history.back();
         });
    }
});
