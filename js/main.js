// Main JavaScript functionality for SpineXcare website

document.addEventListener('DOMContentLoaded', function() {
    
    // Hamburger menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
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

    // Header background change on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = '#ffffff';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .info-card, .about-text, .about-image');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    };

    // Throttle scroll events for better performance
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

    window.addEventListener('scroll', handleScroll);

    // Initial call to animate elements already in view
    animateOnScroll();

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-img');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroImage) {
            heroImage.style.transform = `translateY(${rate}px)`;
        }
    });

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

    // Image loading animation functionality
    const initializeImageLoading = () => {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach(img => {
            // Add loading class initially
            img.classList.add('image-loading');
            
            // Create a new image to test loading
            const testImg = new Image();
            
            testImg.onload = () => {
                // Image loaded successfully
                img.classList.remove('image-loading');
                img.classList.add('image-loaded');
                
                // Add a small delay for smooth transition
                setTimeout(() => {
                    img.style.opacity = '1';
                }, 100);
            };
            
            testImg.onerror = () => {
                // Image failed to load
                img.classList.remove('image-loading');
                img.classList.add('image-error');
                img.style.background = '#f8f9fa';
                img.style.display = 'flex';
                img.style.alignItems = 'center';
                img.style.justifyContent = 'center';
                img.innerHTML = '<span style="color: #6c757d; font-size: 14px;">Image unavailable</span>';
            };
            
            // Set the source to trigger loading
            testImg.src = img.src;
        });
    };

    // Lazy loading for images with loading animation
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Add loading state
                img.classList.add('image-loading');
                
                // Create test image for loading check
                const testImg = new Image();
                
                testImg.onload = () => {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy', 'image-loading');
                    img.classList.add('image-loaded');
                    
                    setTimeout(() => {
                        img.style.opacity = '1';
                    }, 100);
                };
                
                testImg.onerror = () => {
                    img.classList.remove('image-loading');
                    img.classList.add('image-error');
                };
                
                testImg.src = img.dataset.src;
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
    
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
    
    // Initialize loading animation for all images
    initializeImageLoading();

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