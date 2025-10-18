// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchBox = null;
        this.headerSearch = null;
        this.clearBtn = null;
        this.searchTerm = '';
        this.searchHistory = storage.get('searchHistory', []);
        this.debounceTimer = null;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindElements();
            this.bindEvents();
        });
    }

    bindElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBox = document.getElementById('searchBox');
        this.headerSearch = document.getElementById('headerSearch');
        this.clearBtn = document.getElementById('clearSearch');
    }

    bindEvents() {
        if (!this.searchInput) return;

        // Search input events
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        this.searchInput.addEventListener('focus', () => {
            this.expandSearch();
        });

        this.searchInput.addEventListener('blur', () => {
            if (!this.searchTerm) {
                this.collapseSearch();
            }
        });

        // Search box click to expand
        if (this.searchBox) {
            this.searchBox.addEventListener('click', (e) => {
                if (this.headerSearch && this.headerSearch.classList.contains('collapsed')) {
                    e.preventDefault();
                    this.expandSearch();
                }
            });
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === '/')) {
                e.preventDefault();
                this.focusSearch();
            }
            
            if (e.key === 'Escape' && document.activeElement === this.searchInput) {
                this.clearSearch();
                this.searchInput.blur();
            }
        });
    }

    handleSearchInput(value) {
        this.searchTerm = value.trim();
        this.updateClearButton();
        
        // Debounce search
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.performSearch(this.searchTerm);
            if (this.searchTerm) {
                this.addToHistory(this.searchTerm);
            }
        }, 300);
    }

    performSearch(term) {
        const event = new CustomEvent('searchPerformed', {
            detail: { searchTerm: term }
        });
        document.dispatchEvent(event);
    }

    expandSearch() {
        if (this.headerSearch) {
            this.headerSearch.classList.remove('collapsed');
            this.headerSearch.classList.add('expanded');
        }
        
        setTimeout(() => {
            if (this.searchInput) {
                this.searchInput.focus();
            }
        }, 100);
    }

    collapseSearch() {
        if (this.headerSearch && !this.searchTerm) {
            this.headerSearch.classList.remove('expanded');
            this.headerSearch.classList.add('collapsed');
        }
    }

    focusSearch() {
        this.expandSearch();
    }

    clearSearch() {
        this.searchTerm = '';
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.updateClearButton();
        this.performSearch('');
        this.collapseSearch();
    }

    updateClearButton() {
        if (this.clearBtn) {
            this.clearBtn.style.display = this.searchTerm ? 'block' : 'none';
        }
    }

    addToHistory(term) {
        if (!term.trim()) return;
        
        const newItem = {
            term: term.trim(),
            timestamp: Date.now()
        };
        
        // Remove existing entry if it exists
        this.searchHistory = this.searchHistory.filter(item => item.term !== newItem.term);
        
        // Add to beginning and limit to 10 items
        this.searchHistory = [newItem, ...this.searchHistory].slice(0, 10);
        storage.set('searchHistory', this.searchHistory);
    }

    getSearchHistory() {
        return this.searchHistory;
    }

    clearHistory() {
        this.searchHistory = [];
        storage.remove('searchHistory');
    }

    getCurrentSearchTerm() {
        return this.searchTerm;
    }
}

// Create global search manager instance
window.searchManager = new SearchManager();