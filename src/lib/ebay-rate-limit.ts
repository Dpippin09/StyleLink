// Rate limiting utility for eBay API calls
class EbayRateLimit {
  private static instance: EbayRateLimit;
  private lastCallTime: number = 0;
  private callCount: number = 0;
  private dailyLimit: number = 500; // Much more conservative - only 500 calls per day
  private minInterval: number = 2000; // 2 seconds between calls (very conservative)
  private dailyResetTime: number = 0;

  private constructor() {
    // Reset daily counter every 24 hours
    const now = Date.now();
    // Use memory-based tracking instead of localStorage (which doesn't exist on server)
    if (this.dailyResetTime === 0 || now - this.dailyResetTime > 24 * 60 * 60 * 1000) {
      this.resetDailyCount();
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
    // Remove localStorage usage on server side
  }

  private resetDailyCount(): void {
    this.callCount = 0;
    this.dailyResetTime = Date.now();
    // Remove localStorage usage on server side
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
