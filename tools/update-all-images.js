/**
 * Comprehensive Image Update Script
 * 
 * This script updates all blog post images across the site, including:
 * - Main blog posts
 * - Homepage thumbnails
 * - Sidebar recent posts thumbnails
 * - Any other places where post images are used
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const sharp = require('sharp');
const crypto = require('crypto');

// Configuration
const config = {
    imageSavePath: path.resolve(__dirname, '..', 'assets', 'images', 'blog'),
    thumbnailPath: path.resolve(__dirname, '..', 'assets', 'images', 'blog', 'thumbnails'),
    blogFilePath: path.resolve(__dirname, '..', 'blog.html'),
    indexFilePath: path.resolve(__dirname, '..', 'index.html'),
    colors: {
        backgrounds: [
            '#1B2F5D', // Navy blue
            '#3A5FA0', // Medium blue
            '#6384C5', // Light blue
            '#2E4D7B', // Dark blue
            '#4A678F'  // Slate blue
        ],
        text: '#FFFFFF'  // White text
    },
    // Map of post titles and their topics/keywords for better image generation
    postTopics: {
        'Fed Rate Decision Impact Analysis': 'finance federal reserve interest rates',
        'Tech Sector: Overvalued or Opportunity?': 'technology stocks investing',
        'Emerging Markets: The Next Frontier': 'emerging markets investing global',
        'ESG Investing: More Than a Trend': 'esg sustainable investing',
        'Cryptocurrency Regulation: What\'s Next?': 'cryptocurrency regulation finance',
        'Inflation\'s Impact on Consumer Discretionary': 'inflation consumer spending economy'
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
    
    return `${cleanQuery}-${hash}${isThumbnail ? '-thumb' : ''}.jpg`;
}

/**
 * Generate an image for a blog post
 */
async function generatePostImage(title, isThumbnail = false) {
    const topics = config.postTopics[title] || title;
    const filename = generateImageFilename(title, isThumbnail);
    
    const savePath = isThumbnail ? config.thumbnailPath : config.imageSavePath;
    const fullPath = path.join(savePath, filename);
    
    // Image dimensions based on type
    const width = isThumbnail ? 100 : 900;
    const height = isThumbnail ? 100 : 500;
    
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
    
    // Use a consistent background color for each title
    const titleHash = crypto.createHash('md5').update(title).digest('hex');
    const colorIndex = parseInt(titleHash.substring(0, 2), 16) % config.colors.backgrounds.length;
    const bgColor = config.colors.backgrounds[colorIndex];
    
    // Text size based on image type and title length
    const fontSize = isThumbnail ? 16 : (title.length > 30 ? 28 : 32);
    
    // Create an SVG with the text
    const displayText = isThumbnail 
        ? (title.length > 15 ? title.substring(0, 12) + '...' : title)
        : (title.length > 40 ? title.substring(0, 37) + '...' : title);
    
    const svgImage = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" 
              fill="${config.colors.text}" text-anchor="middle" dominant-baseline="middle">
            ${displayText}
        </text>
        ${!isThumbnail ? `
        <text x="50%" y="85%" font-family="Arial, sans-serif" font-size="20" 
              fill="${config.colors.text}" text-anchor="middle" opacity="0.7">
            Zapwiser Insights
        </text>` : ''}
    </svg>
    `;
    
    // Convert SVG to JPEG using Sharp
    await sharp(Buffer.from(svgImage))
        .jpeg({ quality: 90 })
        .toFile(fullPath);
    
    console.log(`Generated ${isThumbnail ? 'thumbnail' : 'image'}: ${filename}`);
    
    return {
        localPath: `assets/images/blog${isThumbnail ? '/thumbnails' : ''}/${filename}`,
        credit: {
            name: 'Zapwiser Generated Image',
            link: '#'
        }
    };
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
    document.querySelectorAll('.recent-post-content h4').forEach(element => {
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
        const titleElement = post.querySelector('h4');
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
        console.log('Updating all blog post images across the site...');
        
        // Extract all post titles
        const allTitles = await extractAllPostTitles();
        console.log(`Found ${allTitles.length} unique post titles`);
        
        // Generate images for all titles
        const imageMap = {};
        const thumbnailMap = {};
        
        for (const title of allTitles) {
            console.log(`\nProcessing: "${title}"`);
            
            // Generate main image
            const imageResult = await generatePostImage(title, false);
            if (imageResult) {
                imageMap[title] = imageResult.localPath;
                imageMap[title + '_credit'] = imageResult.credit;
            }
            
            // Generate thumbnail
            const thumbnailResult = await generatePostImage(title, true);
            if (thumbnailResult) {
                thumbnailMap[title] = thumbnailResult.localPath;
                thumbnailMap[title + '_credit'] = thumbnailResult.credit;
            }
        }
        
        // Update all image references
        const updates = await updateAllImageReferences(imageMap, thumbnailMap);
        
        // Log results
        console.log('\nUpdate completed successfully:');
        updates.forEach(update => console.log(`- ${update}`));
        
    } catch (error) {
        console.error('Error updating images:', error);
    }
}

// Run the main function
main();
