# Zapwiser Website

A modern, responsive website for Zapwiser - a brand focused on weekly stock market round-ups, in-depth analysis, and interactive financial tools.

## Project Overview

This website serves as the online presence for Zapwiser, complementing its AI-driven YouTube channel with written content and interactive financial tools.

### Features

- **Responsive Design**: Fully responsive layout for mobile, tablet, and desktop
- **Modern UI**: Clean, professional design with finance/stock market branding
- **Interactive Elements**: Charts, calculators, and data visualization tools
- **Newsletter Integration**: Email subscription forms throughout the site
- **Content-Rich Structure**: Blog posts, market analysis, and educational resources

## Pages

1. **Homepage**: Introduction to Zapwiser with featured content and services
2. **Blog/Insights**: Collection of market analysis articles and weekly recaps
3. **Tools**: Interactive financial calculators and market data visualizations
4. **About/Contact**: Company information and contact form

## Technical Implementation

### Structure

```bash
zapwiser_website/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── images/
│       └── logo.svg
├── index.html
├── blog.html
├── tools.html
├── about.html
└── README.md
```

### Technologies Used

- **HTML5**: Semantic markup for content structure
- **CSS3**: Custom styling with responsive design
- **JavaScript**: Interactive features and animations
- **Chart.js**: Data visualization for financial charts
- **Font Awesome**: Icons for enhanced visual elements
- **Google Fonts**: Typography (Montserrat, Open Sans)

### Color Palette

- Navy: #1B2F5D
- Medium Blue: #3A5FA0
- Light Blue: #82A1DA
- Accent (Orange): #FF7A00

## Running the Website

This is a static website that can be viewed by opening any HTML file in a web browser. For local development:

1. Clone the repository
2. Navigate to the project directory
3. Open `index.html` in your browser

For production deployment, upload all files to your web hosting service.

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Dark mode implementation
- Backend integration for newsletter functionality
- User accounts for personalized tools
- Mobile app integration

## Deployment Guide

### Deploying with Netlify and GitHub

1. **GitHub Repository Setup**
   - Initialize Git repository in project folder:

     ```bash
     git init
     git add .
     git commit -m "Initial commit for Zapwiser website"
     ```

   - Create a new repository on GitHub (e.g., zapwiser-website)
   - Connect local repository to GitHub:

     ```bash
     git remote add origin https://github.com/yourusername/zapwiser-website.git
     git push -u origin master
     ```

2. **Netlify Deployment**
   - Sign up/login to [Netlify](https://www.netlify.com/)
   - Select "Add new site" > "Import an existing project"
   - Choose GitHub as Git provider and authorize
   - Select your repository (zapwiser-website)
   - Configure build settings:
     - Owner: Your Netlify team
     - Branch: master
     - Base directory: (leave blank)
     - Build command: (leave blank for static sites)
     - Publish directory: / (root)
   - Click "Deploy site"

3. **Custom Domain Configuration**
   - In Netlify dashboard, go to "Domain management" > "Add custom domain"
   - Enter your domain (zapwiser.com) and verify
   - Set up Netlify DNS for your domain

4. **Updating GoDaddy Nameservers**
   - Log in to GoDaddy
   - Navigate to Domain Portfolio > zapwiser.com > DNS > Nameservers
   - Select "I'll use my own nameservers"
   - Enter Netlify nameservers:

     ```text
     dns1.p06.nsone.net
     dns2.p06.nsone.net
     dns3.p06.nsone.net
     dns4.p06.nsone.net
     ```

   - Save changes
   - Wait for DNS propagation (can take 24-48 hours)

5. **Verification and SSL**
   - Netlify automatically provisions SSL certificates once DNS is configured
   - Once propagation is complete, your site will be available at zapwiser.com with HTTPS

6. **Ongoing Updates**
   - Make changes to your local code
   - Commit and push to GitHub:

     ```bash
     git add .
     git commit -m "Description of changes"
     git push
     ```

   - Netlify automatically rebuilds and deploys your site

---

 2025 Zapwiser. All rights reserved.
