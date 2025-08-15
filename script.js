// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearSearch');
const cardsGrid = document.getElementById('cardsGrid');
const noResults = document.getElementById('noResults');
const themeToggle = document.getElementById('themeToggle');

// Modal elements
const promoModal = document.getElementById('promoModal');
const closeModal = document.getElementById('closeModal');
const contactBtn = document.getElementById('contactBtn');

// Get all cards
const cards = document.querySelectorAll('.card');

// Theme functionality
const initTheme = () => {
    // Check if user has a saved preference, otherwise default to dark mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        // Default to dark mode
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    }
};

const toggleTheme = () => {
    const isLightMode = document.body.classList.contains('light-mode');
    
    if (isLightMode) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
};

// Event listeners
themeToggle.addEventListener('click', toggleTheme);

// Modal event listeners
closeModal.addEventListener('click', closePromoModal);
contactBtn.addEventListener('click', () => {
    window.open('https://wa.link/s5xddq', '_blank');
});

// Close modal when clicking outside
promoModal.addEventListener('click', (e) => {
    if (e.target === promoModal) {
        closePromoModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && promoModal.classList.contains('active')) {
        closePromoModal();
    }
});

// Search functionality
searchInput.addEventListener('input', handleSearch);
clearButton.addEventListener('click', clearSearch);

// Card click handlers
cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
    
    // Make cards focusable for accessibility
    card.setAttribute('tabindex', '0');
    
    // Handle keyboard navigation
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick.call(card, e);
        }
    });
});

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    // Show/hide clear button
    clearButton.style.display = searchTerm ? 'block' : 'none';
    
    let visibleCards = 0;
    
    cards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();
        
        const isVisible = 
            category.includes(searchTerm) || 
            title.includes(searchTerm) || 
            description.includes(searchTerm);
        
        if (isVisible) {
            card.style.display = 'flex';
            // Add staggered animation
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
            visibleCards++;
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
    
    // Show/hide no results message
    if (visibleCards === 0 && searchTerm) {
        noResults.style.display = 'block';
        cardsGrid.style.display = 'none';
    } else {
        noResults.style.display = 'none';
        cardsGrid.style.display = 'grid';
    }
}

// Clear search
function clearSearch() {
    searchInput.value = '';
    clearButton.style.display = 'none';
    noResults.style.display = 'none';
    cardsGrid.style.display = 'grid';
    
    cards.forEach(card => {
        card.style.display = 'flex';
        card.classList.remove('fade-in');
    });
    
    // Focus back to search input
    searchInput.focus();
}

