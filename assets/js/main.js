/**
 * Zapwiser Website - Main JavaScript
 * Handles interactive elements and functionality across the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active'); 
            this.classList.toggle('active');
            
            // Toggle between hamburger and X icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Enhanced Sticky Navigation functionality
    const header = document.querySelector('header');
    let lastScrollPosition = 0;
    
    // Function to handle header state on scroll with improved animation
    const handleScroll = () => {
        const currentScrollPosition = window.scrollY;
        
        // Add scrolled class if we've scrolled down with more dynamic effect
        if (currentScrollPosition > 50) {
            header.classList.add('scrolled');
            // Slightly hide header when scrolling down fast
            if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollPosition = currentScrollPosition;
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Run once on page load
    handleScroll();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Account for fixed header height
                    const headerHeight = header.offsetHeight;
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20, 
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Newsletter Form Submission - Main form
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real implementation, this would send the form data to a server
                // For demo purposes, show a success message
                const formParent = this.parentElement;
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
                successMessage.style.color = '#4CAF50';
                successMessage.style.padding = '1rem';
                successMessage.style.borderRadius = '5px';
                successMessage.style.marginTop = '1rem';
                successMessage.innerHTML = `
                    <p><strong>Thank you for subscribing!</strong></p>
                    <p>You've been added to our newsletter. Check ${email} for a confirmation.</p>
                `;
                
                // Hide the form and show success message
                this.style.display = 'none';
                formParent.appendChild(successMessage);
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    this.reset();
                    this.style.display = 'flex';
                    formParent.removeChild(successMessage);
                }, 5000);
            }
        });
    });
    
    // Footer subscribe form
    const footerSubscribe = document.querySelector('.footer-subscribe');
    if (footerSubscribe) {
        footerSubscribe.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // Create and style success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.style.color = '#fff';
                successMessage.style.marginTop = '0.5rem';
                successMessage.innerHTML = `<p>Thank you! Check ${email} for confirmation.</p>`;
                
                // Hide the form, show success message
                this.style.display = 'none';
                this.parentElement.appendChild(successMessage);
                
                // Reset after 4 seconds
                setTimeout(() => {
                    this.reset();
                    this.style.display = 'flex';
                    this.parentElement.removeChild(successMessage);
                }, 4000);
            }
        });
    }
    
    // Enhanced animation on scroll with intersection observer
    const animateElements = document.querySelectorAll('.service-card, .blog-card, .featured-article, .featured-video, .team-member');
    
    // Set initial styles
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Use Intersection Observer for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Once animated, no need to observe anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for older browsers
        animateElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    // Handle theme preference (if implemented)
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setThemePreference = function(isDark) {
        // This could be expanded for a full dark mode implementation
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    };
    
    // Set theme preference if user has selected one
    if (localStorage.getItem('theme') === 'dark') {
        setThemePreference(true);
    } else if (localStorage.getItem('theme') === 'light') {
        setThemePreference(false);
    } else {
        // Use system preference as default
        setThemePreference(prefersDarkScheme.matches);
    }
    
    // Listen for changes to the prefers-color-scheme media query
    prefersDarkScheme.addEventListener('change', e => {
        setThemePreference(e.matches);
    });
    
    // Mailchimp form setup
    // This script helps with form validation and submission for Mailchimp
    window.addEventListener('load', function() {
        // Only run on pages that have the Mailchimp form
        if (document.getElementById('mc-embedded-subscribe-form')) {
            // Add custom validation and submission handling
            const mailchimpForm = document.getElementById('mc-embedded-subscribe-form');
            
            // Handle existing newsletter submission while waiting for Mailchimp response
            mailchimpForm.addEventListener('submit', function(e) {
                // Don't prevent default as we want the form to submit to Mailchimp
                
                const emailInput = this.querySelector('input[type="email"]');
                const submitButton = this.querySelector('button[type="submit"]');
                
                // Disable button during submission to prevent multiple clicks
                submitButton.disabled = true;
                
                // Re-enable button after 3 seconds (in case the submit completes quickly)
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 3000);
                
                // We could track submission analytics here if needed
                console.log('Newsletter submission sent to Mailchimp');
            });
        }
    });
    
    // Load Mailchimp async script to avoid blocking main thread
    // This follows Mailchimp's recommended embed approach
    function loadMailchimpScript() {
        if (document.getElementById('mc-embedded-subscribe-form')) {
            const script = document.createElement('script');
            script.src = '//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js';
            script.defer = true;
            
            script.onload = function() {
                if (window.fnames && window.ftypes) {
                    // MC JS is loaded and initialized
                    console.log('Mailchimp validation script loaded');
                }
            };
            
            document.body.appendChild(script);
            
            // Initialize Mailchimp variables needed by their script
            window.fnames = window.fnames || {};
            window.ftypes = window.ftypes || {};
            fnames[0]='EMAIL';
            ftypes[0]='email';
        }
    }
    
    // Load the Mailchimp script
    loadMailchimpScript();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.mobile-menu')) {
            navLinks.classList.remove('active');
            if (mobileMenuButton) {
                mobileMenuButton.classList.remove('active');
                const icon = mobileMenuButton.querySelector('i');
                if (icon && icon.classList.contains('fa-xmark')) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
});
