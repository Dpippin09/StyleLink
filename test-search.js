// Simple test script to verify search functionality
const fetch = require('node-fetch');

async function testSearch() {
  try {
    const response = await fetch('http://localhost:3000/api/search/external', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'laptop',
        category: 'electronics'
      })
    });
    
    const data = await response.json();
    console.log('Search Results:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testSearch();
