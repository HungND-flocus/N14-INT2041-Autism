const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'frontend', 'public');

const getNavHTML = (activePage) => {
    const items = [
        { id: 'dashboard.html', text: 'Chơi', icon: 'videogame_asset' },
        { id: 'lessons.html', text: 'Thư Viện', icon: 'local_library' },
        { id: 'results.html', text: 'Thành Tựu', icon: 'stars' },
        { id: 'admin.html', text: 'Phụ huynh', icon: 'family_restroom' }
    ];

    let html = `<nav class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#FFF9EC]/90 backdrop-blur-lg shadow-[0_-4px_40px_0_rgba(0,0,0,0.06)] rounded-t-[3rem]">\n`;

    items.forEach(item => {
        const isActive = activePage === item.id;
        const className = isActive 
            ? `flex flex-col items-center justify-center bg-[#FFD93D] text-[#705D00] rounded-full px-6 py-2 shadow-lg transition-all duration-150`
            : `flex flex-col items-center justify-center text-[#006590] p-2 hover:bg-[#E2D5FF] rounded-full transition-all duration-200`;
            
        const iconStyle = isActive 
            ? `class="material-symbols-outlined active-icon" style="font-variation-settings: 'FILL' 1;"`
            : `class="material-symbols-outlined"`;

        html += `    <a href="${item.id}" class="${className}">\n`;
        html += `        <span ${iconStyle}>${item.icon}</span>\n`;
        html += `        <span class="font-headline text-[11px] font-bold uppercase tracking-wider mt-1">${item.text}</span>\n`;
        html += `    </a>\n`;
    });

    html += `</nav>`;
    return html;
};

fs.readdirSync(publicDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(publicDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find existing nav bar
        const navRegex = /<nav class="[^"]*bottom-0[^>]*>[\s\S]*?<\/nav>/;
        
        if (navRegex.test(content)) {
            // Only update files that conceptually should have a bottom nav
            const validNavPages = ['index.html', 'dashboard.html', 'lessons.html', 'results.html', 'admin.html'];
            
            // Generate standard nav
            const newNav = getNavHTML(file);
            content = content.replace(navRegex, newNav);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated bottom nav in ${file}`);
        }
    }
});
