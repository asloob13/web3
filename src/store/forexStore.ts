import { create } from 'zustand';
import { ForexState, CurrencyPair, HistoricalData, Trade, MarketNews } from '@/types/forex';

interface ForexActions {
  updateCurrencyPairs: (pairs: CurrencyPair[]) => void;
  setSelectedPair: (symbol: string) => void;
  updateHistoricalData: (data: HistoricalData[]) => void;
  addTrade: (trade: Trade) => void;
  closeTrade: (tradeId: string, closePrice: number) => void;
  updatePortfolio: () => void;
  setMarketNews: (news: MarketNews[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetError: () => void;
}

const useForexStore = create<ForexState & ForexActions>((set, get) => ({
  // Initial state
  currencyPairs: [],
  selectedPair: 'EUR/USD',
  historicalData: [],
  technicalIndicators: [],
  trades: [],
  portfolio: {
    balance: 10000,
    equity: 10000,
    margin: 0,
    freeMargin: 10000,
    marginLevel: 0,
    totalPnl: 0,
    totalPnlPercent: 0,
  },
  riskManagement: {
    maxRiskPerTrade: 2,
    maxDrawdown: 10,
    positionSize: 0.1,
    leverage: 50,
  },
  marketNews: [],
  isLoading: false,
  error: null,
  lastUpdate: new Date().toISOString(),

  // Actions
  updateCurrencyPairs: (pairs) => 
    set((state) => ({ 
      currencyPairs: pairs,
      lastUpdate: new Date().toISOString()
    })),

  setSelectedPair: (symbol) => 
    set({ selectedPair: symbol }),

  updateHistoricalData: (data) => 
    set({ historicalData: data }),

  addTrade: (trade) => 
    set((state) => ({ 
      trades: [...state.trades, trade]
    })),

  closeTrade: (tradeId, closePrice) => 
    set((state) => ({
      trades: state.trades.map(trade => 
        trade.id === tradeId 
          ? { 
              ...trade, 
              status: 'CLOSED' as const,
              currentPrice: closePrice,
              pnl: trade.type === 'BUY' 
                ? (closePrice - trade.entryPrice) * trade.amount
                : (trade.entryPrice - closePrice) * trade.amount,
              pnlPercent: trade.type === 'BUY'
                ? ((closePrice - trade.entryPrice) / trade.entryPrice) * 100
                : ((trade.entryPrice - closePrice) / trade.entryPrice) * 100
            }
          : trade
      )
    })),

  updatePortfolio: () => 
    set((state) => {
      const openTrades = state.trades.filter(trade => trade.status === 'OPEN');
      const totalPnl = openTrades.reduce((sum, trade) => sum + trade.pnl, 0);
      const totalMargin = openTrades.reduce((sum, trade) => sum + (trade.amount * trade.entryPrice) / state.riskManagement.leverage, 0);
      
      const equity = state.portfolio.balance + totalPnl;
      const freeMargin = equity - totalMargin;
      const marginLevel = totalMargin > 0 ? (equity / totalMargin) * 100 : 0;

      return {
        portfolio: {
          ...state.portfolio,
          equity,
          margin: totalMargin,
          freeMargin,
          marginLevel,
          totalPnl,
          totalPnlPercent: (totalPnl / state.portfolio.balance) * 100,
        }
      };
    }),

  setMarketNews: (news) => 
    set({ marketNews: news }),

  setLoading: (loading) => 
    set({ isLoading: loading }),

  setError: (error) => 
    set({ error }),

  resetError: () => 
    set({ error: null }),
}));

export default useForexStore;