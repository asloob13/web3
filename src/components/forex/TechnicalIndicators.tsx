'use client';

import React from 'react';
import { TechnicalIndicator } from '@/types/forex';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface TechnicalIndicatorsProps {
  indicators: TechnicalIndicator[];
}

export const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ indicators }) => {
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'SELL':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'BUY':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'SELL':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700/30';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-green-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Technical Analysis
      </h3>
      
      {indicators.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Not enough data for technical analysis</p>
          <p className="text-sm mt-1">Need at least 50 data points</p>
        </div>
      ) : (
        <div className="space-y-3">
          {indicators.map((indicator, index) => (
            <motion.div
              key={indicator.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center space-x-3">
                {getSignalIcon(indicator.signal)}
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {indicator.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Value: {indicator.value.toFixed(4)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-sm font-medium px-2 py-1 rounded ${getSignalColor(indicator.signal)}`}>
                    {indicator.signal}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Confidence: {(indicator.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                
                <div className="w-2 h-8 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getConfidenceColor(indicator.confidence)}`}
                    style={{ height: `${indicator.confidence * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {indicators.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Overall Signal:
            </span>
            <div className="flex items-center space-x-2">
              {(() => {
                const buySignals = indicators.filter(i => i.signal === 'BUY').length;
                const sellSignals = indicators.filter(i => i.signal === 'SELL').length;
                const overallSignal = buySignals > sellSignals ? 'BUY' : sellSignals > buySignals ? 'SELL' : 'HOLD';
                
                return (
                  <>
                    {getSignalIcon(overallSignal)}
                    <span className={`font-semibold ${
                      overallSignal === 'BUY' ? 'text-green-600 dark:text-green-400' :
                      overallSignal === 'SELL' ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {overallSignal}
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};