const Subjects = {
    init: function() {
        this.renderSubjects();
        this.setupEventListeners();
    },

    setupEventListeners: function() {
        window.toggleModule = this.toggleModule.bind(this);
        
        const subjects = Storage.get(Storage.KEYS.SUBJECTS) || [];
        if (subjects.length === 0) {
            Storage.set(Storage.KEYS.SUBJECTS, [
                {
                    id: App.generateId(),
                    name: 'Mathematics',
                    icon: 'functions',
                    chapters: [
                        { id: App.generateId(), title: 'Differential Calculus', totalTopics: 12, completedTopics: 12 },
                        { id: App.generateId(), title: 'Vectors & 3D Geometry', totalTopics: 12, completedTopics: 8 }
                    ]
                },
                {
                    id: App.generateId(),
                    name: 'Physics',
                    icon: 'public',
                    chapters: [
                        { id: App.generateId(), title: 'Thermodynamics', totalTopics: 10, completedTopics: 3 }
                    ]
                }
            ]);
            this.renderSubjects();
        }
    },

    toggleModule: function(drawerId, chevronId) {
        const drawer = document.getElementById(drawerId);
        const chevron = document.getElementById(chevronId);
        if (!drawer) return;
        
        if (drawer.classList.contains('hidden')) {
            drawer.classList.remove('hidden');
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        } else {
            drawer.classList.add('hidden');
            if (chevron) chevron.style.transform = 'rotate(-90deg)';
        }
    },

    renderSubjects: function() {
        const container = document.getElementById('view-subjects-container');
        if (!container) return;
        
        const header = container.querySelector('.flex.items-center.justify-between');
        const subjects = Storage.get(Storage.KEYS.SUBJECTS) || [];
        
        container.innerHTML = '';
        if (header) container.appendChild(header);

        subjects.forEach((subject, index) => {
            const drawerId = `subject-drawer-${index}`;
            const chevronId = `subject-chevron-${index}`;
            
            let totalTopics = 0;
            let completedTopics = 0;
            subject.chapters.forEach(c => {
                totalTopics += c.totalTopics;
                completedTopics += c.completedTopics;
            });
            const progress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
            
            const subjectEl = document.createElement('div');
            subjectEl.className = 'rounded-xl bg-surface-container overflow-hidden transition-all duration-200';
            subjectEl.innerHTML = `
                <div class="p-space-md flex items-center justify-between gap-space-sm cursor-pointer select-none" onclick="toggleModule('${drawerId}', '${chevronId}')">
                    <div class="flex items-center gap-space-md min-w-0">
                        <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <span class="material-symbols-outlined text-[22px]">${subject.icon || 'book'}</span>
                        </div>
                        <div class="flex flex-col min-w-0">
                            <div class="flex items-center gap-space-xs">
                                <span class="font-title-md text-title-md text-on-surface font-semibold truncate">${subject.name}</span>
                                <span class="px-space-xs py-0.5 rounded-full bg-surface-container-highest font-code-stat text-code-stat text-on-surface-variant">${progress}%</span>
                            </div>
                            <span class="font-body-sm text-body-sm text-on-surface-variant">${subject.chapters.length} core chapters · ${totalTopics} topics</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-space-sm">
                        <div class="w-12 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                            <div class="h-full bg-primary" style="width: ${progress}%;"></div>
                        </div>
                        <span class="material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 transform rotate-[-90deg]" id="${chevronId}">expand_more</span>
                    </div>
                </div>
                <!-- Accordion Inner Drawer -->
                <div class="px-space-md pb-space-md flex flex-col gap-space-sm hidden" id="${drawerId}">
                    ${subject.chapters.map(chapter => {
                        const chapterProgress = chapter.totalTopics === 0 ? 0 : Math.round((chapter.completedTopics / chapter.totalTopics) * 100);
                        let pillClass = "bg-surface-container-highest text-on-surface-variant";
                        let pillText = "Unstarted";
                        
                        if (chapterProgress === 100) {
                            pillClass = "bg-secondary-container text-on-secondary-container font-semibold";
                            pillText = "Mastered";
                        } else if (chapterProgress > 0) {
                            pillClass = "bg-surface-container-highest text-primary font-semibold";
                            pillText = `${chapterProgress}% Active`;
                        }
                        
                        return `
                        <div class="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
                            <div class="flex flex-col min-w-0">
                                <span class="font-body-md text-body-md text-on-surface font-medium truncate">${chapter.title}</span>
                                <span class="font-body-sm text-body-sm text-on-surface-variant">${chapter.completedTopics} / ${chapter.totalTopics} topics practiced</span>
                            </div>
                            <span class="px-space-xs py-0.5 rounded-full ${pillClass} font-label-sm text-label-sm flex-shrink-0">${pillText}</span>
                        </div>
                        `;
                    }).join('')}
                    <!-- Add Chapter Button -->
                    <button class="w-full mt-2 py-space-xs rounded-lg border-2 border-dashed border-outline-variant text-primary font-label-md hover:bg-primary/5 transition-colors" onclick="alert('Add chapter feature coming soon!')">
                        + Add Chapter
                    </button>
                </div>
            `;
            container.appendChild(subjectEl);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Subjects.init();
});
