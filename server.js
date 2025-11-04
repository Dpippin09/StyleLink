const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS: In development mode, allow all origins for easier testing
// In production, restrict to specific allowed origins via environment variable
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
    : '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(express.static('public'));

// Mock data - Fashion deals from various stores across the country
const fashionDeals = [
  {
    id: 1,
    name: "Classic Denim Jacket",
    category: "Outerwear",
    brand: "Levi's",
    originalPrice: 89.99,
    salePrice: 54.99,
    discount: 39,
    store: "Macy's",
    location: "New York, NY",
    imageUrl: "https://via.placeholder.com/300x400?text=Denim+Jacket",
    description: "Timeless denim jacket with button closure",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    category: "Outerwear",
    brand: "Levi's",
    originalPrice: 89.99,
    salePrice: 49.99,
    discount: 44,
    store: "Nordstrom",
    location: "Seattle, WA",
    imageUrl: "https://via.placeholder.com/300x400?text=Denim+Jacket",
    description: "Timeless denim jacket with button closure",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 3,
    name: "Running Sneakers",
    category: "Footwear",
    brand: "Nike",
    originalPrice: 120.00,
    salePrice: 84.99,
    discount: 29,
    store: "Foot Locker",
    location: "Los Angeles, CA",
    imageUrl: "https://via.placeholder.com/300x400?text=Running+Sneakers",
    description: "Lightweight running shoes with cushioned sole",
    sizes: ["7", "8", "9", "10", "11"],
    inStock: true
  },
  {
    id: 4,
    name: "Running Sneakers",
    category: "Footwear",
    brand: "Nike",
    originalPrice: 120.00,
    salePrice: 79.99,
    discount: 33,
    store: "Dick's Sporting Goods",
    location: "Chicago, IL",
    imageUrl: "https://via.placeholder.com/300x400?text=Running+Sneakers",
    description: "Lightweight running shoes with cushioned sole",
    sizes: ["7", "8", "9", "10", "11"],
    inStock: true
  },
  {
    id: 5,
    name: "Leather Handbag",
    category: "Accessories",
    brand: "Coach",
    originalPrice: 350.00,
    salePrice: 210.00,
    discount: 40,
    store: "Bloomingdale's",
    location: "Miami, FL",
    imageUrl: "https://via.placeholder.com/300x400?text=Leather+Handbag",
    description: "Premium leather handbag with gold hardware",
    sizes: ["One Size"],
    inStock: true
  },
  {
    id: 6,
    name: "Leather Handbag",
    category: "Accessories",
    brand: "Coach",
    originalPrice: 350.00,
    salePrice: 199.99,
    discount: 43,
    store: "Saks Fifth Avenue",
    location: "Dallas, TX",
    imageUrl: "https://via.placeholder.com/300x400?text=Leather+Handbag",
    description: "Premium leather handbag with gold hardware",
    sizes: ["One Size"],
    inStock: false
  },
  {
    id: 7,
    name: "Cotton T-Shirt Pack",
    category: "Tops",
    brand: "Hanes",
    originalPrice: 24.99,
    salePrice: 14.99,
    discount: 40,
    store: "Target",
    location: "Minneapolis, MN",
    imageUrl: "https://via.placeholder.com/300x400?text=T-Shirt+Pack",
    description: "Pack of 3 classic cotton t-shirts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  {
    id: 8,
    name: "Slim Fit Chinos",
    category: "Pants",
    brand: "Dockers",
    originalPrice: 68.00,
    salePrice: 40.80,
    discount: 40,
    store: "JCPenney",
    location: "Phoenix, AZ",
    imageUrl: "https://via.placeholder.com/300x400?text=Chinos",
    description: "Comfortable slim fit chino pants",
    sizes: ["30", "32", "34", "36", "38"],
    inStock: true
  },
  {
    id: 9,
    name: "Slim Fit Chinos",
    category: "Pants",
    brand: "Dockers",
    originalPrice: 68.00,
    salePrice: 37.99,
    discount: 44,
    store: "Kohl's",
    location: "Denver, CO",
    imageUrl: "https://via.placeholder.com/300x400?text=Chinos",
    description: "Comfortable slim fit chino pants",
    sizes: ["30", "32", "34", "36", "38"],
    inStock: true
  },
  {
    id: 10,
    name: "Wool Blend Sweater",
    category: "Tops",
    brand: "J.Crew",
    originalPrice: 98.00,
    salePrice: 58.80,
    discount: 40,
    store: "J.Crew Store",
    location: "Boston, MA",
    imageUrl: "https://via.placeholder.com/300x400?text=Sweater",
    description: "Cozy wool blend crewneck sweater",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: 11,
    name: "Summer Dress",
    category: "Dresses",
    brand: "H&M",
    originalPrice: 49.99,
    salePrice: 29.99,
    discount: 40,
    store: "H&M",
    location: "Atlanta, GA",
    imageUrl: "https://via.placeholder.com/300x400?text=Summer+Dress",
    description: "Floral print summer dress",
    sizes: ["XS", "S", "M", "L"],
    inStock: true
  },
  {
    id: 12,
    name: "Leather Belt",
    category: "Accessories",
    brand: "Fossil",
    originalPrice: 45.00,
    salePrice: 22.50,
    discount: 50,
    store: "Macy's",
    location: "San Francisco, CA",
    imageUrl: "https://via.placeholder.com/300x400?text=Leather+Belt",
    description: "Genuine leather belt with metal buckle",
    sizes: ["32", "34", "36", "38", "40"],
    inStock: true
  }
];

