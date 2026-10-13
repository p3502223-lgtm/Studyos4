// Dashboard logic for index.html

const Dashboard = {
    init: function() {
        this.updateGreetingAndDate();
        this.updateCountdown();
        this.updateProgress();
        this.renderSchedule();
    },

    updateGreetingAndDate: function() {
        const dateElement = document.querySelector('.tracking-wider');
        if (dateElement) {
            dateElement.textContent = App.formatDate(new Date());
        }

        const greetingElement = document.querySelector('h1.font-headline-lg-mobile');
        if (greetingElement) {
            const hour = new Date().getHours();
            let greeting = 'Good evening';
            if (hour < 12) greeting = 'Good morning';
            else if (hour < 18) greeting = 'Good afternoon';
            
            const settings = Storage.get(Storage.KEYS.SETTINGS);
            const name = settings.username || 'Student';
            greetingElement.textContent = `${greeting}, ${name} 👋`;
        }
    },

    updateCountdown: function() {
        const countdownElement = document.querySelector('.mt-space-xxs .font-label-md');
        if (countdownElement) {
            const settings = Storage.get(Storage.KEYS.SETTINGS);
            const daysLeft = App.daysUntil(settings.examDate);
            countdownElement.textContent = `${Math.max(0, daysLeft)} days to Final Exams`;
        }
    },

    updateProgress: function() {
        // Calculate total study time from sessions today
        const sessions = Storage.get(Storage.KEYS.SESSIONS) || [];
        const today = new Date().setHours(0, 0, 0, 0);
        
        const todaySessions = sessions.filter(session => {
            const sessionDate = new Date(session.timestamp).setHours(0, 0, 0, 0);
            return sessionDate === today;
        });

        const totalMinutes = todaySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        
        const settings = Storage.get(Storage.KEYS.SETTINGS);
        const targetHours = settings.dailyTargetHours || 6;
        
        const percentage = Math.min(100, Math.round((totalHours / targetHours) * 100));
        
        // Update Ring
        const ringElement = document.querySelector('.text-primary.transition-all');
        if (ringElement) {
            const circumference = 251.2; // 2 * Math.PI * 40
            const offset = circumference - (percentage / 100) * circumference;
            ringElement.style.strokeDashoffset = offset;
        }

        const percentageText = document.querySelector('.font-headline-sm.font-bold.text-on-surface');
        if (percentageText) percentageText.textContent = `${percentage}%`;

        // Update Text
        const statElements = document.querySelectorAll('.font-code-stat');
        if (statElements.length > 1) {
            statElements[1].textContent = `${totalHours}h / ${targetHours.toFixed(1)}h`;
        }
        
        const barElement = document.querySelector('.h-full.bg-primary.rounded-full');
        if (barElement) {
            barElement.style.width = `${percentage}%`;
        }

        const neededText = document.querySelector('.text-on-surface-variant.font-body-sm');
        if (neededText) {
            const remaining = Math.max(0, targetHours - totalHours).toFixed(1);
            neededText.textContent = `${remaining}h needed to hit your target before midnight.`;
        }

        // Update Quick Metrics
        const completedHourElements = document.querySelectorAll('.text-secondary.font-headline-sm');
        if (completedHourElements.length > 0) completedHourElements[0].textContent = `${totalHours}h`;

        const remainingHourElements = document.querySelectorAll('.text-on-surface.font-headline-sm');
        if (remainingHourElements.length > 0) remainingHourElements[0].textContent = `${Math.max(0, targetHours - totalHours).toFixed(1)}h`;
    },

    renderSchedule: function() {
        const tasks = Storage.get(Storage.KEYS.TASKS) || [];
        const today = new Date().setHours(0, 0, 0, 0);
        
        const todayTasks = tasks.filter(task => {
            const taskDate = new Date(task.date).setHours(0, 0, 0, 0);
            return taskDate === today;
        });

        // Update counts
        const scheduleTitle = Array.from(document.querySelectorAll('.font-title-md')).find(el => el.textContent.includes("Today's Schedule"));
        if (scheduleTitle && scheduleTitle.nextElementSibling) {
            scheduleTitle.nextElementSibling.textContent = `${todayTasks.length} Sessions`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
