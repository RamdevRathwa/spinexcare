// Form handling functionality for SpineXcare website

document.addEventListener('DOMContentLoaded', function() {
    
    // Form validation patterns
    const validationPatterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        phone: /^[0-9]{10}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    };

    // Form error messages
    const errorMessages = {
        name: 'Please enter a valid name (2-50 characters, letters only)',
        phone: 'Please enter a valid 10-digit phone number',
        email: 'Please enter a valid email address',
        service: 'Please select a service',
        message: 'Please describe your condition'
    };

    // Get form elements
    const appointmentForm = document.getElementById('appointmentForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    // Create error display element
    const createErrorElement = (message) => {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        return errorElement;
    };

    // Remove existing error messages
    const removeErrorMessages = () => {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    };

    // Validate individual field
    const validateField = (field, value, pattern) => {
        const fieldContainer = field.closest('.form-group');
        const existingError = fieldContainer.querySelector('.error-message');
        
        if (existingError) {
            existingError.remove();
        }

        if (!value.trim()) {
            const errorElement = createErrorElement(`${field.name} is required`);
            fieldContainer.appendChild(errorElement);
            field.style.borderColor = '#dc2626';
            return false;
        }

        if (pattern && !pattern.test(value)) {
            const errorElement = createErrorElement(errorMessages[field.name]);
            fieldContainer.appendChild(errorElement);
            field.style.borderColor = '#dc2626';
            return false;
        }

        field.style.borderColor = '#10b981';
        return true;
    };

    // Real-time validation
    nameInput.addEventListener('input', function() {
        validateField(this, this.value, validationPatterns.name);
    });

    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/\D/g, '');
        validateField(this, this.value, validationPatterns.phone);
    });

    emailInput.addEventListener('input', function() {
        validateField(this, this.value, validationPatterns.email);
    });

    serviceSelect.addEventListener('change', function() {
        validateField(this, this.value);
    });

    messageTextarea.addEventListener('input', function() {
        validateField(this, this.value);
    });

    // Form submission handling
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Remove existing error messages
        removeErrorMessages();
        
        // Validate all fields
        const isNameValid = validateField(nameInput, nameInput.value, validationPatterns.name);
        const isPhoneValid = validateField(phoneInput, phoneInput.value, validationPatterns.phone);
        const isEmailValid = emailInput.value ? validateField(emailInput, emailInput.value, validationPatterns.email) : true;
        const isServiceValid = validateField(serviceSelect, serviceSelect.value);
        const isMessageValid = validateField(messageTextarea, messageTextarea.value);
        
        // If all fields are valid, process the form
        if (isNameValid && isPhoneValid && isEmailValid && isServiceValid && isMessageValid) {
            processForm();
        } else {
            showNotification('Please correct the errors above', 'error');
        }
    });

    // Process form submission
    const processForm = () => {
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            service: serviceSelect.value,
            message: messageTextarea.value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        const submitButton = appointmentForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Booking Appointment...';
        submitButton.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset form
            appointmentForm.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            showNotification('Appointment request sent successfully! We will contact you soon.', 'success');
            
            // Reset field borders
            const inputs = appointmentForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.borderColor = '#e5e7eb';
            });
            
            // Log form data (for development)
            console.log('Form submitted:', formData);
            
            // In a real application, you would send this data to your server
            // Example: sendToServer(formData);
            
        }, 2000);
    };

    // Show notification
    const showNotification = (message, type) => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#dc2626';
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    };

    // Add notification animations
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(notificationStyle);

    // Auto-save form data to prevent data loss
    const autoSaveForm = () => {
        const formData = {
            name: nameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            service: serviceSelect.value,
            message: messageTextarea.value
        };
        
        // In a real application, you might want to save to localStorage
        // localStorage.setItem('appointmentFormData', JSON.stringify(formData));
        console.log('Form auto-saved:', formData);
    };

    // Auto-save every 30 seconds
    setInterval(autoSaveForm, 30000);

    // Load saved form data on page load
    const loadSavedFormData = () => {
        // In a real application, you might load from localStorage
        // const savedData = localStorage.getItem('appointmentFormData');
        // if (savedData) {
        //     const formData = JSON.parse(savedData);
        //     nameInput.value = formData.name || '';
        //     phoneInput.value = formData.phone || '';
        //     emailInput.value = formData.email || '';
        //     serviceSelect.value = formData.service || '';
        //     messageTextarea.value = formData.message || '';
        // }
    };

    // Load saved data on page load
    loadSavedFormData();

    // Clear saved data when form is successfully submitted
    const clearSavedData = () => {
        // localStorage.removeItem('appointmentFormData');
    };

    // Accessibility improvements
    const improveAccessibility = () => {
        // Add ARIA labels
        nameInput.setAttribute('aria-label', 'Your full name');
        phoneInput.setAttribute('aria-label', 'Your phone number');
        emailInput.setAttribute('aria-label', 'Your email address');
        serviceSelect.setAttribute('aria-label', 'Select service type');
        messageTextarea.setAttribute('aria-label', 'Describe your condition');
        
        // Add required indicators
        const requiredFields = [nameInput, phoneInput, serviceSelect, messageTextarea];
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
        });
    };

    // Initialize accessibility improvements
    improveAccessibility();

    // Form analytics (for tracking form interactions)
    const trackFormInteraction = (action, field) => {
        console.log(`Form interaction: ${action} on ${field}`);
        // In a real application, you would send this to your analytics service
    };

    // Track form field interactions
    const formFields = [nameInput, phoneInput, emailInput, serviceSelect, messageTextarea];
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            trackFormInteraction('focus', field.name);
        });
        
        field.addEventListener('blur', () => {
            trackFormInteraction('blur', field.name);
        });
    });

    // Track form submission attempts
    appointmentForm.addEventListener('submit', () => {
        trackFormInteraction('submit', 'appointment-form');
    });

    console.log('Form handling initialized successfully!');
});