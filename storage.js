// Storage module to handle localStorage operations

const Storage = {
    // Keys used in localStorage
    KEYS: {
        TASKS: 'studyos_tasks',
        SUBJECTS: 'studyos_subjects',
        SESSIONS: 'studyos_sessions',
        FLASHCARDS: 'studyos_flashcards',
        SETTINGS: 'studyos_settings'
    },

    // Initialize default data if none exists
    init: function() {
        if (!this.get(this.KEYS.TASKS)) this.set(this.KEYS.TASKS, []);
        if (!this.get(this.KEYS.SUBJECTS)) this.set(this.KEYS.SUBJECTS, []);
        if (!this.get(this.KEYS.SESSIONS)) this.set(this.KEYS.SESSIONS, []);
        if (!this.get(this.KEYS.FLASHCARDS)) this.set(this.KEYS.FLASHCARDS, []);
        if (!this.get(this.KEYS.SETTINGS)) {
            this.set(this.KEYS.SETTINGS, {
                username: 'Student',
                examDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
                dailyTargetHours: 6,
                theme: 'dark'
            });
        }
    },

    // Get item from localStorage
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    // Set item in localStorage
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },
    
    // Clear all data
    clearAll: function() {
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        this.init();
    },

    // Export data
    exportData: function() {
        const data = {};
        Object.values(this.KEYS).forEach(key => {
            data[key] = this.get(key);
        });
        return JSON.stringify(data, null, 2);
    },

    // Import data
    importData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.values(this.KEYS).forEach(key => {
                if (data[key] !== undefined) {
                    this.set(key, data[key]);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
};

// Initialize storage on load
Storage.init();
