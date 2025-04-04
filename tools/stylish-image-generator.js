/**
 * Enhanced Stylish Image Generator for Zapwiser
 * 
 * Creates more visually appealing blog post images with geometric shapes,
 * gradients, and financial-themed abstract graphics, while keeping the code simple.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');
const { JSDOM } = require('jsdom');

// Configuration
const config = {
    imageSavePath: path.resolve(__dirname, '..', 'assets', 'images', 'blog'),
    thumbnailPath: path.resolve(__dirname, '..', 'assets', 'images', 'blog', 'thumbnails'),
    blogFilePath: path.resolve(__dirname, '..', 'blog.html'),
    indexFilePath: path.resolve(__dirname, '..', 'index.html'),
    imageWidth: 900,
    imageHeight: 500,
    thumbnailWidth: 100,
    thumbnailHeight: 100,
    // Use a version number to force regeneration of images with new style
    version: 'v2',
    // Financial theme colors
    colors: {
        primary: '#1B2F5D', // Navy blue
        secondary: '#3A5FA0', // Medium blue
        accent: '#4A90E2', // Light blue
        highlight: '#6FCF97', // Green for positive trends
        warning: '#F2994A', // Orange for caution
        danger: '#EB5757', // Red for negative trends
        light: '#F5F8FC', // Light background
        dark: '#0D1B38', // Dark text
        white: '#FFFFFF'  // White
    },
    // Financial themes and their associated shapes/patterns
    themes: [
        { name: 'growth', icon: 'trending-up' },
        { name: 'analysis', icon: 'chart-bar' },
        { name: 'investment', icon: 'chart-pie' },
        { name: 'global', icon: 'globe' },
        { name: 'security', icon: 'shield' },
        { name: 'time', icon: 'clock' },
        { name: 'technology', icon: 'robot' },
        { name: 'volatility', icon: 'trending-down' }
    ],
    // Map of post titles and their themes for better image generation
    postTopics: {
        'Fed Rate Decision Impact Analysis': 'analysis',
        'Tech Sector: Overvalued or Opportunity?': 'investment',
        'Emerging Markets: The Next Frontier': 'global',
        'ESG Investing: More Than a Trend': 'growth',
        'Cryptocurrency Regulation: What\'s Next?': 'security',
        'Inflation\'s Impact on Consumer Discretionary': 'analysis',
        'Market Selloff: Tariff Concerns and Investment Implications': 'volatility',
        'AI and Algorithmic Trading: Reshaping Market Dynamics': 'technology'
    }
};

// Create required directories
if (!fs.existsSync(config.imageSavePath)) {
    fs.mkdirSync(config.imageSavePath, { recursive: true });
    console.log(`Created directory: ${config.imageSavePath}`);
}

if (!fs.existsSync(config.thumbnailPath)) {
    fs.mkdirSync(config.thumbnailPath, { recursive: true });
    console.log(`Created directory: ${config.thumbnailPath}`);
}

/**
 * Generate a unique filename based on the search query
 */
function generateImageFilename(query, isThumbnail = false) {
    // Create a hash from the query for uniqueness
    const hash = crypto.createHash('md5').update(query).digest('hex').substring(0, 8);
    
    // Clean the query for use in filename
    const cleanQuery = query.split(',')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 20);
    
    return `${cleanQuery}-${hash}${isThumbnail ? '-thumb' : ''}-${config.version}.jpg`;
}

/**
 * Generate abstract financial graphics based on the theme
 */
