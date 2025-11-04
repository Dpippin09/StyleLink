# StyleLink 🛍️

A comprehensive fashion deals search and comparison app that helps users find the best deals on fashion items from stores all over the country.

## Features

- **Search Fashion Items**: Search for any fashion item by name, brand, or description
- **Compare Prices**: Compare prices for the same item across multiple stores nationwide
- **Advanced Filters**: Filter by category, store, location, discount percentage, and price range
- **Store Locations**: See deals from stores across different cities and states
- **Real-time Availability**: Check stock status for items
- **Best Deal Highlighting**: Automatically identifies and highlights the best deals
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Categories Supported

- Outerwear (jackets, coats)
- Footwear (sneakers, shoes)
- Accessories (handbags, belts)
- Tops (t-shirts, sweaters)
- Pants (chinos, jeans)
- Dresses

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **API**: RESTful API for deal management and search

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/Dpippin09/StyleLink.git
cd StyleLink
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3001
```

## API Endpoints

### Get All Deals
```
GET /api/deals
```

### Search Deals
```
GET /api/deals/search?q={query}&category={category}&minDiscount={discount}&maxPrice={price}&store={store}&location={location}
```

### Get Deal by ID
```
GET /api/deals/:id
```

### Compare Deals
```
GET /api/deals/compare/:name
```

### Get Categories
```
GET /api/categories
```

### Get Stores
```
GET /api/stores
```

### Get Locations
```
GET /api/locations
```

## Usage Examples

### Search for Items
- Type "jeans" in the search bar to find all denim deals
- Type "Nike" to find all Nike brand products
- Use the category filter to browse specific types of items

### Compare Prices
- Click "Compare Prices" on any deal card
- View all available deals for that item across different stores
- See which store offers the best price
- Check availability and location information

### Apply Filters
- Set minimum discount percentage (e.g., 40% or more)
- Set maximum price limit
- Filter by specific store or location
- Combine multiple filters for precise results

## Project Structure

```
StyleLink/
├── server.js           # Express server and API routes
├── package.json        # Project dependencies and scripts
├── public/             # Frontend files
│   ├── index.html     # Main HTML page
│   ├── styles.css     # CSS styling
│   └── app.js         # Frontend JavaScript
└── README.md          # Project documentation
```

## Future Enhancements

- Integration with real store APIs
- User accounts and saved searches
- Price drop notifications
- Review and rating system
- Advanced sorting options
- Mobile app version
- More fashion categories

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
