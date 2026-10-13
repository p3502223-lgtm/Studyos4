const Profile = {
    init: function() {
        this.setupSettings();
        this.setupInteractions();
        this.setupDataManagement();
    },

    setupSettings: function() {
        const settings = Storage.get(Storage.KEYS.SETTINGS) || {};
        
        // Update name
        const nameEl = document.querySelector('h1.font-headline-sm');
        if (nameEl) nameEl.textContent = settings.username || 'Student';
        
        // Target Hours Stepper
        const targetValEl = document.getElementById('target-value');
        if (targetValEl) {
            targetValEl.textContent = (parseFloat(settings.dailyTargetHours) || 6.0).toFixed(1) + 'h';
        }
        
        // Exam date
        const examDateText = document.querySelector('.material-symbols-outlined.text-primary:contains("event_available")')?.nextElementSibling;
        if (examDateText && settings.examDate) {
            examDateText.textContent = App.formatDate(settings.examDate);
        }
    },

    setupInteractions: function() {
        // Stepper Micro-Interaction
        const targetValEl = document.getElementById('target-value');
        const minusBtn = document.getElementById('target-minus');
        const plusBtn = document.getElementById('target-plus');
        
        if (minusBtn && plusBtn && targetValEl) {
            minusBtn.addEventListener('click', () => {
                let currentTarget = parseFloat(targetValEl.textContent.replace('h', ''));
                if (currentTarget > 2.0) {
                    currentTarget = Math.round((currentTarget - 0.5) * 10) / 10;
                    targetValEl.textContent = currentTarget.toFixed(1) + 'h';
                    this.saveSetting('dailyTargetHours', currentTarget);
                }
            });

            plusBtn.addEventListener('click', () => {
                let currentTarget = parseFloat(targetValEl.textContent.replace('h', ''));
                if (currentTarget < 12.0) {
                    currentTarget = Math.round((currentTarget + 0.5) * 10) / 10;
                    targetValEl.textContent = currentTarget.toFixed(1) + 'h';
                    this.saveSetting('dailyTargetHours', currentTarget);
                }
            });
        }

        // Generic Toggle Switch Logic
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const isChecked = btn.getAttribute('aria-checked') === 'true';
                const knob = btn.firstElementChild;
                if (isChecked) {
                    btn.setAttribute('aria-checked', 'false');
                    btn.classList.remove('bg-secondary');
                    btn.classList.add('bg-surface-bright');
                    knob.classList.remove('translate-x-5', 'bg-on-secondary');
                    knob.classList.add('translate-x-0', 'bg-on-surface-variant');
                } else {
                    btn.setAttribute('aria-checked', 'true');
                    btn.classList.remove('bg-surface-bright');
                    btn.classList.add('bg-secondary');
                    knob.classList.remove('translate-x-0', 'bg-on-surface-variant');
                    knob.classList.add('translate-x-5', 'bg-on-secondary');
                }
                
                // If this is dark mode toggle
                const label = btn.previousElementSibling?.textContent?.trim().toLowerCase();
                if (label && label.includes('dark')) {
                    this.saveSetting('theme', !isChecked ? 'dark' : 'light');
                    if (!isChecked) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            });
        });
    },

    saveSetting: function(key, value) {
        const settings = Storage.get(Storage.KEYS.SETTINGS) || {};
        settings[key] = value;
        Storage.set(Storage.KEYS.SETTINGS, settings);
    },

    setupDataManagement: function() {
        // Export
        const exportBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Export'));
        if (exportBtn) {
            exportBtn.textContent = 'Export App Data (JSON)';
            exportBtn.addEventListener('click', () => {
                const data = Storage.exportData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `studyos_backup_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        
            // Import (Add input dynamically after Export btn)
            const importBtn = document.createElement('button');
            importBtn.className = exportBtn.className;
            importBtn.innerHTML = `
                <span class="material-symbols-outlined text-[18px]">file_upload</span>
                <span>Import App Data</span>
            `;
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (Storage.importData(e.target.result)) {
                            alert('Data imported successfully! App will reload.');
                            window.location.reload();
                        } else {
                            alert('Failed to import data. Invalid format.');
                        }
                    };
                    reader.readAsText(file);
                }
            });
            
            importBtn.addEventListener('click', () => fileInput.click());
            
            exportBtn.parentNode.insertBefore(importBtn, exportBtn.nextSibling);
            exportBtn.parentNode.insertBefore(fileInput, importBtn);
        }

        // Clear All / Logout
        const logoutBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Log Out'));
        if (logoutBtn) {
            logoutBtn.innerHTML = `
                <span class="material-symbols-outlined text-[18px]">delete_forever</span>
                <span>Clear All Data</span>
            `;
            logoutBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete all app data? This cannot be undone.')) {
                    Storage.clearAll();
                    alert('All data cleared.');
                    window.location.reload();
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Profile.init();
});
