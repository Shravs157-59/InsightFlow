/**
 * Modern To-Do List Application
 * Features: localStorage persistence, animations, search, filtering, categories
 */

class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.taskToDelete = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.bindEvents();
        this.updateCurrentDate();
        this.renderTasks();
        this.updateSummary();
        this.setupKeyboardShortcuts();
    }

    /**
     * Bind all event listeners
     */
    bindEvents() {
        // Task form submission
        const taskForm = document.getElementById('taskForm');
        taskForm.addEventListener('submit', (e) => this.handleAddTask(e));

        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Filter select
        const filterSelect = document.getElementById('filterSelect');
        filterSelect.addEventListener('change', (e) => this.handleFilter(e.target.value));

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));

        // Category filters
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCategoryFilter(e.target.dataset.category);
            });
        });

        // Delete confirmation
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());

        // Modal events
        const deleteModal = document.getElementById('deleteModal');
        deleteModal.addEventListener('hidden.bs.modal', () => {
            this.taskToDelete = null;
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to add task
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                const taskInput = document.getElementById('taskInput');
                if (taskInput.value.trim()) {
                    document.getElementById('taskForm').dispatchEvent(new Event('submit'));
                } else {
                    taskInput.focus();
                }
            }
            
            // Escape to clear search
            if (e.key === 'Escape') {
                const searchInput = document.getElementById('searchInput');
                if (searchInput.value) {
                    searchInput.value = '';
                    this.handleSearch('');
                }
            }
        });
    }

    /**
     * Load tasks from localStorage
     */
    loadTasks() {
        try {
            const stored = localStorage.getItem('modernTodoTasks');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    /**
     * Save tasks to localStorage
     */
    saveTasks() {
        try {
            localStorage.setItem('modernTodoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            this.showError('Failed to save tasks. Storage might be full.');
        }
    }

    /**
     * Generate unique ID for tasks
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Handle adding a new task
     */
    handleAddTask(e) {
        e.preventDefault();
        
        const taskInput = document.getElementById('taskInput');
        const dueDateInput = document.getElementById('dueDateInput');
        const categorySelect = document.getElementById('categorySelect');
        
        const taskText = taskInput.value.trim();
        
        if (!taskText) {
            this.showFieldError('taskInput', 'Please enter a task description');
            return;
        }

        if (taskText.length > 200) {
            this.showFieldError('taskInput', 'Task description must be less than 200 characters');
            return;
        }

        // Clear any previous errors
        this.clearFieldError('taskInput');

        const newTask = {
            id: this.generateId(),
            text: taskText,
            completed: false,
            category: categorySelect.value,
            dueDate: dueDateInput.value || null,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(newTask);
        this.saveTasks();
        
        // Clear form
        taskForm.reset();
        taskInput.focus();
        
        // Re-render and update summary
        this.renderTasks();
        this.updateSummary();
        
        // Show success feedback
        this.showSuccess('Task added successfully!');
    }

    /**
     * Handle search functionality
     */
    handleSearch(query) {
        this.currentSearch = query.toLowerCase();
        this.renderTasks();
    }

    /**
     * Handle filter changes
     */
    handleFilter(filter) {
        this.currentFilter = filter;
        this.renderTasks();
    }

    /**
     * Handle sort changes
     */
    handleSort(sort) {
        this.currentSort = sort;
        this.renderTasks();
    }

    /**
     * Handle category filter
     */
    handleCategoryFilter(category) {
        this.currentCategory = category;
        
        // Update active state
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderTasks();
    }

    /**
     * Toggle task completion
     */
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveTasks();
            this.renderTasks();
            this.updateSummary();
            
            const action = task.completed ? 'completed' : 'uncompleted';
            this.showSuccess(`Task ${action}!`);
        }
    }

    /**
     * Show delete confirmation modal
     */
    showDeleteConfirmation(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.taskToDelete = taskId;
            
            // Show task preview in modal
            const taskPreview = document.getElementById('taskPreview');
            taskPreview.textContent = task.text;
            
            // Show modal
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        }
    }

    /**
     * Confirm task deletion
     */
    confirmDelete() {
        if (this.taskToDelete) {
            const taskElement = document.querySelector(`[data-task-id="${this.taskToDelete}"]`);
            
            if (taskElement) {
                // Add deletion animation
                taskElement.classList.add('deleting');
                
                // Remove after animation
                setTimeout(() => {
                    this.tasks = this.tasks.filter(task => task.id !== this.taskToDelete);
                    this.saveTasks();
                    this.renderTasks();
                    this.updateSummary();
                    this.showSuccess('Task deleted successfully!');
                    
                    // Hide modal
                    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                    deleteModal.hide();
                }, 300);
            }
        }
    }

    /**
     * Get filtered and sorted tasks
     */
    getFilteredTasks() {
        let filteredTasks = [...this.tasks];
        
        // Apply search filter
        if (this.currentSearch) {
            filteredTasks = filteredTasks.filter(task =>
                task.text.toLowerCase().includes(this.currentSearch)
            );
        }
        
        // Apply status filter
        if (this.currentFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => {
                switch (this.currentFilter) {
                    case 'completed':
                        return task.completed;
                    case 'pending':
                        return !task.completed;
                    case 'overdue':
                        return !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
                    default:
                        return true;
                }
            });
        }
        
        // Apply category filter
        if (this.currentCategory !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category === this.currentCategory);
        }
        
        // Apply sorting
        filteredTasks.sort((a, b) => {
            switch (this.currentSort) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'dueDate':
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                case 'category':
                    return a.category.localeCompare(b.category);
                case 'alphabetical':
                    return a.text.localeCompare(b.text);
                default:
                    return 0;
            }
        });
        
        return filteredTasks;
    }

    /**
     * Render all tasks
     */
    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            
            // Update empty state message based on filters
            const emptyContent = emptyState.querySelector('.empty-state-content');
            if (this.tasks.length === 0) {
                emptyContent.innerHTML = `
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No tasks yet</h3>
                    <p>Add your first task to get started!</p>
                `;
            } else {
                emptyContent.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>No tasks found</h3>
                    <p>Try adjusting your search or filters.</p>
                `;
            }
        } else {
            tasksList.style.display = 'block';
            emptyState.style.display = 'none';
            
            tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
            
            // Bind task-specific events
            this.bindTaskEvents();
        }
    }

    /**
     * Create HTML for a single task
     */
    createTaskHTML(task) {
        const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
        const categoryEmoji = this.getCategoryEmoji(task.category);
        const dueDateFormatted = task.dueDate ? this.formatDate(task.dueDate) : null;
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}" 
                 data-task-id="${task.id}">
                <div class="task-header">
                    <div class="task-content">
                        <div class="task-title">${this.escapeHtml(task.text)}</div>
                        <div class="task-meta">
                            <span class="task-category">
                                ${categoryEmoji} ${task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                            </span>
                            ${dueDateFormatted ? `
                                <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                                    <i class="fas fa-calendar"></i>
                                    ${dueDateFormatted}
                                </span>
                            ` : ''}
                            ${task.completed ? `
                                <span class="task-status completed">
                                    <i class="fas fa-check"></i>
                                    Completed
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-task-action btn-complete" 
                                onclick="todoApp.toggleTask('${task.id}')"
                                title="${task.completed ? 'Mark as pending' : 'Mark as completed'}"
                                aria-label="${task.completed ? 'Mark as pending' : 'Mark as completed'}">
                            <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                        </button>
                        <button class="btn btn-task-action btn-delete" 
                                onclick="todoApp.showDeleteConfirmation('${task.id}')"
                                title="Delete task"
                                aria-label="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Bind events for task items
     */
    bindTaskEvents() {
        // Events are handled via onclick attributes in createTaskHTML
        // This method is kept for future enhancements
    }

    /**
     * Update the summary statistics
     */
    updateSummary() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const overdue = this.tasks.filter(task => 
            !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
        ).length;
        
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;
    }

    /**
     * Update the current date display
     */
    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        const dateString = now.toLocaleDateString('en-US', options);
        document.getElementById('currentDate').textContent = dateString;
    }

    /**
     * Get emoji for category
     */
    getCategoryEmoji(category) {
        const emojis = {
            personal: '📱',
            work: '💼',
            study: '📚'
        };
        return emojis[category] || '📝';
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const diffTime = taskDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Today';
        } else if (diffDays === 1) {
            return 'Tomorrow';
        } else if (diffDays === -1) {
            return 'Yesterday';
        } else if (diffDays > 0 && diffDays <= 7) {
            return `In ${diffDays} days`;
        } else if (diffDays < 0 && diffDays >= -7) {
            return `${Math.abs(diffDays)} days ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            });
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Show success message
     */
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showToast(message, 'error');
    }

    /**
     * Show form field error
     */
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        field.classList.add('is-invalid');
        if (errorDiv) {
            errorDiv.textContent = message;
        }
    }

    /**
     * Clear form field error
     */
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        
        field.classList.remove('is-invalid');
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${this.escapeHtml(message)}</span>
            </div>
        `;

        // Add toast styles if not already present
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    padding: 1rem 1.5rem;
                    z-index: 9999;
                    min-width: 300px;
                    transform: translateX(400px);
                    transition: transform 0.3s ease-out;
                    border-left: 4px solid var(--primary-blue);
                }
                .toast.toast-success {
                    border-left-color: var(--success-color);
                }
                .toast.toast-error {
                    border-left-color: var(--danger-color);
                }
                .toast.show {
                    transform: translateX(0);
                }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .toast-content i {
                    color: var(--primary-blue);
                }
                .toast.toast-success .toast-content i {
                    color: var(--success-color);
                }
                .toast.toast-error .toast-content i {
                    color: var(--danger-color);
                }
            `;
            document.head.appendChild(style);
        }

        // Add to DOM and show
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});

// Handle visibility change to update date
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.todoApp) {
        window.todoApp.updateCurrentDate();
    }
});
