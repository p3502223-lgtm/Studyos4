const Timer = {
    state: {
        remainingSeconds: 25 * 60, // 25 mins default
        totalSeconds: 25 * 60,
        isRunning: false,
        interval: null,
        mode: 'pomodoro', // 'pomodoro', 'shortBreak', 'longBreak'
        sessionStartTime: null
    },

    modes: {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60
    },

    init: function() {
        this.cacheDOM();
        this.setupEventListeners();
        this.updateView();
    },

    cacheDOM: function() {
        this.display = document.getElementById('timer-display');
        this.ring = document.getElementById('timer-ring');
        this.toggleBtn = document.getElementById('toggle-btn');
        this.toggleIcon = document.getElementById('toggle-icon');
        this.toggleText = document.getElementById('toggle-text');
        this.extendBtn = document.getElementById('extend-btn');
        this.circumference = 2 * Math.PI * 102; // ~640.88
    },

    setupEventListeners: function() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        if (this.extendBtn) {
            this.extendBtn.addEventListener('click', () => this.extend());
        }
        
        // Listen to pill buttons for switching modes if they exist
        document.querySelectorAll('.preset-btn').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const text = e.currentTarget.textContent.toLowerCase();
                if (text.includes('pomodoro')) this.setMode('pomodoro');
                else if (text.includes('short')) this.setMode('shortBreak');
                else if (text.includes('long')) this.setMode('longBreak');
            });
        });
    },
    
    setMode: function(mode) {
        this.state.mode = mode;
        this.state.totalSeconds = this.modes[mode];
        this.state.remainingSeconds = this.modes[mode];
        this.pause();
        this.updateView();
    },

    updateView: function() {
        const mins = Math.floor(this.state.remainingSeconds / 60);
        const secs = this.state.remainingSeconds % 60;
        
        if (this.display) {
            this.display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        
        if (this.ring) {
            const elapsedRatio = (this.state.totalSeconds - this.state.remainingSeconds) / this.state.totalSeconds;
            // The ring animation: stroke-dashoffset goes from circumference to 0
            const offset = this.circumference * (1 - elapsedRatio);
            this.ring.style.strokeDashoffset = offset;
        }
    },

    start: function() {
        if (this.state.interval) clearInterval(this.state.interval);
        
        if (!this.state.sessionStartTime) {
            this.state.sessionStartTime = new Date().toISOString();
        }

        this.state.isRunning = true;
        
        if (this.toggleIcon) this.toggleIcon.textContent = 'pause';
        if (this.toggleText) this.toggleText.textContent = 'Pause';
        
        this.state.interval = setInterval(() => {
            if (this.state.remainingSeconds > 0) {
                this.state.remainingSeconds--;
                this.updateView();
            } else {
                this.completeSession();
            }
        }, 1000);
    },

    pause: function() {
        clearInterval(this.state.interval);
        this.state.isRunning = false;
        
        if (this.toggleIcon) this.toggleIcon.textContent = 'play_arrow';
        if (this.toggleText) this.toggleText.textContent = 'Resume';
    },

    toggle: function() {
        if (this.state.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    extend: function() {
        this.state.remainingSeconds += 5 * 60;
        this.state.totalSeconds += 5 * 60;
        this.updateView();
    },

    completeSession: function() {
        this.pause();
        
        if (this.state.mode === 'pomodoro') {
            // Save session to localStorage to track analytics
            const sessions = Storage.get(Storage.KEYS.SESSIONS) || [];
            const durationMins = Math.floor(this.state.totalSeconds / 60);
            
            sessions.push({
                id: App.generateId(),
                timestamp: this.state.sessionStartTime || new Date().toISOString(),
                duration: durationMins, // in minutes
                type: 'focus'
            });
            
            Storage.set(Storage.KEYS.SESSIONS, sessions);
            
            // Notification or visual feedback
            if (this.toggleText) this.toggleText.textContent = 'Completed!';
        }
        
        this.state.sessionStartTime = null;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Timer.init();
});
