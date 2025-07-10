import axios from 'axios';
import { CurrencyPair, HistoricalData, MarketNews } from '@/types/forex';

// API Configuration
const FIXER_API_KEY = process.env.NEXT_PUBLIC_FIXER_API_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

// Major currency pairs
const MAJOR_PAIRS = [
  'EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF',
  'AUD/USD', 'USD/CAD', 'NZD/USD', 'EUR/GBP',
  'EUR/JPY', 'GBP/JPY', 'CHF/JPY', 'EUR/CHF'
];

// Mock data generator for demo purposes
const generateMockRate = (base: number, volatility: number = 0.01): number => {
  const change = (Math.random() - 0.5) * volatility;
  return Math.round((base + base * change) * 100000) / 100000;
};

const generateMockCurrencyPairs = (): CurrencyPair[] => {
  const basePrices: { [key: string]: number } = {
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2650,
    'USD/JPY': 149.85,
    'USD/CHF': 0.8950,
    'AUD/USD': 0.6580,
    'USD/CAD': 1.3780,
    'NZD/USD': 0.5950,
    'EUR/GBP': 0.8580,
    'EUR/JPY': 162.45,
    'GBP/JPY': 189.25,
    'CHF/JPY': 167.45,
    'EUR/CHF': 0.9720,
  };

  return MAJOR_PAIRS.map(symbol => {
    const [base, quote] = symbol.split('/');
    const basePrice = basePrices[symbol] || 1.0000;
    const rate = generateMockRate(basePrice);
    const previousRate = generateMockRate(basePrice, 0.005);
    const change = rate - previousRate;
    const changePercent = (change / previousRate) * 100;
    const spread = rate * 0.0001; // 1 pip spread
    
    return {
      symbol,
      base,
      quote,
      rate,
      change,
      changePercent,
      bid: rate - spread / 2,
      ask: rate + spread / 2,
      spread,
      timestamp: new Date().toISOString(),
    };
  });
};

const generateMockHistoricalData = (symbol: string, days: number = 30): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const basePrices: { [key: string]: number } = {
    'EUR/USD': 1.0850,
    'GBP/USD': 1.2650,
    'USD/JPY': 149.85,
    'USD/CHF': 0.8950,
  };
  
  let currentPrice = basePrices[symbol] || 1.0000;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const open = currentPrice;
    const volatility = 0.02;
    const high = generateMockRate(open, volatility / 2);
    const low = generateMockRate(open, -volatility / 2);
    const close = generateMockRate(open, volatility / 4);
    
    data.push({
      timestamp: date.toISOString(),
      open,
      high: Math.max(open, high, close),
      low: Math.min(open, low, close),
      close,
      volume: Math.floor(Math.random() * 1000000) + 500000,
    });
    
    currentPrice = close;
  }
  
  return data;
};

const generateMockNews = (): MarketNews[] => {
  const mockNews = [
    {
      title: "Federal Reserve Signals Potential Rate Cuts in 2024",
      summary: "Fed officials hint at possible monetary policy easing as inflation shows signs of cooling.",
      impact: 'HIGH' as const,
      currencies: ['USD'],
      source: "Reuters"
    },
    {
      title: "ECB Maintains Hawkish Stance on Inflation",
      summary: "European Central Bank maintains aggressive approach to combat persistent inflation.",
      impact: 'HIGH' as const,
      currencies: ['EUR'],
      source: "Bloomberg"
    },
    {
      title: "UK GDP Growth Exceeds Expectations",
      summary: "British economy shows resilience with stronger than expected quarterly growth.",
      impact: 'MEDIUM' as const,
      currencies: ['GBP'],
      source: "Financial Times"
    },
    {
      title: "Japanese Yen Weakens on BoJ Policy Speculation",
      summary: "Speculation about Bank of Japan policy changes drives yen volatility.",
      impact: 'MEDIUM' as const,
      currencies: ['JPY'],
      source: "CNBC"
    },
    {
      title: "Oil Prices Surge Amid Geopolitical Tensions",
      summary: "Rising oil prices impact commodity currencies and inflation expectations.",
      impact: 'LOW' as const,
      currencies: ['CAD', 'AUD'],
      source: "MarketWatch"
    }
  ];

  return mockNews.map((news, index) => ({
    id: `news-${index}`,
    ...news,
    timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Spread over last few hours
  }));
};

// API Functions
export const fetchCurrencyPairs = async (): Promise<CurrencyPair[]> => {
  try {
    if (FIXER_API_KEY) {
      // Try to fetch from Fixer.io API
      const response = await axios.get(`https://api.fixer.io/v1/latest`, {
        params: {
          access_key: FIXER_API_KEY,
          symbols: 'USD,EUR,GBP,JPY,CHF,AUD,CAD,NZD',
        },
      });
      
      if (response.data && response.data.rates) {
        // Convert Fixer.io data to our format
        const rates = response.data.rates;
        // Implementation would convert the rates to currency pairs
        // For now, fall back to mock data
      }
    }
    
    // Fallback to mock data
    return generateMockCurrencyPairs();
  } catch (error) {
    console.warn('Failed to fetch real forex data, using mock data:', error);
    return generateMockCurrencyPairs();
  }
};

export const fetchHistoricalData = async (
  symbol: string,
  timeframe: string = '1d',
  limit: number = 100
): Promise<HistoricalData[]> => {
  try {
    if (ALPHA_VANTAGE_API_KEY) {
      // Try to fetch from Alpha Vantage API
      const [base, quote] = symbol.split('/');
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'FX_DAILY',
          from_symbol: base,
          to_symbol: quote,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      
      if (response.data && response.data['Time Series (Daily)']) {
        const timeSeries = response.data['Time Series (Daily)'];
        const data: HistoricalData[] = Object.entries(timeSeries)
          .slice(0, limit)
          .map(([date, values]: [string, any]) => ({
            timestamp: new Date(date).toISOString(),
            open: parseFloat(values['1. open']),
            high: parseFloat(values['2. high']),
            low: parseFloat(values['3. low']),
            close: parseFloat(values['4. close']),
          }))
          .reverse();
        
        return data;
      }
    }
    
    // Fallback to mock data
    return generateMockHistoricalData(symbol, Math.min(limit, 100));
  } catch (error) {
    console.warn('Failed to fetch real historical data, using mock data:', error);
    return generateMockHistoricalData(symbol, Math.min(limit, 100));
  }
};

export const fetchMarketNews = async (): Promise<MarketNews[]> => {
  try {
    if (NEWS_API_KEY) {
      // Try to fetch from News API
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: 'forex OR currency OR "central bank" OR "interest rates"',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 10,
          apiKey: NEWS_API_KEY,
        },
      });
      
      if (response.data && response.data.articles) {
        const articles = response.data.articles;
        return articles.map((article: any, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          summary: article.description || article.title,
          source: article.source.name,
          timestamp: article.publishedAt,
          impact: 'MEDIUM' as const, // Would need AI/ML to determine actual impact
          currencies: ['USD', 'EUR'], // Would need NLP to extract relevant currencies
        }));
      }
    }
    
    // Fallback to mock data
    return generateMockNews();
  } catch (error) {
    console.warn('Failed to fetch real news data, using mock data:', error);
    return generateMockNews();
  }
};

// Real-time data simulation
export const startRealTimeUpdates = (
  onUpdate: (pairs: CurrencyPair[]) => void,
  interval: number = 5000
): () => void => {
  const updateInterval = setInterval(async () => {
    const pairs = await fetchCurrencyPairs();
    onUpdate(pairs);
  }, interval);
  
  return () => clearInterval(updateInterval);
};