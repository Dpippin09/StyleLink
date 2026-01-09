// Rate limiting utility for eBay API calls
class EbayRateLimit {
  private static instance: EbayRateLimit;
  private lastCallTime: number = 0;
  private callCount: number = 0;
  private dailyLimit: number = 4000; // Stay under 5000 daily limit
  private minInterval: number = 200; // 200ms = max 5 calls/second (half of eBay's 10/sec limit)
  private dailyResetTime: number = 0;

  private constructor() {
    // Reset daily counter every 24 hours
    const now = Date.now();
    const lastReset = localStorage.getItem('ebay_last_reset');
    if (!lastReset || now - parseInt(lastReset) > 24 * 60 * 60 * 1000) {
      this.resetDailyCount();
    } else {
      this.callCount = parseInt(localStorage.getItem('ebay_call_count') || '0');
    }
  }

  static getInstance(): EbayRateLimit {
    if (!EbayRateLimit.instance) {
      EbayRateLimit.instance = new EbayRateLimit();
    }
    return EbayRateLimit.instance;
  }

  async canMakeCall(): Promise<boolean> {
    const now = Date.now();
    
    // Check daily limit
    if (this.callCount >= this.dailyLimit) {
      console.warn('eBay API daily limit reached. Try again tomorrow.');
      return false;
    }

    // Check rate limit (time between calls)
    const timeSinceLastCall = now - this.lastCallTime;
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`Rate limiting: waiting ${waitTime}ms before next eBay API call`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    return true;
  }

  recordCall(): void {
    this.lastCallTime = Date.now();
    this.callCount++;
    localStorage.setItem('ebay_call_count', this.callCount.toString());
  }

  private resetDailyCount(): void {
    this.callCount = 0;
    this.dailyResetTime = Date.now();
    localStorage.setItem('ebay_call_count', '0');
    localStorage.setItem('ebay_last_reset', this.dailyResetTime.toString());
  }

  getStats(): { callsToday: number; dailyLimit: number; canCall: boolean } {
    return {
      callsToday: this.callCount,
      dailyLimit: this.dailyLimit,
      canCall: this.callCount < this.dailyLimit
    };
  }
}

export default EbayRateLimit;