// API Routes

// Get all deals
app.get('/api/deals', (req, res) => {
  res.json(fashionDeals);
});

// Search deals by query
app.get('/api/deals/search', (req, res) => {
  const { q, category, minDiscount, maxPrice, store, location } = req.query;
  
  let filteredDeals = [...fashionDeals];
  
  // Search by query (name or brand)
  if (q) {
    const query = q.toLowerCase();
    filteredDeals = filteredDeals.filter(deal => 
      deal.name.toLowerCase().includes(query) || 
      deal.brand.toLowerCase().includes(query) ||
      deal.description.toLowerCase().includes(query)
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    filteredDeals = filteredDeals.filter(deal => 
      deal.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by minimum discount
  if (minDiscount) {
    const minDiscountValue = parseInt(minDiscount, 10);
    if (!isNaN(minDiscountValue) && minDiscountValue >= 0) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.discount >= minDiscountValue
      );
    }
  }
  
  // Filter by maximum price
  if (maxPrice) {
    const maxPriceValue = parseFloat(maxPrice);
    if (!isNaN(maxPriceValue) && maxPriceValue > 0) {
      filteredDeals = filteredDeals.filter(deal => 
        deal.salePrice <= maxPriceValue
      );
    }
  }
  
  // Filter by store
  if (store && store !== 'all') {
    filteredDeals = filteredDeals.filter(deal => 
      deal.store.toLowerCase().includes(store.toLowerCase())
    );
  }
  
  // Filter by location
  if (location) {
    filteredDeals = filteredDeals.filter(deal => 
      deal.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  res.json(filteredDeals);
});

// Get deal by ID
app.get('/api/deals/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  // Validate that id is a valid number
  if (isNaN(id) || id < 1) {
    return res.status(400).json({ error: 'Invalid deal ID' });
  }
  
  const deal = fashionDeals.find(d => d.id === id);
  if (deal) {
    res.json(deal);
  } else {
    res.status(404).json({ error: 'Deal not found' });
  }
});

// Compare deals for the same item
app.get('/api/deals/compare/:name', (req, res) => {
  try {
    const itemName = decodeURIComponent(req.params.name);
    const trimmedName = itemName.trim();
    
    // Validate item name
    if (!trimmedName || trimmedName.length === 0 || trimmedName.length > 200) {
      return res.status(400).json({ error: 'Invalid item name' });
    }
    
    const similarDeals = fashionDeals.filter(deal => 
      deal.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    // Sort by price (best deal first)
    similarDeals.sort((a, b) => a.salePrice - b.salePrice);
    
    res.json(similarDeals);
  } catch (error) {
    res.status(400).json({ error: 'Invalid item name parameter' });
  }
});

// Get unique categories
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(fashionDeals.map(deal => deal.category))];
  res.json(categories);
});

// Get unique stores
app.get('/api/stores', (req, res) => {
  const stores = [...new Set(fashionDeals.map(deal => deal.store))];
  res.json(stores);
});

// Get unique locations
app.get('/api/locations', (req, res) => {
  const locations = [...new Set(fashionDeals.map(deal => deal.location))];
  res.json(locations);
});

// Error handling middleware for malformed URIs
app.use((err, req, res, next) => {
  if (err instanceof URIError) {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
