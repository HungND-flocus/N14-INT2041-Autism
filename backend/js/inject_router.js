const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'frontend', 'public');

fs.readdirSync(publicDir).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(publicDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (!content.includes('js/router.js')) {
            content = content.replace('</body>', '<script src="js/router.js"></script>\n</body>');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Injected router into ${file}`);
        }
    }
});
