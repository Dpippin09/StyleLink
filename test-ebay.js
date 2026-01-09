// Test script to verify eBay API integration

async function testEbayAPI() {
  const appId = 'DavidPIP-StyleLin-SBX-fe0404d3f-31b06408';
  const isSandbox = appId.includes('-SBX-');
  const baseUrl = isSandbox 
    ? 'https://svcs.sandbox.ebay.com/services/search/FindingService/v1'
    : 'https://svcs.ebay.com/services/search/FindingService/v1';

  const params = new URLSearchParams({
    'OPERATION-NAME': 'findItemsByKeywords',
    'SERVICE-VERSION': '1.0.0',
    'SECURITY-APPNAME': appId,
    'RESPONSE-DATA-FORMAT': 'JSON',
    'REST-PAYLOAD': 'true',
    'keywords': 'dress',
    'paginationInput.entriesPerPage': '5'
  });

  params.append('itemFilter(0).name', 'Condition');
  params.append('itemFilter(0).value', 'New');

  const url = `${baseUrl}?${params}`;
  
  console.log('Testing eBay API...');
  console.log('URL:', url.substring(0, 100) + '...');
  console.log('Sandbox mode:', isSandbox);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StyleLink/1.0'
      }
    });

    console.log('Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText.substring(0, 500));
      return;
    }

    const data = await response.json();
    console.log('Response keys:', Object.keys(data));
    
    const searchResult = data.findItemsByKeywordsResponse?.[0];
    if (searchResult) {
      console.log('Search result ack:', searchResult.ack?.[0]);
      console.log('Search result keys:', Object.keys(searchResult));
      
      if (searchResult.ack[0] === 'Success') {
        const items = searchResult.searchResult?.[0]?.item || [];
        console.log('Items found:', items.length);
        if (items.length > 0) {
          console.log('First item title:', items[0].title[0]);
          console.log('First item price:', items[0].sellingStatus[0].currentPrice[0]);
        }
      } else {
        const errorMsg = searchResult?.errorMessage?.[0]?.error?.[0]?.message?.[0];
        console.error('eBay API error:', errorMsg);
      }
    } else {
      console.error('No search result found in response');
    }

  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

testEbayAPI();
