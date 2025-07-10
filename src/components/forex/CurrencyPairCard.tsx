'use client';

import React from 'react';
import { CurrencyPair } from '@/types/forex';
import { formatPercentage } from '@/utils/forexUtils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CurrencyPairCardProps {
  pair: CurrencyPair;
  isSelected?: boolean;
  onClick?: () => void;
}

export const CurrencyPairCard: React.FC<CurrencyPairCardProps> = ({
  pair,
  isSelected = false,
  onClick
}) => {
  const isPositive = pair.change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'
        }
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {pair.symbol}
          </h3>
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded ${
          isPositive 
            ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
        }`}>
          {formatPercentage(pair.changePercent)}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {pair.rate.toFixed(5)}
          </span>
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? '+' : ''}{pair.change.toFixed(5)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Bid: {pair.bid.toFixed(5)}</span>
          <span>Ask: {pair.ask.toFixed(5)}</span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Spread: {(pair.spread * 10000).toFixed(1)} pips
        </div>
      </div>
    </motion.div>
  );
};