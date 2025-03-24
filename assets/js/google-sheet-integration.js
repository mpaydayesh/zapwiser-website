/**
 * Google Sheets Newsletter Integration for Zapwiser
 * 
 * This script handles the newsletter signup forms and submits emails to a Google Sheet.
 * It's a simple but effective solution for collecting subscriber emails.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get all newsletter forms on the page
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    // Add event listeners to each form
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSignup);
    });
    
    /**
     * Handle newsletter signup form submission
     * @param {Event} event - The form submission event
     */
    function handleNewsletterSignup(event) {
        event.preventDefault();
        
        // Get the form and input fields
        const form = event.target;
        const firstNameInput = form.querySelector('input[name="firstName"]');
        const lastNameInput = form.querySelector('input[name="lastName"]');
        const emailInput = form.querySelector('input[name="email"]');
        
        // Get values and handle cases where fields might not exist
        const firstName = firstNameInput ? firstNameInput.value.trim() : '';
        const lastName = lastNameInput ? lastNameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        
        // Basic validation
        if (!email || !isValidEmail(email)) {
            showMessage(form, 'Please enter a valid email address', 'error');
            return;
        }
        
        // Disable form elements during submission
        const submitButton = form.querySelector('button[type="submit"]');
        if (firstNameInput) firstNameInput.disabled = true;
        if (lastNameInput) lastNameInput.disabled = true;
        if (emailInput) emailInput.disabled = true;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Subscribing...';
        
        // Get the message element or create it if it doesn't exist
        let messageElement = form.nextElementSibling;
        if (!messageElement || !messageElement.classList.contains('newsletter-message')) {
            messageElement = document.createElement('div');
            messageElement.className = 'newsletter-message';
            form.parentNode.insertBefore(messageElement, form.nextSibling);
        }
        
        // Show loading message
        messageElement.textContent = 'Processing your subscription...';
        messageElement.className = 'newsletter-message';
        messageElement.style.display = 'block';
        
        // Trigger animation with a slight delay
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
        
        // Submit to Google Sheets
        const scriptURL = 'https://script.google.com/macros/s/AKfycby0eB-cOvSSGFUCYD1KB5htufyzPyZt01Ldj7M7kM83s__etg0d8l00ghPATimujieH/exec'; // Google Apps Script Web App URL
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('timestamp', new Date().toISOString());
        
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Clear the inputs
                if (firstNameInput) firstNameInput.value = '';
                if (lastNameInput) lastNameInput.value = '';
                if (emailInput) emailInput.value = '';
                
                // Show success message
                messageElement.textContent = 'Thank you for subscribing to our weekly newsletter!';
                messageElement.className = 'newsletter-message success';
                messageElement.classList.add('show');
                
                // Hide the message after 5 seconds
                setTimeout(() => {
                    messageElement.classList.remove('show');
                    setTimeout(() => {
                        messageElement.style.display = 'none';
                    }, 300);
                }, 5000);
            })
            .catch(error => {
                // Show error message
                messageElement.textContent = 'There was an error subscribing. Please try again later.';
                messageElement.className = 'newsletter-message error';
                messageElement.classList.add('show');
            })
            .finally(() => {
                // Re-enable form elements
                if (firstNameInput) firstNameInput.disabled = false;
                if (lastNameInput) lastNameInput.disabled = false;
                if (emailInput) emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.innerHTML = 'Subscribe';
            });
    }
    
    /**
     * Validate an email address
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Display a message to the user
     * @param {HTMLElement} form - The form element
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success or error)
     */
    function showMessage(form, message, type) {
        // Look for an existing message element
        let messageElement = form.nextElementSibling;
        if (!messageElement || !messageElement.classList.contains('newsletter-message')) {
            messageElement = document.createElement('div');
            messageElement.className = 'newsletter-message';
            form.parentNode.insertBefore(messageElement, form.nextSibling);
        }
        
        // Set message content and style
        messageElement.textContent = message;
        messageElement.className = 'newsletter-message ' + type;
        
        // Make sure the message is visible
        messageElement.style.display = 'block';
    }
});
