export interface CurrencyPair {
  symbol: string;
  base: string;
  quote: string;
  rate: number;
  change: number;
  changePercent: number;
  bid: number;
  ask: number;
  spread: number;
  timestamp: string;
}

export interface ForexQuote {
  symbol: string;
  rate: number;
  timestamp: string;
}

export interface HistoricalData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
  status: 'OPEN' | 'CLOSED';
}

export interface Portfolio {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  totalPnl: number;
  totalPnlPercent: number;
}

export interface RiskManagement {
  maxRiskPerTrade: number;
  maxDrawdown: number;
  positionSize: number;
  leverage: number;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  currencies: string[];
}

export interface ForexState {
  currencyPairs: CurrencyPair[];
  selectedPair: string;
  historicalData: HistoricalData[];
  technicalIndicators: TechnicalIndicator[];
  trades: Trade[];
  portfolio: Portfolio;
  riskManagement: RiskManagement;
  marketNews: MarketNews[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: string;
}