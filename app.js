// Shared application logic

const App = {
    init: function() {
        this.setupNavigation();
    },

    // Standardize navigation links across all pages
    setupNavigation: function() {
        const navLinks = {
            'home': 'index.html',
            'study-plan': 'study_plan_studyos.html',
            'subjects': 'subjects_syllabus_studyos.html',
            'focus-timer': 'focus_workstation_studyos.html',
            'student-profile': 'profile_analytics_studyos.html'
        };

        document.querySelectorAll('nav a').forEach(link => {
            const pathData = link.getAttribute('data-path');
            if (pathData && navLinks[pathData]) {
                link.href = navLinks[pathData];
            }
        });
    },

    // Utility: Format date
    formatDate: function(dateString) {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    },

    // Utility: Calculate days until
    daysUntil: function(dateString) {
        const target = new Date(dateString);
        const today = new Date();
        const diffTime = target - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    
    // Utility: Generate unique ID
    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
