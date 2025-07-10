import { HistoricalData, TechnicalIndicator } from '@/types/forex';

export const formatCurrency = (amount: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

export const calculatePipValue = (
  symbol: string,
  lotSize: number,
  accountCurrency: string = 'USD'
): number => {
  // Simplified pip value calculation for major pairs
  const majorPairs = ['EUR/USD', 'GBP/USD', 'AUD/USD', 'NZD/USD'];
  const jpyPairs = ['USD/JPY', 'EUR/JPY', 'GBP/JPY'];
  
  if (majorPairs.includes(symbol)) {
    return 10 * lotSize; // $10 per pip for standard lot
  } else if (jpyPairs.includes(symbol)) {
    return 1000 * lotSize; // Different calculation for JPY pairs
  } else {
    return 10 * lotSize; // Default
  }
};

export const calculatePositionSize = (
  accountBalance: number,
  riskPercent: number,
  stopLossPips: number,
  pipValue: number
): number => {
  const riskAmount = accountBalance * (riskPercent / 100);
  const positionSize = riskAmount / (stopLossPips * pipValue);
  return Math.round(positionSize * 100) / 100;
};

export const calculateSpread = (bid: number, ask: number): number => {
  return Math.round((ask - bid) * 10000) / 10000;
};

export const calculatePnL = (
  type: 'BUY' | 'SELL',
  entryPrice: number,
  currentPrice: number,
  lotSize: number,
  symbol: string
): { pnl: number; pnlPercent: number } => {
  const pipValue = calculatePipValue(symbol, lotSize);
  let pips: number;
  
  if (type === 'BUY') {
    pips = (currentPrice - entryPrice) * 10000;
  } else {
    pips = (entryPrice - currentPrice) * 10000;
  }
  
  const pnl = (pips * pipValue) / 10000;
  const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;
  
  return { pnl, pnlPercent };
};

// Technical Analysis Functions
export const calculateSMA = (data: HistoricalData[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0);
    sma.push(sum / period);
  }
  return sma;
};

export const calculateEMA = (data: HistoricalData[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  const firstSMA = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period;
  ema.push(firstSMA);
  
  for (let i = period; i < data.length; i++) {
    const currentEMA = (data[i].close * multiplier) + (ema[ema.length - 1] * (1 - multiplier));
    ema.push(currentEMA);
  }
  
  return ema;
};

export const calculateRSI = (data: HistoricalData[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0) / period;
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0) / period;
    
    const rs = avgGain / avgLoss;
    const rsiValue = 100 - (100 / (1 + rs));
    rsi.push(rsiValue);
  }
  
  return rsi;
};

export const calculateMACD = (data: HistoricalData[]): { macd: number[]; signal: number[]; histogram: number[] } => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  const macd: number[] = [];
  for (let i = 0; i < Math.min(ema12.length, ema26.length); i++) {
    macd.push(ema12[i] - ema26[i]);
  }
  
  const signal = calculateEMA(macd.map((value, index) => ({ close: value, timestamp: data[index].timestamp, open: value, high: value, low: value })), 9);
  
  const histogram: number[] = [];
  for (let i = 0; i < Math.min(macd.length, signal.length); i++) {
    histogram.push(macd[i] - signal[i]);
  }
  
  return { macd, signal, histogram };
};

export const generateTechnicalSignals = (data: HistoricalData[]): TechnicalIndicator[] => {
  if (data.length < 50) return [];
  
  const indicators: TechnicalIndicator[] = [];
  const currentPrice = data[data.length - 1].close;
  
  // RSI Signal
  const rsi = calculateRSI(data);
  const currentRSI = rsi[rsi.length - 1];
  indicators.push({
    name: 'RSI (14)',
    value: currentRSI,
    signal: currentRSI > 70 ? 'SELL' : currentRSI < 30 ? 'BUY' : 'HOLD',
    confidence: Math.abs(currentRSI - 50) / 50,
  });
  
  // SMA Signal
  const sma20 = calculateSMA(data, 20);
  const sma50 = calculateSMA(data, 50);
  const currentSMA20 = sma20[sma20.length - 1];
  const currentSMA50 = sma50[sma50.length - 1];
  
  indicators.push({
    name: 'SMA Cross',
    value: currentSMA20,
    signal: currentSMA20 > currentSMA50 ? 'BUY' : 'SELL',
    confidence: Math.abs(currentSMA20 - currentSMA50) / currentSMA50,
  });
  
  // Price vs SMA Signal
  indicators.push({
    name: 'Price vs SMA20',
    value: currentPrice,
    signal: currentPrice > currentSMA20 ? 'BUY' : 'SELL',
    confidence: Math.abs(currentPrice - currentSMA20) / currentSMA20,
  });
  
  return indicators;
};

export const formatTimeframe = (timeframe: string): string => {
  const timeframes: { [key: string]: string } = {
    '1m': '1 Minute',
    '5m': '5 Minutes',
    '15m': '15 Minutes',
    '30m': '30 Minutes',
    '1h': '1 Hour',
    '4h': '4 Hours',
    '1d': '1 Day',
    '1w': '1 Week',
    '1M': '1 Month',
  };
  return timeframes[timeframe] || timeframe;
};