function getThemeGraphics(theme, width, height, isThumbnail = false) {
    // Default theme if not specified
    const themeInfo = config.themes.find(t => t.name === theme) || config.themes[0];
    const iconName = themeInfo.icon;
    
    // Scale factors based on image type
    const scale = isThumbnail ? 0.4 : 1;
    const strokeWidth = isThumbnail ? 1.5 : 3;
    
    // Generate different pattern based on theme
    let graphics = '';
    
    // Common decorative elements (geometric shapes)
    graphics += `
        <!-- Background Pattern -->
        <rect x="0" y="0" width="${width}" height="${height}" fill="url(#gradient)" />
        
        <!-- Decorative Circles -->
        <circle cx="${width * 0.85}" cy="${height * 0.15}" r="${30 * scale}" 
                fill="${config.colors.accent}" opacity="0.3" />
        <circle cx="${width * 0.9}" cy="${height * 0.1}" r="${15 * scale}" 
                fill="${config.colors.highlight}" opacity="0.5" />
                
        <!-- Abstract Lines -->
        <path d="M0,${height * 0.85} C${width * 0.25},${height * 0.75} ${width * 0.75},${height * 0.9} ${width},${height * 0.8}" 
              stroke="${config.colors.secondary}" stroke-width="${strokeWidth}" opacity="0.3" fill="none" />
        <path d="M0,${height * 0.75} C${width * 0.2},${height * 0.85} ${width * 0.6},${height * 0.7} ${width},${height * 0.9}" 
              stroke="${config.colors.white}" stroke-width="${strokeWidth}" opacity="0.2" fill="none" />
    `;
    
    // Theme-specific icons (simple SVG representations)
    if (iconName === 'trending-up') {
        graphics += `
            <polyline points="${width * 0.1},${height * 0.65} ${width * 0.3},${height * 0.45} ${width * 0.5},${height * 0.55} ${width * 0.7},${height * 0.35}" 
                    stroke="${config.colors.highlight}" stroke-width="${strokeWidth * 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" />
            <polyline points="${width * 0.6},${height * 0.35} ${width * 0.7},${height * 0.35} ${width * 0.7},${height * 0.45}" 
                    stroke="${config.colors.highlight}" stroke-width="${strokeWidth * 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" />
        `;
    } else if (iconName === 'chart-bar') {
        graphics += `
            <rect x="${width * 0.15}" y="${height * 0.55}" width="${width * 0.1}" height="${height * 0.1}" 
                  fill="${config.colors.white}" opacity="0.7" rx="2" />
            <rect x="${width * 0.3}" y="${height * 0.45}" width="${width * 0.1}" height="${height * 0.2}" 
                  fill="${config.colors.accent}" opacity="0.7" rx="2" />
            <rect x="${width * 0.45}" y="${height * 0.4}" width="${width * 0.1}" height="${height * 0.25}" 
                  fill="${config.colors.highlight}" opacity="0.7" rx="2" />
            <rect x="${width * 0.6}" y="${height * 0.35}" width="${width * 0.1}" height="${height * 0.3}" 
                  fill="${config.colors.white}" opacity="0.7" rx="2" />
            <rect x="${width * 0.75}" y="${height * 0.5}" width="${width * 0.1}" height="${height * 0.15}" 
                  fill="${config.colors.accent}" opacity="0.7" rx="2" />
        `;
    } else if (iconName === 'chart-pie') {
        graphics += `
            <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${width * 0.12}" 
                    fill="${config.colors.white}" opacity="0.2" />
            <path d="M${width * 0.5},${height * 0.45} L${width * 0.5},${height * 0.33} A${width * 0.12} ${width * 0.12} 0 0 1 ${width * 0.62},${height * 0.45} Z" 
                  fill="${config.colors.highlight}" opacity="0.7" />
            <path d="M${width * 0.5},${height * 0.45} L${width * 0.62},${height * 0.45} A${width * 0.12} ${width * 0.12} 0 0 1 ${width * 0.5},${height * 0.57} Z" 
                  fill="${config.colors.accent}" opacity="0.7" />
        `;
    } else if (iconName === 'globe') {
        graphics += `
            <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${width * 0.12}" 
                    fill="none" stroke="${config.colors.white}" stroke-width="${strokeWidth}" opacity="0.6" />
            <ellipse cx="${width * 0.5}" cy="${height * 0.45}" rx="${width * 0.12}" ry="${width * 0.04}" 
                    fill="none" stroke="${config.colors.white}" stroke-width="${strokeWidth * 0.8}" opacity="0.6" />
            <line x1="${width * 0.38}" y1="${height * 0.45}" x2="${width * 0.62}" y2="${height * 0.45}" 
                  stroke="${config.colors.white}" stroke-width="${strokeWidth * 0.8}" opacity="0.6" />
        `;
    } else if (iconName === 'shield') {
        graphics += `
            <path d="M${width * 0.4},${height * 0.35} L${width * 0.5},${height * 0.33} L${width * 0.6},${height * 0.35} 
                     L${width * 0.6},${height * 0.5} L${width * 0.5},${height * 0.57} L${width * 0.4},${height * 0.5} Z" 
                  fill="${config.colors.white}" stroke="${config.colors.white}" stroke-width="${strokeWidth * 0.5}" opacity="0.6" />
        `;
    } else if (iconName === 'clock') {
        graphics += `
            <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${width * 0.1}" 
                    fill="none" stroke="${config.colors.white}" stroke-width="${strokeWidth}" opacity="0.6" />
            <line x1="${width * 0.5}" y1="${height * 0.45}" x2="${width * 0.5 + Math.cos(Math.PI/4) * width * 0.06}" 
                  y2="${height * 0.45 - Math.sin(Math.PI/4) * width * 0.06}" 
                  stroke="${config.colors.white}" stroke-width="${strokeWidth * 0.8}" opacity="0.6" />
            <line x1="${width * 0.5}" y1="${height * 0.45}" x2="${width * 0.5}" y2="${height * 0.38}" 
                  stroke="${config.colors.white}" stroke-width="${strokeWidth * 0.8}" opacity="0.6" />
        `;
    } else if (iconName === 'robot') {
        graphics += `
            <circle cx="${width * 0.5}" cy="${height * 0.45}" r="${width * 0.12}" 
                    fill="${config.colors.accent}" opacity="0.7" />
            <rect x="${width * 0.4}" y="${height * 0.55}" width="${width * 0.2}" height="${width * 0.1}" 
                  fill="${config.colors.highlight}" opacity="0.7" rx="2" />
            <circle cx="${width * 0.5}" cy="${height * 0.65}" r="${width * 0.05}" 
                    fill="${config.colors.white}" opacity="0.7" />
        `;
    } else if (iconName === 'trending-down') {
        graphics += `
            <polyline points="${width * 0.1},${height * 0.35} ${width * 0.3},${height * 0.55} ${width * 0.5},${height * 0.45} ${width * 0.7},${height * 0.65}" 
                    stroke="${config.colors.danger}" stroke-width="${strokeWidth * 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" />
            <polyline points="${width * 0.6},${height * 0.65} ${width * 0.7},${height * 0.65} ${width * 0.7},${height * 0.55}" 
                    stroke="${config.colors.danger}" stroke-width="${strokeWidth * 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.7" />
        `;
    }
    
    return graphics;
}

