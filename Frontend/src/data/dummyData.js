export const dummyReviews = [
  {
    id: '1',
    text: 'Absolutely love this product! The quality is outstanding and it exceeded my expectations.',
    sentiment: 'positive',
    confidence: 0.95,
    keywords: ['love', 'quality', 'outstanding', 'exceeded'],
  },
  {
    id: '2',
    text: 'Terrible experience. The product broke after just one week of use.',
    sentiment: 'negative',
    confidence: 0.92,
    keywords: ['terrible', 'broke', 'week'],
  },
  {
    id: '3',
    text: 'It works as expected. Nothing special but does the job.',
    sentiment: 'neutral',
    confidence: 0.78,
    keywords: ['works', 'expected', 'job'],
  },
  {
    id: '4',
    text: 'Great value for money. Fast shipping and excellent customer service!',
    sentiment: 'positive',
    confidence: 0.91,
    keywords: ['great', 'value', 'fast', 'excellent'],
  },
  {
    id: '5',
    text: 'Not happy with the purchase. Quality is poor and customer support was unhelpful.',
    sentiment: 'negative',
    confidence: 0.88,
    keywords: ['not happy', 'poor', 'unhelpful'],
  },
];

export const dummyAnalysisResult = {
  id: '1',
  productName: 'Wireless Bluetooth Headphones',
  productLink: 'https://amazon.com/product/123',
  overallSentiment: 'positive',
  sentimentScore: 72,
  totalReviews: 156,
  positiveCount: 98,
  negativeCount: 31,
  neutralCount: 27,
  topPositiveKeywords: ['quality', 'comfortable', 'sound', 'battery', 'value'],
  topNegativeKeywords: ['broke', 'poor', 'cheap', 'uncomfortable', 'short'],
  reviews: dummyReviews,
  analyzedAt: new Date(),
};

export const dummyHistory = [
  {
    id: '1',
    productName: 'Wireless Bluetooth Headphones',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 30),
    overallSentiment: 'positive',
    sentimentScore: 72,
  },
  {
    id: '2',
    productName: 'Smart Watch Pro',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    overallSentiment: 'mixed',
    sentimentScore: 58,
  },
  {
    id: '3',
    productName: 'Portable Power Bank',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    overallSentiment: 'positive',
    sentimentScore: 85,
  },
  {
    id: '4',
    productName: 'USB-C Hub Adapter',
    analyzedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    overallSentiment: 'negative',
    sentimentScore: 32,
  },
];

export const dummySavedProducts = [
  {
    id: '1',
    name: 'Sony WH-1000XM5',
    link: 'https://amazon.com/product/sony-headphones',
    lastAnalyzed: new Date(Date.now() - 1000 * 60 * 60 * 24),
    sentimentScore: 89,
    overallSentiment: 'positive',
  },
  {
    id: '2',
    name: 'Apple AirPods Pro',
    link: 'https://amazon.com/product/airpods-pro',
    lastAnalyzed: new Date(Date.now() - 1000 * 60 * 60 * 72),
    sentimentScore: 82,
    overallSentiment: 'positive',
  },
  {
    id: '3',
    name: 'Samsung Galaxy Buds',
    lastAnalyzed: new Date(Date.now() - 1000 * 60 * 60 * 120),
    sentimentScore: 65,
    overallSentiment: 'mixed',
  },
];