// Handle card clicks
function handleCardClick(e) {
    e.preventDefault();
    
    const cardTitle = this.querySelector('.card-title').textContent;
    const cardCategory = this.getAttribute('data-category');
    
    // Handle promo card specially
    if (cardCategory.toLowerCase() === 'promo') {
        openPromoModal();
        return;
    }
    
    // Define the links for each category
    const cardLinks = {
        'últimos agregados': 'https://drive.google.com/drive/folders/1LG0VXkdP_s2c8kwUTgYTKy2R0tDqI8RP?usp=drive_link',
        'nuevos en español': 'https://drive.google.com/drive/folders/11IzBy3whtmikTG2_mJjP8EmqA2DOYYlF?usp=drive_link',
        'abordajes': 'https://drive.google.com/drive/folders/1h09T4Ez9xPps5unGhK4XqIGWQD7ckZDQ?usp=drive_link',
        'anatomía': 'https://drive.google.com/drive/folders/1AX5wudp3i1TRuco5kNGcKnaFapb_XG1L?usp=drive_link',
        'ao': 'https://drive.google.com/drive/folders/130SucFTa1yWY1GTEFUhO6MniQmhwKxD2?usp=sharing',
        'artroplastia': 'https://drive.google.com/drive/folders/1bSruX2U1NASFDQmTHtlykBbdAL8hAg3o?usp=drive_link',
        'artroscopia': 'https://drive.google.com/drive/folders/1LrO-tT0-47XISNysjRCLTZSO74Tv2SfJ?usp=drive_link',
        'campbell': 'https://drive.google.com/drive/folders/1SrsTmMpqyQLJrxxp_MmPNLM92Jjhuq_-?usp=drive_link',
        'clínica': 'https://drive.google.com/drive/folders/1D3ZIjadlTaGKiVX8m7A-WKyRA9MC_K8o?usp=drive_link',
        'imagenología': 'https://drive.google.com/drive/folders/1Q0lzcMqroJkIjoTtE50Gu-_v87eGMbqV?usp=drive_link',
        'kapandji': 'https://drive.google.com/drive/folders/1x4Jnu-g4YHGTWNWWJD4xIT6aT3dl4xo1?usp=drive_link',
        'master de trauma': 'https://drive.google.com/drive/folders/1pszVLeOQZ6oTKK2JHutF8-205OrLnmCG?usp=drive_link',
        'operative techniques': 'https://drive.google.com/drive/folders/1MNsv8T7_E0LrXaoGQqTKSlIQo4Q2U2bA?usp=drive_link',
        'orthopedics review': 'https://drive.google.com/drive/folders/1lHAxtCrf78URKWc1xBFnztGBD7rUHcUZ?usp=drive_link',
        'ortopedia deportiva': 'https://drive.google.com/drive/folders/1CKcYurQTS1PAnqmcT7x7_tY4kL7mWlYt?usp=drive_link',
        'ortopedia general': 'https://drive.google.com/drive/folders/1Zemgi5FKW3uj2BT2QQcyyV--OLUfZhpT?usp=drive_link',
        'ortopedia pediatrica': 'https://drive.google.com/drive/folders/1m2Ifrvfoyx-QqTDDYx6VNHxdlgHsHCx-?usp=drive_link',
        'qx cadera': 'https://drive.google.com/drive/folders/1EVSuiOTX1xHzz3khd_790LUTXPqu7jbW?usp=drive_link',
        'qx columna': 'https://drive.google.com/drive/folders/1d9xbrTbGJxNF86IR7FMtk1_rNPvPuClF?usp=drive_link',
        'qx hombro': 'https://drive.google.com/drive/folders/1PKnARSo1pJ84m_6LuuOPRvnQXO3WosTW?usp=drive_link',
        'qx mano': 'https://drive.google.com/drive/folders/1_1g8QopciynPN7HuxouH_7v_1blI0m81?usp=drive_link',
        'qx pie tobillo': 'https://drive.google.com/drive/folders/1vDmxFvBD9E1dRr_fQq3ANZvNn-46C-Bj?usp=drive_link',
        'qx rodilla': 'https://drive.google.com/drive/folders/13KIZx4HrDA7KBXNnireEwPnhgng58ZjO?usp=drive_link',
        'remplazo articular': 'https://drive.google.com/drive/folders/1bSruX2U1NASFDQmTHtlykBbdAL8hAg3o?usp=drive_link',
        'rockwood': 'https://drive.google.com/drive/folders/1xJpDRDKbUcQ6EYjfIrnCsL5oi6tZ0iqz?usp=drive_link',
        'tumores': 'https://drive.google.com/drive/folders/1cQ0w10gtEEnRr4Z3mWpGtxSENaag-h7p?usp=drive_link',
        'varios': 'https://drive.google.com/drive/folders/1Wf_8LpjSUEip029fuZ_9f1-cVLOLzuvj?usp=drive_link',
        'consentimiento informado': 'https://drive.google.com/drive/folders/1biSatyiQLBwWe9RyXhcDxydMOSJCyXNa?usp=sharing',
        'promo': 'https://wa.link/s5xddq',
        'solicitar acceso': 'https://wa.link/s5xddq'
    };
    
    // Add click animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 150);
    
    // Get the link for this category
    const link = cardLinks[cardCategory.toLowerCase()];
    
    if (link) {
        // Open the link in a new tab
        window.open(link, '_blank');
    } else {
        console.log(`No link found for: ${cardTitle} (${cardCategory})`);
    }
    
    // Or trigger a custom event
    document.dispatchEvent(new CustomEvent('cardClick', {
        detail: {
            title: cardTitle,
            category: cardCategory,
            link: link,
            element: this
        }
    }));
}

// Keyboard navigation for search
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearSearch();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const firstVisibleCard = document.querySelector('.card:not([style*="display: none"])');
        if (firstVisibleCard) {
            firstVisibleCard.focus();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Add initial animation classes
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('loaded');
        }, index * 100);
    });
    
    // Focus search input
    searchInput.focus();
});

// Add fade-in animation class
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.5s ease-out;
    }
    
    .card.loaded {
        animation: fadeInUp 0.6s ease-out;
    }
`;
document.head.appendChild(style);

// Handle resize events for responsive behavior
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate grid if needed
        console.log('Window resized');
    }, 250);
});

// Add smooth scrolling behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Utility function to add new cards dynamically
function addCard(cardData) {
    const { title, description, category, iconClass, colorClass } = cardData;
    
    const cardHTML = `
        <div class="card" data-category="${category.toLowerCase()}">
            <div class="card-icon ${colorClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="card-content">
                <h3 class="card-title">${title}</h3>
                <p class="card-description">${description}</p>
            </div>
            <div class="card-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `;
    
    cardsGrid.insertAdjacentHTML('beforeend', cardHTML);
    
    // Add event listeners to new card
    const newCard = cardsGrid.lastElementChild;
    newCard.addEventListener('click', handleCardClick);
    newCard.setAttribute('tabindex', '0');
    newCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick.call(newCard, e);
        }
    });
}

// Modal functions
function openPromoModal() {
    promoModal.style.display = 'flex';
    // Force reflow before adding active class for animation
    promoModal.offsetHeight;
    promoModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closePromoModal() {
    promoModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        if (!promoModal.classList.contains('active')) {
            promoModal.style.display = 'none';
        }
    }, 300);
}

// Export functions for external use
window.LinkDirectory = {
    addCard,
    clearSearch,
    handleSearch: (term) => {
        searchInput.value = term;
        handleSearch({ target: searchInput });
    }
};