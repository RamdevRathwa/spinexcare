// Main JavaScript functionality for SpineXcare website

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const servicesDropdown = document.querySelector('.dropdown');
    const servicesLink = document.querySelector('.dropdown > .nav-link');

    // Toggle hamburger menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Toggle services submenu on mobile
    if (servicesDropdown && servicesLink) {
        servicesLink.addEventListener('click', function (e) {
            // Check if we are in mobile view (e.g., hamburger is visible)
            if (window.getComputedStyle(hamburger).display !== 'none') {
                e.preventDefault(); // Prevent navigating to services.html on click
                servicesDropdown.classList.toggle('active');
            }
        });
    }

    // Close the menu when a link is clicked (optional but good for UX)
    document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close if it's the services dropdown toggle
            if (e.target === servicesLink && window.getComputedStyle(hamburger).display !== 'none') {
                return;
            }
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Also close the services dropdown if it's open
                if (servicesDropdown.classList.contains('active')) {
                    servicesDropdown.classList.remove('active');
                }
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Prepare references used during scroll
    const header = document.querySelector('.header');
    const heroImage = document.querySelector('.hero-img');

    // Animate elements on scroll + header background + lightweight parallax in one RAF
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .info-card, .about-text, .about-image');

        // Fade-in animations
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                element.classList.add('fade-in-up');
            }
        });

        // Header style
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#ffffff';
                header.style.backdropFilter = 'none';
            }
        }

        // Lightweight parallax
        if (heroImage) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2; // gentler for performance
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    };

    // Throttle scroll with one passive listener
    let ticking = false;
    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                animateOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial call to animate elements already in view
    animateOnScroll();

    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        });
    });

    // Legacy typing effect removed to avoid conflict with rotating hero headings

    // Counter animation for stats (if added later)
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.textContent);
            const increment = target / 100;
            
            if (count < target) {
                counter.textContent = Math.ceil(count + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.textContent = target;
            }
        });
    };

    // Lazy load videos on interaction to avoid crawl errors
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.addEventListener('play', () => {
            const source = video.querySelector('source[data-src]');
            if (source && !source.src) {
                source.src = source.dataset.src;
                video.load();
            }
        }, { once: true });
    });

    // Add loading state to buttons
    const addLoadingState = (button) => {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 2000);
    };

    // Phone number formatting
    const formatPhoneNumber = (input) => {
        const phoneNumber = input.value.replace(/\D/g, '');
        const phoneNumberLength = phoneNumber.length;
        
        if (phoneNumberLength < 4) {
            input.value = phoneNumber;
        } else if (phoneNumberLength < 7) {
            input.value = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        } else {
            input.value = `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };

    // Add phone formatting to phone inputs
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });

    // Add ripple effect to buttons
    const addRippleEffect = (button) => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    };

    // Add ripple effect to all buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(addRippleEffect);

    // Scroll to top functionality
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Create scroll to top button
    const createScrollToTopButton = () => {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.classList.add('scroll-to-top');
        button.addEventListener('click', scrollToTop);
        document.body.appendChild(button);
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
    };

    // Initialize scroll to top button
    createScrollToTopButton();

    // Add CSS for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            z-index: 1000;
            transition: all 0.3s ease;
        }
        
        .scroll-to-top:hover {
            background: var(--dark-blue);
            transform: translateY(-2px);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Preloader functionality
    const showPreloader = () => {
        const preloader = document.createElement('div');
        preloader.innerHTML = `
            <div class="preloader">
                <div class="spinner"></div>
                <p>Loading SpineXcare...</p>
            </div>
        `;
        document.body.appendChild(preloader);
        
        setTimeout(() => {
            preloader.remove();
        }, 1000);
    };

    // Add preloader styles
    const preloaderStyle = document.createElement('style');
    preloaderStyle.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid var(--primary-blue);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(preloaderStyle);

    // Initialize preloader if page is not cached
    if (document.readyState === 'loading') {
        showPreloader();
    }

    const heroHeadings = [
        "Restore Your Spine, Restore Your Life",
        "Move Better. Live Better. Expert Chiropractic & Physiotherapy Care",
        "Your Path to Pain-Free Living Starts Here",
        "Advanced Spine & Joint Care for a Healthier You",
        "Experience Relief and Renewed Mobility with Expert Chiropractic Care",
        "Personalized Chiropractic Solutions for Lasting Wellness",
        "Feel the Difference: Professional Spine & Posture Correction",
        "Empowering You to Live Pain-Free and Active"
    ];

    let currentHeading = 0;
    const headingElement = document.getElementById('hero-heading');
    let typingInterval = null;

    function typeWriterEffect(text, element, callback) {
        element.textContent = '';
        let i = 0;
        clearInterval(typingInterval);
        typingInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typingInterval);
                if (callback) callback();
            }
        }, 90);
    }

    function rotateHeroHeading() {
        typeWriterEffect(heroHeadings[currentHeading], headingElement);
        currentHeading = (currentHeading + 1) % heroHeadings.length;
    }

    // Start the first heading with typing effect
    rotateHeroHeading();
    // Then rotate every 3.5 seconds
    setInterval(rotateHeroHeading, 5000);

    console.log('SpineXcare website loaded successfully!');
});