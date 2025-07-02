// List of facility type pages to update
const pages = [
    'clinics.html',
    'pharmacies.html',
    'laboratories.html',
    'diagnostic-centers.html',
    'rehabilitation-centers.html'
];

// Template for the head section updates
const headUpdates = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="dark-theme.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="js/theme-switcher.js"></script>
`;

// Function to update a single page
function updatePage(page) {
    const fs = require('fs');
    const path = require('path');
    
    const filePath = path.join(__dirname, page);
    
    // Read the file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${page}:`, err);
            return;
        }
        
        // Add theme switcher script before the closing head tag
        let updatedContent = data.replace(
            '</head>', 
            `    ${headUpdates}
</head>`
        );
        
        // Add transitions to body
        updatedContent = updatedContent.replace(
            /body\s*\{([^}]*)\}/,
            'body {\n            background-color: #f0f2f5;\n            padding: 20px;\n            line-height: 1.6;\n            transition: background-color 0.3s ease, color 0.3s ease;\n        }'
        );
        
        // Add transitions to header
        updatedContent = updatedContent.replace(
            /\.header\s*\{([^}]*)\}/,
            '.header {\n            text-align: center;\n            margin: 0 auto 40px;\n            padding: 30px 20px;\n            background: #3f51b5;\n            color: white;\n            border-radius: 10px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n            transition: background-color 0.3s ease, color 0.3s ease;\n        }'
        );
        
        // Add transitions to facility cards
        updatedContent = updatedContent.replace(
            /\.facility-card\s*\{([^}]*)\}/,
            '.facility-card {\n            background: white;\n            border-radius: 10px;\n            box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n            margin-bottom: 20px;\n            overflow: hidden;\n            transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, color 0.3s ease;\n        }'
        );
        
        // Write the updated content back to the file
        fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${page}:`, err);
                return;
            }
            console.log(`Successfully updated ${page}`);
        });
    });
}

// Update all pages
pages.forEach(updatePage);
