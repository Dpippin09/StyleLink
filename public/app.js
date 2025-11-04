// API Base URL - configurable for different environments
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? `${window.location.protocol}//${window.location.host}/api`
    : '/api';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');
const storeFilter = document.getElementById('storeFilter');
const locationFilter = document.getElementById('locationFilter');
const minDiscountFilter = document.getElementById('minDiscountFilter');
const maxPriceFilter = document.getElementById('maxPriceFilter');
const applyFiltersButton = document.getElementById('applyFiltersButton');
const clearFiltersButton = document.getElementById('clearFiltersButton');
const dealsGrid = document.getElementById('dealsGrid');
const resultsSummary = document.getElementById('resultsSummary');
const resultsCount = document.getElementById('resultsCount');
const loadingIndicator = document.getElementById('loadingIndicator');
const noResults = document.getElementById('noResults');
const comparisonModal = document.getElementById('comparisonModal');
const comparisonTitle = document.getElementById('comparisonTitle');
const comparisonGrid = document.getElementById('comparisonGrid');
const closeModal = document.querySelector('.close');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

// Initialize the app
async function init() {
    await loadCategories();
    await loadStores();
    await loadDeals();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    applyFiltersButton.addEventListener('click', handleSearch);
    clearFiltersButton.addEventListener('click', clearFilters);
    closeModal.addEventListener('click', () => {
        comparisonModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === comparisonModal) {
            comparisonModal.style.display = 'none';
        }
    });
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load stores from API
async function loadStores() {
    try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        const stores = await response.json();
        stores.forEach(store => {
            const option = document.createElement('option');
            option.value = store;
            option.textContent = store;
            storeFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading stores:', error);
    }
}

// Load deals with filters
async function loadDeals() {
    showLoading();
    hideNoResults();
    
    try {
        const queryParams = buildQueryParams();
        const url = queryParams 
            ? `${API_BASE_URL}/deals/search?${queryParams}` 
            : `${API_BASE_URL}/deals`;
        
        const response = await fetch(url);
        const deals = await response.json();
        
        displayDeals(deals);
        updateResultsSummary(deals.length);
    } catch (error) {
        console.error('Error loading deals:', error);
        showNoResults();
    } finally {
        hideLoading();
    }
}

// Build query parameters from filters
function buildQueryParams() {
    const params = new URLSearchParams();
    
    const query = searchInput.value.trim();
    if (query) params.append('q', query);
    
    const category = categoryFilter.value;
    if (category !== 'all') params.append('category', category);
    
    const store = storeFilter.value;
    if (store !== 'all') params.append('store', store);
    
    const location = locationFilter.value.trim();
    if (location) params.append('location', location);
    
    const minDiscount = minDiscountFilter.value;
    if (minDiscount) params.append('minDiscount', minDiscount);
    
    const maxPrice = maxPriceFilter.value;
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    return params.toString();
}

// Display deals in the grid
function displayDeals(deals) {
    dealsGrid.innerHTML = '';
    
    if (deals.length === 0) {
        showNoResults();
        return;
    }
    
    deals.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

// Create a deal card element
function createDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card';
    
    // Validate numeric values
    const prices = validateDealPrices(deal);
    
    card.innerHTML = `
        <img src="${escapeHtml(deal.imageUrl)}" alt="${escapeHtml(deal.name)}">
        <div class="deal-badge">${escapeHtml(prices.discount.toString())}% OFF</div>
        <div class="deal-content">
            <div class="deal-category">${escapeHtml(deal.category)}</div>
            <h3 class="deal-name">${escapeHtml(deal.name)}</h3>
            <p class="deal-brand">${escapeHtml(deal.brand)}</p>
            <p class="deal-description">${escapeHtml(deal.description)}</p>
            <div class="deal-prices">
                <span class="sale-price">$${prices.salePrice.toFixed(2)}</span>
                <span class="original-price">$${prices.originalPrice.toFixed(2)}</span>
            </div>
            <div class="deal-store">
                <div>
                    <div class="store-name">${escapeHtml(deal.store)}</div>
                    <div class="store-location">📍 ${escapeHtml(deal.location)}</div>
                </div>
            </div>
            <div class="stock-status ${deal.inStock ? 'in-stock' : 'out-of-stock'}">
                ${deal.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </div>
            <button class="btn btn-compare">
                Compare Prices
            </button>
        </div>
    `;
    
    // Add event listener for compare button and set data attribute safely
    const compareBtn = card.querySelector('.btn-compare');
    compareBtn.setAttribute('data-deal-name', deal.name);
    compareBtn.addEventListener('click', () => {
        compareDeals(deal.name);
    });
    
    return card;
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper function to validate and extract deal prices
function validateDealPrices(deal) {
    return {
        salePrice: typeof deal.salePrice === 'number' ? deal.salePrice : 0,
        originalPrice: typeof deal.originalPrice === 'number' ? deal.originalPrice : 0,
        discount: typeof deal.discount === 'number' ? deal.discount : 0
    };
}

// Compare deals for the same item
async function compareDeals(itemName) {
    try {
        const response = await fetch(`${API_BASE_URL}/deals/compare/${encodeURIComponent(itemName)}`);
        const deals = await response.json();
        
        if (deals.length === 0) {
            showNotification('No comparison data available for this item.');
            return;
        }
        
        displayComparison(deals, itemName);
    } catch (error) {
        console.error('Error comparing deals:', error);
        showNotification('Failed to load comparison data.');
    }
}

// Display comparison modal
function displayComparison(deals, itemName) {
    comparisonTitle.textContent = `Compare Deals: ${itemName}`;
    comparisonGrid.innerHTML = '';
    
    // Verify deals are sorted by price (ascending)
    const sortedDeals = [...deals].sort((a, b) => {
        const priceA = typeof a.salePrice === 'number' ? a.salePrice : 0;
        const priceB = typeof b.salePrice === 'number' ? b.salePrice : 0;
        return priceA - priceB;
    });
    
    sortedDeals.forEach((deal, index) => {
        const card = document.createElement('div');
        card.className = index === 0 ? 'comparison-card best-deal' : 'comparison-card';
        
        // Validate numeric values
        const prices = validateDealPrices(deal);
        
        // Calculate savings: compare best price (first, lowest) with worst price (last, highest)
        const bestPrice = validateDealPrices(sortedDeals[0]).salePrice;
        const worstPrice = validateDealPrices(sortedDeals[sortedDeals.length - 1]).salePrice;
        const savings = worstPrice - bestPrice;
        
        // Validate sizes array
        const sizesArray = Array.isArray(deal.sizes) ? deal.sizes : [];
        
        card.innerHTML = `
            ${index === 0 ? '<div class="best-deal-badge">🏆 Best Deal</div>' : ''}
            <h4>${escapeHtml(deal.store)}</h4>
            <p class="store-location">📍 ${escapeHtml(deal.location)}</p>
            <div class="deal-prices" style="margin: 1rem 0;">
                <span class="sale-price">$${prices.salePrice.toFixed(2)}</span>
                <span class="original-price">$${prices.originalPrice.toFixed(2)}</span>
            </div>
            <p style="font-weight: bold; color: #ff4757; margin-bottom: 0.5rem;">
                ${escapeHtml(prices.discount.toString())}% OFF
            </p>
            <p style="margin-bottom: 0.5rem;">
                <strong>Sizes:</strong> ${sizesArray.map(s => escapeHtml(String(s))).join(', ')}
            </p>
            <p class="stock-status ${deal.inStock ? 'in-stock' : 'out-of-stock'}">
                ${deal.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </p>
            ${index === 0 && savings > 0 ? `<p style="margin-top: 0.5rem; color: #28a745; font-weight: 600;">
                You save $${savings.toFixed(2)} vs highest price!
            </p>` : ''}
        `;
        
        comparisonGrid.appendChild(card);
    });
    
    comparisonModal.style.display = 'block';
}

// Handle search
function handleSearch() {
    loadDeals();
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    categoryFilter.value = 'all';
    storeFilter.value = 'all';
    locationFilter.value = '';
    minDiscountFilter.value = '';
    maxPriceFilter.value = '';
    loadDeals();
}

// Update results summary
function updateResultsSummary(count) {
    resultsCount.textContent = count;
    resultsSummary.style.display = count > 0 ? 'block' : 'none';
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'block';
    dealsGrid.innerHTML = '';
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Show no results message
function showNoResults() {
    noResults.style.display = 'block';
    updateResultsSummary(0);
}

// Hide no results message
function hideNoResults() {
    noResults.style.display = 'none';
}

// Show notification
function showNotification(message) {
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
