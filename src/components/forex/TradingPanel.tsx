'use client';

import React, { useState, useCallback } from 'react';
import { Trade } from '@/types/forex';
import { calculatePositionSize, calculatePipValue } from '@/utils/forexUtils';
import { TrendingUp, TrendingDown, Calculator, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface TradingPanelProps {
  symbol: string;
  currentPrice: number;
  bid: number;
  ask: number;
  balance: number;
  onPlaceTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'pnl' | 'pnlPercent'>) => void;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({
  symbol,
  currentPrice,
  bid,
  ask,
  balance,
  onPlaceTrade
}) => {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [lotSize, setLotSize] = useState(0.1);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [takeProfit, setTakeProfit] = useState<number>(0);
  const [riskPercent, setRiskPercent] = useState(2);

  const entryPrice = tradeType === 'BUY' ? ask : bid;
  const pipValue = calculatePipValue(symbol, lotSize);
  
  const stopLossPips = stopLoss > 0 ? Math.abs(entryPrice - stopLoss) * 10000 : 0;
  const takeProfitPips = takeProfit > 0 ? Math.abs(takeProfit - entryPrice) * 10000 : 0;
  
  const suggestedPositionSize = stopLoss > 0 ? 
    calculatePositionSize(balance, riskPercent, stopLossPips, pipValue) : lotSize;
  
  const marginRequired = (lotSize * entryPrice) / 50; // Assuming 1:50 leverage
  const riskAmount = stopLoss > 0 ? stopLossPips * pipValue * lotSize : 0;

  const handlePlaceTrade = useCallback(() => {
    if (marginRequired > balance) {
      alert('Insufficient margin for this trade');
      return;
    }

    const trade: Omit<Trade, 'id' | 'timestamp' | 'pnl' | 'pnlPercent'> = {
      symbol,
      type: tradeType,
      amount: lotSize,
      entryPrice,
      currentPrice: entryPrice,
      stopLoss: stopLoss > 0 ? stopLoss : undefined,
      takeProfit: takeProfit > 0 ? takeProfit : undefined,
      status: 'OPEN',
    };

    onPlaceTrade(trade);
    
    // Reset form
    setStopLoss(0);
    setTakeProfit(0);
  }, [symbol, tradeType, lotSize, entryPrice, stopLoss, takeProfit, onPlaceTrade, marginRequired, balance]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Trading Panel - {symbol}
      </h3>

      {/* Trade Type Selection */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setTradeType('BUY')}
          className={`p-3 rounded-lg border-2 transition-colors ${
            tradeType === 'BUY'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">BUY</span>
          </div>
          <div className="text-sm mt-1">{ask.toFixed(5)}</div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setTradeType('SELL')}
          className={`p-3 rounded-lg border-2 transition-colors ${
            tradeType === 'SELL'
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <TrendingDown className="w-5 h-5" />
            <span className="font-semibold">SELL</span>
          </div>
          <div className="text-sm mt-1">{bid.toFixed(5)}</div>
        </motion.button>
      </div>

      {/* Position Size */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Lot Size
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="10"
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value) || 0.01)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {stopLoss > 0 && (
            <button
              onClick={() => setLotSize(suggestedPositionSize)}
              className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              title="Use suggested position size based on risk management"
            >
              <Calculator className="w-4 h-4" />
            </button>
          )}
        </div>
        {stopLoss > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Suggested: {suggestedPositionSize.toFixed(2)} lots (based on {riskPercent}% risk)
          </div>
        )}
      </div>

      {/* Risk Management */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Risk % per Trade
        </label>
        <input
          type="number"
          step="0.1"
          min="0.1"
          max="10"
          value={riskPercent}
          onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stop Loss */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Stop Loss
        </label>
        <input
          type="number"
          step="0.00001"
          value={stopLoss || ''}
          onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
          placeholder="Optional"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {stopLoss > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {stopLossPips.toFixed(1)} pips risk
          </div>
        )}
      </div>

      {/* Take Profit */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Take Profit
        </label>
        <input
          type="number"
          step="0.00001"
          value={takeProfit || ''}
          onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
          placeholder="Optional"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {takeProfit > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {takeProfitPips.toFixed(1)} pips target
          </div>
        )}
      </div>

      {/* Trade Summary */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Entry Price:</span>
            <span className="font-medium text-gray-900 dark:text-white">{entryPrice.toFixed(5)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Margin Required:</span>
            <span className="font-medium text-gray-900 dark:text-white">${marginRequired.toFixed(2)}</span>
          </div>
          {riskAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Max Risk:</span>
              <span className="font-medium text-red-600 dark:text-red-400">${riskAmount.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {marginRequired > balance && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Insufficient margin for this trade</span>
          </div>
        </div>
      )}

      {/* Place Trade Button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handlePlaceTrade}
        disabled={marginRequired > balance}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          tradeType === 'BUY'
            ? 'bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400'
            : 'bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400'
        } disabled:cursor-not-allowed`}
      >
        {tradeType} {symbol} - {lotSize} Lots
      </motion.button>
    </div>
  );
};