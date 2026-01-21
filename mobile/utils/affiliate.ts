// Shared utilities for affiliate link management
// This can be adapted from your web app's affiliate-utils.ts

export const RETAILERS = {
  AMAZON: 'amazon',
  NIKE: 'nike',
  ADIDAS: 'adidas',
  FOOTLOCKER: 'footlocker',
  ZAPPOS: 'zappos',
  FINISH_LINE: 'finish_line',
} as const;

export type Retailer = typeof RETAILERS[keyof typeof RETAILERS];

interface AffiliateConfig {
  baseUrl: string;
  affiliateParam: string;
  affiliateId: string;
}

const AFFILIATE_CONFIG: Record<Retailer, AffiliateConfig> = {
  [RETAILERS.AMAZON]: {
    baseUrl: 'https://amazon.com',
    affiliateParam: 'tag',
    affiliateId: 'stylelink-20', // Replace with your actual Amazon Associate ID
  },
  [RETAILERS.NIKE]: {
    baseUrl: 'https://nike.com',
    affiliateParam: 'affiliate',
    affiliateId: 'stylelink', // Replace with actual Nike affiliate ID
  },
  [RETAILERS.ADIDAS]: {
    baseUrl: 'https://adidas.com',
    affiliateParam: 'affiliate',
    affiliateId: 'stylelink', // Replace with actual Adidas affiliate ID
  },
  [RETAILERS.FOOTLOCKER]: {
    baseUrl: 'https://footlocker.com',
    affiliateParam: 'affiliate',
    affiliateId: 'stylelink', // Replace with actual FootLocker affiliate ID
  },
  [RETAILERS.ZAPPOS]: {
    baseUrl: 'https://zappos.com',
    affiliateParam: 'affiliate',
    affiliateId: 'stylelink', // Replace with actual Zappos affiliate ID
  },
  [RETAILERS.FINISH_LINE]: {
    baseUrl: 'https://finishline.com',
    affiliateParam: 'affiliate',
    affiliateId: 'stylelink', // Replace with actual Finish Line affiliate ID
  },
};

export function generateAffiliateLink(originalUrl: string, retailer: Retailer): string {
  try {
    const config = AFFILIATE_CONFIG[retailer];
    if (!config) {
      return originalUrl;
    }

    const url = new URL(originalUrl);
    url.searchParams.set(config.affiliateParam, config.affiliateId);
    
    return url.toString();
  } catch (error) {
    console.error('Error generating affiliate link:', error);
    return originalUrl;
  }
}

export async function trackClick(productId: string, retailer: Retailer): Promise<void> {
  try {
    // This would call your web app's API endpoint
    // For now, just log it
    console.log('Tracking click:', { productId, retailer });
    
    // TODO: Replace with actual API call to your backend
    // await fetch('/api/affiliate/track-click', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ productId, retailer }),
    // });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}
