/**
 * Zapwiser Newsletter Integration with Mailchimp
 * 
 * This script handles the newsletter signup forms across the Zapwiser website
 * and submits them to Mailchimp via their API.
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
        
        // Get the email input from the form
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Basic validation
        if (!isValidEmail(email)) {
            showMessage(event.target, 'Please enter a valid email address', 'error');
            return;
        }
        
        // Disable form elements during submission
        const submitButton = event.target.querySelector('button[type="submit"]');
        emailInput.disabled = true;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Subscribing...';
        
        // Get the form container for showing messages
        const formContainer = event.target.closest('.footer-newsletter, .newsletter-container');
        
        // Prepare data for Mailchimp
        const data = {
            email_address: email,
            status: 'subscribed'
            // You can add merge fields here if needed, e.g.:
            // merge_fields: {
            //     FNAME: firstName,
            //     LNAME: lastName
            // }
        };
        
        // Send to your own backend endpoint that will forward to Mailchimp
        // (This is more secure than calling Mailchimp directly from the frontend)
        submitToMailchimp(data)
            .then(response => {
                // Clear the input
                emailInput.value = '';
                
                // Show success message
                showMessage(event.target, 'Thank you for subscribing to our newsletter!', 'success');
                
                // Enable form elements after successful submission
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.innerHTML = 'Subscribe';
            })
            .catch(error => {
                // Show error message
                let errorMessage = 'An error occurred. Please try again later.';
                
                // Check if it's an email already exists error
                if (error.title === 'Member Exists') {
                    errorMessage = 'You are already subscribed to our newsletter.';
                }
                
                showMessage(event.target, errorMessage, 'error');
                
                // Enable form elements after error
                emailInput.disabled = false;
                submitButton.disabled = false;
                submitButton.innerHTML = 'Subscribe';
            });
    }
    
    /**
     * Submit email to Mailchimp through your proxy endpoint
     * @param {Object} data - The data to submit to Mailchimp
     * @returns {Promise} - A promise that resolves with the response
     */
    function submitToMailchimp(data) {
        // This is a placeholder. In a real implementation, you would:
        // 1. Call your own backend API endpoint
        // 2. Your backend would use the Mailchimp API to add the subscriber
        
        // For demonstration, we'll use a mock promise that resolves after 1 second
        return new Promise((resolve, reject) => {
            // In a real implementation, you would replace this with a fetch call to your backend
            // Example:
            // return fetch('/api/newsletter/subscribe', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(data)
            // }).then(response => response.json());
            
            // Simulate a successful API call
            setTimeout(() => {
                // For demo purposes, we'll just check if the email is test@example.com
                // to demonstrate an "already subscribed" error
                if (data.email_address === 'test@example.com') {
                    reject({
                        title: 'Member Exists',
                        status: 400,
                        detail: 'This email is already subscribed'
                    });
                } else {
                    resolve({
                        status: 'subscribed',
                        email_address: data.email_address
                    });
                }
            }, 1000);
        });
    }
    
    /**
     * Display a message to the user
     * @param {HTMLElement} form - The form element
     * @param {string} message - The message to display
     * @param {string} type - The type of message (success or error)
     */
    function showMessage(form, message, type) {
        // Look for an existing message element
        let messageElement = form.querySelector('.newsletter-message');
        
        // Create a new message element if none exists
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'newsletter-message';
            form.appendChild(messageElement);
        }
        
        // Set message content and style
        messageElement.textContent = message;
        messageElement.className = 'newsletter-message ' + type;
        
        // Make sure the message is visible
        messageElement.style.display = 'block';
        
        // Hide the message after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 5000);
        }
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
});
