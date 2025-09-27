class BreadcrumbNav {
    constructor() {
        this.init();
    }

    init() {
        // Back button functionality
        const backBtn = document.querySelector('.back-button');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = '/';
                }
            });
        }

        // Collapsed breadcrumb functionality
        const collapsedBtn = document.querySelector('.breadcrumb-collapsed-btn');
        if (collapsedBtn) {
            collapsedBtn.addEventListener('click', () => {
                const parent = collapsedBtn.closest('.breadcrumb-collapsed');
                parent.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.breadcrumb-collapsed')) {
                    document.querySelector('.breadcrumb-collapsed')?.classList.remove('active');
                }
            });
        }

        // Handle keyboard navigation
        this.setupKeyboardNav();
    }

    setupKeyboardNav() {
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb a, .breadcrumb button');
        
        breadcrumbLinks.forEach(link => {
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
    }

    // Utility method to collapse middle items if breadcrumb is too long
    static collapseMiddleItems(items, maxVisible = 4) {
        if (items.length <= maxVisible) return items;

        const start = Math.ceil(maxVisible / 2);
        const end = items.length - Math.floor(maxVisible / 2);

        return [
            ...items.slice(0, start),
            { collapsed: true, items: items.slice(start, end) },
            ...items.slice(end)
        ];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new BreadcrumbNav();
});