/**
 * Generate an enhanced stylish image for a blog post
 */
async function generateStylishImage(title, isThumbnail = false) {
    try {
        // Get theme from title or default to 'analysis'
        const theme = config.postTopics[title] || 'analysis';
        const filename = generateImageFilename(title, isThumbnail);
        
        // Determine save location based on type
        const savePath = isThumbnail ? config.thumbnailPath : config.imageSavePath;
        const fullPath = path.join(savePath, filename);
        
        // Image dimensions based on type
        const width = isThumbnail ? config.thumbnailWidth : config.imageWidth;
        const height = isThumbnail ? config.thumbnailHeight : config.imageHeight;
        
        // Skip generation if file already exists
        if (fs.existsSync(fullPath)) {
            console.log(`Image already exists: ${filename}`);
            return {
                localPath: `assets/images/blog${isThumbnail ? '/thumbnails' : ''}/${filename}`,
                credit: {
                    name: 'Zapwiser Generated Image',
                    link: '#'
                }
            };
        }
        
        // Use a theme-based gradient background
        const titleHash = crypto.createHash('md5').update(title).digest('hex');
        const colorIndex = parseInt(titleHash.substring(0, 2), 16) % 30;
        
        // Generate random angle for gradient
        const angle = colorIndex * 12; // 0-360 degrees
        const angleRadians = angle * Math.PI / 180;
        const x1 = 0;
        const y1 = 0;
        const x2 = Math.cos(angleRadians);
        const y2 = Math.sin(angleRadians);
        
        // Text size based on image type and title length
        const fontSize = isThumbnail ? 14 : (title.length > 30 ? 28 : 32);
        
        // Prepare display text (shorter for thumbnails)
        const displayText = isThumbnail 
            ? (title.length > 12 ? title.substring(0, 10) + '...' : title)
            : (title.length > 40 ? title.substring(0, 37) + '...' : title);
        
        // Create an enhanced SVG with visual elements
        const svgImage = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <!-- Definitions -->
            <defs>
                <linearGradient id="gradient" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
                    <stop offset="0%" stop-color="${config.colors.primary}" />
                    <stop offset="100%" stop-color="${config.colors.secondary}" />
                </linearGradient>
            </defs>
            
            ${getThemeGraphics(theme, width, height, isThumbnail)}
            
            <!-- Text Container -->
            <rect x="${width * 0.1}" y="${height * (isThumbnail ? 0.35 : 0.65)}" 
                  width="${width * 0.8}" height="${height * (isThumbnail ? 0.3 : 0.25)}" 
                  fill="${config.colors.dark}" opacity="0.7" rx="5" />
            
            <!-- Title Text -->
            <text x="${width * 0.5}" y="${height * (isThumbnail ? 0.5 : 0.78)}" 
                  font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" 
                  fill="${config.colors.white}" text-anchor="middle" dominant-baseline="middle">
                ${displayText}
            </text>
            
            ${!isThumbnail ? `
            <!-- Branding -->
            <text x="${width * 0.5}" y="${height * 0.88}" 
                  font-family="Arial, sans-serif" font-size="18" 
                  fill="${config.colors.white}" text-anchor="middle" opacity="0.9">
                Zapwiser Insights
            </text>` : ''}
        </svg>
        `;
        
        // Convert SVG to JPEG using Sharp
        await sharp(Buffer.from(svgImage))
            .jpeg({ quality: 95 })
            .toFile(fullPath);
        
        console.log(`Generated ${isThumbnail ? 'thumbnail' : 'image'}: ${filename}`);
        
        return {
            localPath: `assets/images/blog${isThumbnail ? '/thumbnails' : ''}/${filename}`,
            credit: {
                name: 'Zapwiser Generated Image',
                link: '#'
            }
        };
    } catch (error) {
        console.error('Error generating stylish image:', error.message);
        return null;
    }
}

/**
 * Extract all post titles from the blog page
 */
async function extractAllPostTitles() {
    // Read the blog HTML file
    const html = fs.readFileSync(config.blogFilePath, 'utf8');
    
    // Parse the HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Get all post titles
    const postTitles = new Set();
    
    // From main blog posts
    document.querySelectorAll('.blog-post h2').forEach(element => {
        postTitles.add(element.textContent.trim());
    });
    
    // From recent posts sidebar
    document.querySelectorAll('.recent-post-content h4 a').forEach(element => {
        postTitles.add(element.textContent.trim());
    });
    
    // From index page blog cards
    const indexHtml = fs.readFileSync(config.indexFilePath, 'utf8');
    const indexDom = new JSDOM(indexHtml);
    indexDom.window.document.querySelectorAll('.blog-card h3').forEach(element => {
        postTitles.add(element.textContent.trim());
    });
    
    return Array.from(postTitles);
}

/**
 * Update all image references across the site
 */
async function updateAllImageReferences(imageMap, thumbnailMap) {
    const updates = [];
    
    // Update blog.html
    let blogHtml = fs.readFileSync(config.blogFilePath, 'utf8');
    const blogDom = new JSDOM(blogHtml);
    const blogDoc = blogDom.window.document;
    
    // Update main blog post images
    let blogMainUpdated = 0;
    blogDoc.querySelectorAll('.blog-post').forEach(post => {
        const titleElement = post.querySelector('h2');
        const imageElement = post.querySelector('.post-image img');
        
        if (titleElement && imageElement) {
            const title = titleElement.textContent.trim();
            const imagePath = imageMap[title];
            
            if (imagePath) {
                imageElement.setAttribute('src', imagePath);
                imageElement.setAttribute('data-credit', imageMap[title + '_credit'].name);
                imageElement.setAttribute('data-credit-url', imageMap[title + '_credit'].link);
                blogMainUpdated++;
            }
        }
    });
    
    // Update sidebar recent post thumbnails
    let sidebarUpdated = 0;
    blogDoc.querySelectorAll('.recent-post').forEach(post => {
        const titleElement = post.querySelector('h4 a');
        const imageElement = post.querySelector('.recent-post-image img');
        
        if (titleElement && imageElement) {
            const title = titleElement.textContent.trim();
            const thumbnailPath = thumbnailMap[title];
            
            if (thumbnailPath) {
                imageElement.setAttribute('src', thumbnailPath);
                sidebarUpdated++;
            }
        }
    });
    
    // Save updated blog.html
    if (blogMainUpdated > 0 || sidebarUpdated > 0) {
        fs.writeFileSync(config.blogFilePath, blogDom.serialize());
        updates.push(`Updated blog.html: ${blogMainUpdated} main images, ${sidebarUpdated} sidebar thumbnails`);
    }
    
    // Update index.html
    let indexHtml = fs.readFileSync(config.indexFilePath, 'utf8');
    const indexDom = new JSDOM(indexHtml);
    const indexDoc = indexDom.window.document;
    
    // Update blog card images
    let indexUpdated = 0;
    indexDoc.querySelectorAll('.blog-card').forEach(card => {
        const titleElement = card.querySelector('h3');
        const imageElement = card.querySelector('.blog-image img');
        
        if (titleElement && imageElement) {
            const title = titleElement.textContent.trim();
            const imagePath = imageMap[title];
            
            if (imagePath) {
                imageElement.setAttribute('src', imagePath);
                indexUpdated++;
            }
        }
    });
    
    // Save updated index.html
    if (indexUpdated > 0) {
        fs.writeFileSync(config.indexFilePath, indexDom.serialize());
        updates.push(`Updated index.html: ${indexUpdated} blog card images`);
    }
    
    return updates;
}

/**
 * Main function
 */
async function main() {
    try {
        console.log('Generating stylish images for all blog posts...');
        
        // Extract all post titles
        const allTitles = await extractAllPostTitles();
        console.log(`Found ${allTitles.length} unique post titles`);
        
        // Generate images for all titles
        const imageMap = {};
        const thumbnailMap = {};
        
        for (const title of allTitles) {
            console.log(`\nProcessing: "${title}"`);
            
            // Generate main image
            const imageResult = await generateStylishImage(title, false);
            if (imageResult) {
                imageMap[title] = imageResult.localPath;
                imageMap[title + '_credit'] = imageResult.credit;
            }
            
            // Generate thumbnail
            const thumbnailResult = await generateStylishImage(title, true);
            if (thumbnailResult) {
                thumbnailMap[title] = thumbnailResult.localPath;
                thumbnailMap[title + '_credit'] = thumbnailResult.credit;
            }
        }
        
        // Update all image references
        const updates = await updateAllImageReferences(imageMap, thumbnailMap);
        
        // Log results
        console.log('\nImage updates completed successfully:');
        updates.forEach(update => console.log(`- ${update}`));
        
    } catch (error) {
        console.error('Error updating stylish images:', error);
    }
}

// Export for command-line use
module.exports = { generateStylishImage };

// Run the main function if executed directly
if (require.main === module) {
    main();
}
