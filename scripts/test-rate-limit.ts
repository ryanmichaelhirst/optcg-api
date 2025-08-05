/**
 * Simple script to test the rate limiter
 * Makes 101 requests to the production API endpoint
 * Should get rate limited on the 101st request
 */

const API_BASE_URL = 'https://optcg-api.ryanmichaelhirst.us';
const ENDPOINT = '/api/v1/cards';

async function testRateLimit() {
  console.log('🧪 Testing rate limiter...');
  console.log(`📡 Making requests to: ${API_BASE_URL}${ENDPOINT}`);
  console.log('');

  let successCount = 0;
  let errorCount = 0;
  let rateLimitHit = false;

  // Make 110 requests
  for (let i = 1; i <= 110; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINT}?page=1&per_page=1`);
      
      if (response.ok) {
        successCount++;
        console.log(`✅ Request ${i}: Success`);
      } else {
        errorCount++;
        console.log(`❌ Request ${i}: HTTP ${response.status} - ${response.statusText}`);
        
        if (response.status === 429) {
          rateLimitHit = true;
          console.log('🎯 RATE LIMIT HIT!');
          console.log('📊 Rate limit headers:');
          console.log(`   X-RateLimit-Limit: ${response.headers.get('X-RateLimit-Limit')}`);
          console.log(`   X-RateLimit-Remaining: ${response.headers.get('X-RateLimit-Remaining')}`);
          console.log(`   X-RateLimit-Reset: ${response.headers.get('X-RateLimit-Reset')}`);
          console.log(`   Retry-After: ${response.headers.get('Retry-After')} seconds`);
        }
      }
    } catch (error) {
      errorCount++;
      console.log(`💥 Request ${i}: Error - ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        rateLimitHit = true;
        console.log('🎯 RATE LIMIT HIT!');
      }
    }

    // Small delay between requests to avoid overwhelming the server
    if (i < 101) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  console.log('');
  console.log('📊 Test Results:');
  console.log(`   Total requests: 101`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Failed: ${errorCount}`);
  console.log(`   Rate limit hit: ${rateLimitHit ? 'YES' : 'NO'}`);

  if (rateLimitHit) {
    console.log('');
    console.log('🎉 Rate limit working! ✅');
  } else {
    console.log('');
    console.log('⚠️  Rate limit not triggered. This might mean:');
    console.log('   - Rate limiter is not active in production');
    console.log('   - Rate limit is higher than 100 requests/minute');
    console.log('   - You\'re making requests from a whitelisted domain');
  }
}

// Run the test
testRateLimit().catch(console.error); 