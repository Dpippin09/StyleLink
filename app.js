// StyleLink - Fashion Deal Comparison App

// Sample data - In a real app, this would come from an API
const sampleDeals = [
    {
        id: 1,
        name: "Designer Leather Sneakers",
        category: "shoes",
        store: "Nordstrom",
        currentPrice: 89.99,
        originalPrice: 159.99,
        discount: 44,
        icon: "👟"
    },
    {
        id: 2,
        name: "Luxury Silk Scarf",
        category: "accessories",
        store: "Saks Fifth Avenue",
        currentPrice: 45.00,
        originalPrice: 95.00,
        discount: 53,
        icon: "🧣"
    },
    {
        id: 3,
        name: "Premium Denim Jacket",
        category: "clothing",
        store: "Bloomingdale's",
        currentPrice: 119.99,
        originalPrice: 199.99,
        discount: 40,
        icon: "🧥"
    },
    {
        id: 4,
        name: "Italian Leather Handbag",
        category: "bags",
        store: "Neiman Marcus",
        currentPrice: 249.00,
        originalPrice: 450.00,
        discount: 45,
        icon: "👜"
    },
    {
        id: 5,
        name: "Cashmere Sweater",
        category: "clothing",
        store: "Macy's",
        currentPrice: 79.99,
        originalPrice: 150.00,
        discount: 47,
        icon: "👔"
    },
    {
        id: 6,
        name: "Designer Sunglasses",
        category: "accessories",
        store: "Nordstrom Rack",
        currentPrice: 69.99,
        originalPrice: 180.00,
        discount: 61,
        icon: "🕶️"
    },
    {
        id: 7,
        name: "Ankle Boots",
        category: "shoes",
        store: "Zappos",
        currentPrice: 99.99,
        originalPrice: 175.00,
        discount: 43,
        icon: "👢"
    },
    {
        id: 8,
        name: "Crossbody Bag",
        category: "bags",
        store: "Coach Outlet",
        currentPrice: 129.99,
        originalPrice: 250.00,
        discount: 48,
        icon: "👝"
    },
    {
        id: 9,
        name: "Wool Coat",
        category: "clothing",
        store: "J.Crew",
        currentPrice: 189.99,
        originalPrice: 350.00,
        discount: 46,
        icon: "🧥"
    },
    {
        id: 10,
        name: "Gold Watch",
        category: "accessories",
        store: "Macy's",
        currentPrice: 159.99,
        originalPrice: 300.00,
        discount: 47,
        icon: "⌚"
    },
    {
        id: 11,
        name: "Running Shoes",
        category: "shoes",
        store: "Nike Outlet",
        currentPrice: 64.99,
        originalPrice: 120.00,
        discount: 46,
        icon: "👟"
    },
    {
        id: 12,
        name: "Tote Bag",
        category: "bags",
        store: "Michael Kors",
        currentPrice: 149.99,
        originalPrice: 280.00,
        discount: 46,
        icon: "👜"
    }
];

let comparisonList = [];
let allDeals = [...sampleDeals];

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const resultsGrid = document.getElementById('resultsGrid');
const comparisonSection = document.getElementById('comparisonSection');
const comparisonGrid = document.getElementById('comparisonGrid');

// Initialize app
function init() {
    displayDeals(allDeals);
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    categoryFilter.addEventListener('change', handleFilters);
    priceFilter.addEventListener('change', handleFilters);
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let filteredDeals = allDeals;

    if (searchTerm) {
        filteredDeals = filteredDeals.filter(deal => 
            deal.name.toLowerCase().includes(searchTerm) ||
            deal.store.toLowerCase().includes(searchTerm) ||
            deal.category.toLowerCase().includes(searchTerm)
        );
    }

    filteredDeals = applyFilters(filteredDeals);
    displayDeals(filteredDeals);
}

