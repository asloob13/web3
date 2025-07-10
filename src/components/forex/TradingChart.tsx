'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HistoricalData } from '@/types/forex';
import { calculateSMA, calculateEMA, calculateRSI } from '@/utils/forexUtils';
import { format } from 'date-fns';

interface TradingChartProps {
  data: HistoricalData[];
  symbol: string;
  showSMA?: boolean;
  showEMA?: boolean;
  height?: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  data,
  symbol,
  showSMA = true,
  showEMA = true,
  height = 400,
}) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return [];

    const sma20 = showSMA ? calculateSMA(data, 20) : [];
    const ema12 = showEMA ? calculateEMA(data, 12) : [];
    const rsi = calculateRSI(data, 14);

    return data.map((item, index) => ({
      timestamp: item.timestamp,
      date: format(new Date(item.timestamp), 'MMM dd'),
      price: item.close,
      high: item.high,
      low: item.low,
      open: item.open,
      volume: item.volume,
      sma20: sma20[index - 19] || null,
      ema12: ema12[index - 11] || null,
      rsi: rsi[index - 13] || null,
    }));
  }, [data, showSMA, showEMA]);

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-blue-600 dark:text-blue-400">
            Price: {data.price?.toFixed(5)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            High: {data.high?.toFixed(5)} | Low: {data.low?.toFixed(5)}
          </p>
          {data.sma20 && (
            <p className="text-purple-600 dark:text-purple-400">
              SMA20: {data.sma20.toFixed(5)}
            </p>
          )}
          {data.ema12 && (
            <p className="text-orange-600 dark:text-orange-400">
              EMA12: {data.ema12.toFixed(5)}
            </p>
          )}
          {data.rsi && (
            <p className="text-green-600 dark:text-green-400">
              RSI: {data.rsi.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {symbol} Price Chart
        </h3>
        <div className="flex space-x-4 text-sm">
          {showSMA && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">SMA20</span>
            </div>
          )}
          {showEMA && (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">EMA12</span>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs text-gray-500"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            domain={['dataMin - 0.001', 'dataMax + 0.001']}
            className="text-xs text-gray-500"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Current price reference line */}
          <ReferenceLine 
            y={currentPrice} 
            stroke="#3B82F6" 
            strokeDasharray="5 5" 
            label={{ value: "Current", position: "right" }}
          />
          
          {/* Main price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3B82F6' }}
          />
          
          {/* SMA Line */}
          {showSMA && (
            <Line
              type="monotone"
              dataKey="sma20"
              stroke="#8B5CF6"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="3 3"
            />
          )}
          
          {/* EMA Line */}
          {showEMA && (
            <Line
              type="monotone"
              dataKey="ema12"
              stroke="#F59E0B"
              strokeWidth={1.5}
              dot={false}
              strokeDasharray="5 5"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};