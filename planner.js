const Planner = {
    init: function() {
        this.renderTasks();
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        // Toggle new session drawer
        const fab = document.querySelector('.fixed.bottom-20.right-4');
        const drawer = document.getElementById('sessionDrawer');
        const drawerContent = document.getElementById('sessionDrawerContent');
        const cancelBtn = document.getElementById('cancelDrawerBtn');
        const saveBtn = document.getElementById('commitSessionBtn');
        
        if (fab && drawer && drawerContent) {
            fab.addEventListener('click', () => this.toggleDrawer(true));
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.toggleDrawer(false));
            // Close on overlay click
            drawer.addEventListener('click', (e) => {
                if (e.target === drawer) this.toggleDrawer(false);
            });
        }
        
        // Handle filter clicks
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.replace('bg-primary', 'bg-surface-container'));
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.replace('text-on-primary', 'text-on-surface-variant'));
                document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
                
                const target = e.currentTarget;
                target.classList.add('active');
                target.classList.replace('bg-surface-container', 'bg-primary');
                target.classList.replace('text-on-surface-variant', 'text-on-primary');
                
                this.renderTasks();
            });
        });
        
        // Handle saving a task
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const titleInput = document.querySelector('input[placeholder="e.g. Thermodynamics Carnot Cycle"]');
                const title = titleInput ? titleInput.value : 'New Session';
                if (!title.trim()) return;

                const tasks = Storage.get(Storage.KEYS.TASKS) || [];
                tasks.push({
                    id: App.generateId(),
                    title: title,
                    date: new Date().toISOString(),
                    completed: false,
                    duration: 60, // default 60m
                    subject: 'Physics' // mock
                });
                Storage.set(Storage.KEYS.TASKS, tasks);
                this.toggleDrawer(false);
                if(titleInput) titleInput.value = '';
                this.renderTasks();
            });
        }
    },
    
    toggleDrawer: function(show) {
        const drawer = document.getElementById('sessionDrawer');
        const content = document.getElementById('sessionDrawerContent');
        if (!drawer || !content) return;
        
        if (show) {
            drawer.classList.remove('hidden');
            setTimeout(() => {
                drawer.classList.remove('opacity-0');
                content.classList.remove('translate-y-full');
            }, 10);
        } else {
            drawer.classList.add('opacity-0');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                drawer.classList.add('hidden');
            }, 300);
        }
    },

    renderTasks: function() {
        const tasks = Storage.get(Storage.KEYS.TASKS) || [];
        const container = document.querySelector('section.flex.flex-col.gap-space-md:last-of-type .flex.flex-col.gap-space-sm.relative');
        if (!container) return;
        
        const activeFilter = document.querySelector('.filter-chip.active span:first-child')?.textContent || 'All';
        
        let filteredTasks = tasks;
        if (activeFilter === 'Planned') {
            filteredTasks = tasks.filter(t => !t.completed);
        } else if (activeFilter === 'Completed') {
            filteredTasks = tasks.filter(t => t.completed);
        }
        
        const staticTasks = Array.from(container.children).filter(child => !child.classList.contains('dynamic-task'));
        container.innerHTML = ''; // clear
        
        filteredTasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = `dynamic-task flex flex-col p-space-md rounded-xl bg-surface-container shadow-sm gap-space-sm ${task.completed ? 'opacity-70' : ''}`;
            taskEl.innerHTML = `
                <div class="flex items-start justify-between gap-space-sm">
                    <div class="flex items-center gap-space-xs">
                        <span class="px-space-xs py-space-xxs rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">${task.subject}</span>
                    </div>
                    <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">${task.duration}m</span>
                </div>
                <div class="flex items-center gap-space-md">
                    <button class="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors toggle-task ${task.completed ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant bg-transparent'}" data-id="${task.id}">
                        ${task.completed ? '<span class="material-symbols-outlined text-[16px]">check</span>' : ''}
                    </button>
                    <div class="flex flex-col flex-1 min-w-0">
                        <span class="font-title-md text-title-md text-on-surface truncate ${task.completed ? 'line-through text-on-surface-variant' : ''}">${task.title}</span>
                    </div>
                    <button class="text-error delete-task" data-id="${task.id}">
                         <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </div>
            `;
            container.appendChild(taskEl);
        });
        
        if (filteredTasks.length === 0 && tasks.length === 0) {
            staticTasks.forEach(st => container.appendChild(st));
        }

        container.querySelectorAll('.toggle-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const index = tasks.findIndex(t => t.id === id);
                if (index > -1) {
                    tasks[index].completed = !tasks[index].completed;
                    Storage.set(Storage.KEYS.TASKS, tasks);
                    this.renderTasks();
                }
            });
        });
        
        container.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                const filtered = tasks.filter(t => t.id !== id);
                Storage.set(Storage.KEYS.TASKS, filtered);
                this.renderTasks();
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Planner.init();
});