// Apply filters
function applyFilters(deals) {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;

    let filtered = [...deals];

    // Category filter
    if (category) {
        filtered = filtered.filter(deal => deal.category === category);
    }

    // Price filter
    if (priceRange) {
        if (priceRange === '0-50') {
            filtered = filtered.filter(deal => deal.currentPrice <= 50);
        } else if (priceRange === '50-100') {
            filtered = filtered.filter(deal => deal.currentPrice > 50 && deal.currentPrice <= 100);
        } else if (priceRange === '100-200') {
            filtered = filtered.filter(deal => deal.currentPrice > 100 && deal.currentPrice <= 200);
        } else if (priceRange === '200+') {
            filtered = filtered.filter(deal => deal.currentPrice > 200);
        }
    }

    return filtered;
}

// Handle filters
function handleFilters() {
    handleSearch();
}

// Display deals
function displayDeals(deals) {
    resultsGrid.innerHTML = '';

    if (deals.length === 0) {
        resultsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--cream); opacity: 0.8;">
                <p style="font-size: 1.2rem;">No deals found. Try a different search or filter.</p>
            </div>
        `;
        return;
    }

    deals.forEach(deal => {
        const card = createDealCard(deal);
        resultsGrid.appendChild(card);
    });
}

// Create deal card
function createDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card';
    
    const isInComparison = comparisonList.find(d => d.id === deal.id);
    
    card.innerHTML = `
        <div class="deal-image">${deal.icon}</div>
        <div class="deal-info">
            <h3>${deal.name}</h3>
            <div class="deal-store">${deal.store}</div>
            <div class="deal-price">
                <span class="current-price">$${deal.currentPrice.toFixed(2)}</span>
                <span class="original-price">$${deal.originalPrice.toFixed(2)}</span>
                <span class="discount-badge">${deal.discount}% OFF</span>
            </div>
            <div class="deal-actions">
                <button class="btn-compare ${isInComparison ? 'active' : ''}" data-deal-id="${deal.id}">
                    ${isInComparison ? '✓ Added' : '+ Compare'}
                </button>
            </div>
        </div>
    `;

    const compareBtn = card.querySelector('.btn-compare');
    compareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleComparison(deal);
    });

    return card;
}

// Toggle comparison
function toggleComparison(deal) {
    const index = comparisonList.findIndex(d => d.id === deal.id);
    
    if (index > -1) {
        // Remove from comparison
        comparisonList.splice(index, 1);
    } else {
        // Add to comparison (max 4 items)
        if (comparisonList.length >= 4) {
            alert('You can compare up to 4 items at a time.');
            return;
        }
        comparisonList.push(deal);
    }

    updateComparison();
    displayDeals(applyFilters(allDeals));
}

// Update comparison section
function updateComparison() {
    if (comparisonList.length === 0) {
        comparisonSection.style.display = 'none';
        return;
    }

    comparisonSection.style.display = 'block';
    comparisonGrid.innerHTML = '';

    comparisonList.forEach(deal => {
        const card = createComparisonCard(deal);
        comparisonGrid.appendChild(card);
    });
}

// Create comparison card
function createComparisonCard(deal) {
    const card = document.createElement('div');
    card.className = 'comparison-card';
    
    card.innerHTML = `
        <div style="text-align: center; font-size: 3rem; margin-bottom: 10px;">${deal.icon}</div>
        <h3>${deal.name}</h3>
        <div class="comparison-detail">
            <span class="label">Store:</span>
            <span class="value">${deal.store}</span>
        </div>
        <div class="comparison-detail">
            <span class="label">Current Price:</span>
            <span class="value">$${deal.currentPrice.toFixed(2)}</span>
        </div>
        <div class="comparison-detail">
            <span class="label">Original Price:</span>
            <span class="value">$${deal.originalPrice.toFixed(2)}</span>
        </div>
        <div class="comparison-detail">
            <span class="label">Savings:</span>
            <span class="value">${deal.discount}% OFF</span>
        </div>
        <div class="comparison-detail">
            <span class="label">You Save:</span>
            <span class="value">$${(deal.originalPrice - deal.currentPrice).toFixed(2)}</span>
        </div>
    `;

    return card;
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
