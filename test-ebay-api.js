// Quick test script to verify eBay API is working
// Run with: node test-ebay-api.js

require('dotenv').config({ path: '.env.local' });

async function testEbayAPI() {
  const ebayAppId = process.env.EBAY_APP_ID || process.env.NEXT_PUBLIC_EBAY_APP_ID;
  
  if (!ebayAppId || ebayAppId.includes('YourEbayAppID')) {
    console.error('❌ EBAY_APP_ID not configured in .env.local');
    console.log('Please update .env.local with your actual eBay App ID');
    return;
  }
  
  console.log('🔍 Testing eBay API with App ID:', ebayAppId.substring(0, 20) + '...');
  
  try {
    // Use sandbox URL for SBX App IDs, production URL for others
    const isSandbox = ebayAppId.includes('-SBX-');
    const baseUrl = isSandbox 
      ? 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1'
      : 'https://svcs.ebay.com/services/search/FindingService/v1';
    
    console.log(`Using ${isSandbox ? 'SANDBOX' : 'PRODUCTION'} environment`);
    
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': ebayAppId,
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': 'true',
      'keywords': 'nike sneakers',
      'paginationInput.entriesPerPage': '5',
      'itemFilter(0).name': 'Condition',
      'itemFilter(0).value(0)': 'New',
      'itemFilter(1).name': 'LocatedIn',
      'itemFilter(1).value(0)': 'US'
    });

    const url = `${baseUrl}?${params}`;
    console.log('🌐 Making request to eBay API...');
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('❌ eBay API Error:', response.status, response.statusText);
      console.error('Response:', data);
      return;
    }
    
    const searchResult = data.findItemsByKeywordsResponse?.[0];
    
    if (!searchResult || searchResult.ack[0] !== 'Success') {
      console.error('❌ eBay API returned error:', searchResult?.errorMessage?.[0]?.error?.[0]);
      return;
    }
    
    const items = searchResult.searchResult?.[0]?.item || [];
    console.log('✅ eBay API working!');
    console.log(`📦 Found ${items.length} products`);
    
    if (items.length > 0) {
      console.log('\n🔍 Sample product:');
      const item = items[0];
      console.log(`- Title: ${item.title[0]}`);
      console.log(`- Price: $${item.sellingStatus[0].currentPrice[0].__value__}`);
      console.log(`- URL: ${item.viewItemURL[0]}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEbayAPI();
