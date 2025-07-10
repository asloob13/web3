'use client';

import React, { useEffect, useState } from 'react';
import { CurrencyPairCard } from '@/components/forex/CurrencyPairCard';
import { TradingChart } from '@/components/forex/TradingChart';
import { TechnicalIndicators } from '@/components/forex/TechnicalIndicators';
import { TradingPanel } from '@/components/forex/TradingPanel';
import useForexStore from '@/store/forexStore';
import { 
  fetchCurrencyPairs, 
  fetchHistoricalData, 
  fetchMarketNews,
  startRealTimeUpdates 
} from '@/utils/forexApi';
import { generateTechnicalSignals } from '@/utils/forexUtils';
import { Trade, MarketNews } from '@/types/forex';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  News,
  Settings,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ForexDashboard() {
  const {
    currencyPairs,
    selectedPair,
    historicalData,
    technicalIndicators,
    trades,
    portfolio,
    marketNews,
    isLoading,
    error,
    updateCurrencyPairs,
    setSelectedPair,
    updateHistoricalData,
    addTrade,
    updatePortfolio,
    setMarketNews,
    setLoading,
    setError,
    resetError
  } = useForexStore();

  const [activeTab, setActiveTab] = useState<'chart' | 'news' | 'trades'>('chart');
  const [showSettings, setShowSettings] = useState(false);

  const selectedPairData = currencyPairs.find(pair => pair.symbol === selectedPair);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      resetError();
      
      try {
        // Load currency pairs
        const pairs = await fetchCurrencyPairs();
        updateCurrencyPairs(pairs);

        // Load historical data for selected pair
        const historical = await fetchHistoricalData(selectedPair);
        updateHistoricalData(historical);

        // Load market news
        const news = await fetchMarketNews();
        setMarketNews(news);

        toast.success('Market data loaded successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load market data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load historical data when selected pair changes
  useEffect(() => {
    const loadHistoricalData = async () => {
      if (!selectedPair) return;
      
      setLoading(true);
      try {
        const historical = await fetchHistoricalData(selectedPair);
        updateHistoricalData(historical);
        
        // Generate technical signals
        const signals = generateTechnicalSignals(historical);
        // Update technical indicators in store would need to be implemented
      } catch (err) {
        console.error('Failed to load historical data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHistoricalData();
  }, [selectedPair]);

  // Start real-time updates
  useEffect(() => {
    const stopUpdates = startRealTimeUpdates((pairs) => {
      updateCurrencyPairs(pairs);
      updatePortfolio(); // Recalculate portfolio based on current prices
    }, 5000);

    return stopUpdates;
  }, []);

  // Handle placing a trade
  const handlePlaceTrade = (tradeData: Omit<Trade, 'id' | 'timestamp' | 'pnl' | 'pnlPercent'>) => {
    const trade: Trade = {
      ...tradeData,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString(),
      pnl: 0,
      pnlPercent: 0,
    };

    addTrade(trade);
    updatePortfolio();
    toast.success(`${trade.type} order placed for ${trade.symbol}`);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [pairs, historical, news] = await Promise.all([
        fetchCurrencyPairs(),
        fetchHistoricalData(selectedPair),
        fetchMarketNews()
      ]);
      
      updateCurrencyPairs(pairs);
      updateHistoricalData(historical);
      setMarketNews(news);
      
      toast.success('Data refreshed');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const openTrades = trades.filter(trade => trade.status === 'OPEN');
  const closedTrades = trades.filter(trade => trade.status === 'CLOSED');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Forex Trading Dashboard
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Professional Trading Platform
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Balance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${portfolio.balance.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Equity</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${portfolio.equity.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              {portfolio.totalPnl >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">P&L</span>
            </div>
            <p className={`text-2xl font-bold ${
              portfolio.totalPnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              ${portfolio.totalPnl.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Trades</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {openTrades.length}
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Currency Pairs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Currency Pairs
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currencyPairs.map((pair) => (
                  <CurrencyPairCard
                    key={pair.symbol}
                    pair={pair}
                    isSelected={pair.symbol === selectedPair}
                    onClick={() => setSelectedPair(pair.symbol)}
                  />
                ))}
              </div>
            </div>

            {/* Trading Panel */}
            {selectedPairData && (
              <TradingPanel
                symbol={selectedPairData.symbol}
                currentPrice={selectedPairData.rate}
                bid={selectedPairData.bid}
                ask={selectedPairData.ask}
                balance={portfolio.balance}
                onPlaceTrade={handlePlaceTrade}
              />
            )}
          </div>

          {/* Main Chart Area */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Chart */}
              <TradingChart
                data={historicalData}
                symbol={selectedPair}
                height={400}
              />

              {/* Tab Navigation */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-600">
                {[
                  { id: 'chart', label: 'Technical Analysis', icon: Activity },
                  { id: 'news', label: 'Market News', icon: News },
                  { id: 'trades', label: 'Trade History', icon: TrendingUp },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                      activeTab === id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'chart' && (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <TechnicalIndicators indicators={generateTechnicalSignals(historicalData)} />
                  </motion.div>
                )}

                {activeTab === 'news' && (
                  <motion.div
                    key="news"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Market News
                    </h3>
                    <div className="space-y-4">
                      {marketNews.map((news) => (
                        <div key={news.id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-white pr-4">
                              {news.title}
                            </h4>
                            <span className={`text-xs px-2 py-1 rounded ${
                              news.impact === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                              news.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                              'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {news.impact}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {news.summary}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                            <span>{news.source}</span>
                            <span>{new Date(news.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'trades' && (
                  <motion.div
                    key="trades"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Trade History
                    </h3>
                    <div className="space-y-4">
                      {trades.length === 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                          No trades yet. Place your first trade to get started!
                        </p>
                      ) : (
                        trades.slice(-10).reverse().map((trade) => (
                          <div key={trade.id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    trade.type === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {trade.type}
                                  </span>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {trade.symbol}
                                  </span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {trade.amount} lots
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Entry: {trade.entryPrice.toFixed(5)} | Current: {trade.currentPrice.toFixed(5)}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-medium ${
                                  trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                  ${trade.pnl.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(trade.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <TechnicalIndicators indicators={generateTechnicalSignals(historicalData)} />
          </div>
        </div>
      </div>
    </div>
  );
}