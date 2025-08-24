import React from 'react'
import { useMarketData } from '../hooks/useMarketData'
import { generateCompanyInfo } from '../utils/dataGenerator'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MarketInfo = ({ symbol }) => {
  const { data, isLoading, error } = useMarketData(symbol, '1D')
  const companyInfo = generateCompanyInfo(symbol)


  if (error) {
    return (
      <div className="p-6 flex items-center justify-center text-trading-red">
        <div className="text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">Unable to load market data</div>
        </div>
      </div>
    )
  }

  if (isLoading || !data) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        {/* Loading skeleton */}
        <div className="space-y-2">
          <div className="h-8 bg-trading-border rounded w-2/3"></div>
          <div className="h-4 bg-trading-border rounded w-1/2"></div>
        </div>
        
        <div className="space-y-3">
          <div className="h-12 bg-trading-border rounded"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-trading-border rounded w-1/3"></div>
                <div className="h-4 bg-trading-border rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const isPositive = data.change >= 0
  const lastBar = data.ohlc[data.ohlc.length - 1]

  // Calculate additional metrics
  const dayRange = `$${lastBar.low.toFixed(2)} - $${lastBar.high.toFixed(2)}`
  const fiftyTwoWeekHigh = (data.currentPrice * (1.2 + Math.random() * 0.3)).toFixed(2)
  const fiftyTwoWeekLow = (data.currentPrice * (0.7 - Math.random() * 0.2)).toFixed(2)

  const marketStats = [
    { label: 'Open', value: `$${lastBar.open.toFixed(2)}` },
    { label: 'High', value: `$${lastBar.high.toFixed(2)}` },
    { label: 'Low', value: `$${lastBar.low.toFixed(2)}` },
    { label: 'Volume', value: formatVolume(lastBar.volume) },
    { label: 'Day Range', value: dayRange },
    { label: '52W High', value: `$${fiftyTwoWeekHigh}` },
    { label: '52W Low', value: `$${fiftyTwoWeekLow}` },
    { label: 'Market Cap', value: companyInfo.marketCap },
    { label: 'P/E Ratio', value: companyInfo.peRatio },
    { label: 'Dividend', value: companyInfo.dividend },
  ]

  return (
    <div className="bg-trading-darker border-l lg:border-l border-t lg:border-t-0 border-trading-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-trading-border">
        <div className="space-y-3">
          {/* Symbol and company name */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-trading-text-bright tracking-tight">
              {symbol}
            </h1>
            <p className="text-sm text-trading-text font-medium">
              {companyInfo.name}
            </p>
            <p className="text-xs text-trading-text-dim">
              {companyInfo.sector}
            </p>
          </div>

          {/* Current price and change */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl lg:text-3xl font-bold text-trading-text-bright font-mono">
                ${data.currentPrice.toFixed(2)}
              </span>
              <span className="text-sm text-trading-text-dim">USD</span>
            </div>
            
            <div className={`flex items-center space-x-2 text-lg font-semibold ${
              isPositive ? 'text-trading-green' : 'text-trading-red'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>
                {isPositive ? '+' : ''}{data.change.toFixed(2)}
              </span>
              <span>
                ({isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-trading-green rounded-full live-indicator"></div>
            <span className="text-xs text-trading-text-dim">
              Live • Last updated {new Date(data.lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto trading-scrollbar">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
            Market Statistics
          </h3>
          
          <div className="space-y-3">
            {marketStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-trading-border border-opacity-30">
                <span className="text-sm text-trading-text-dim font-medium">
                  {stat.label}
                </span>
                <span className="text-sm text-trading-text-bright font-semibold font-mono">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
            Performance
          </h3>
          
          <div className="space-y-3">
            {generatePerformanceMetrics().map((metric, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-trading-text-dim font-medium">
                  {metric.period}
                </span>
                <span className={`text-sm font-semibold font-mono ${
                  metric.return >= 0 ? 'text-trading-green' : 'text-trading-red'
                }`}>
                  {metric.return >= 0 ? '+' : ''}{metric.return.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button className="w-full bg-trading-green bg-opacity-20 text-trading-green border border-trading-green border-opacity-30 py-2 px-4 rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium">
              Add to Watchlist
            </button>
            
            <button className="w-full bg-trading-blue bg-opacity-20 text-trading-blue border border-trading-blue border-opacity-30 py-2 px-4 rounded-lg hover:bg-opacity-30 transition-colors text-sm font-medium">
              Set Price Alert
            </button>
            
            <button className="w-full bg-trading-border text-trading-text py-2 px-4 rounded-lg hover:bg-opacity-70 transition-colors text-sm font-medium">
              View Research
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to format volume
const formatVolume = (volume) => {
  if (volume >= 1e9) {
    return `${(volume / 1e9).toFixed(1)}B`
  } else if (volume >= 1e6) {
    return `${(volume / 1e6).toFixed(1)}M`
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(1)}K`
  }
  return volume.toLocaleString()
}

// Generate sample performance metrics
const generatePerformanceMetrics = () => {
  return [
    { period: '1 Day', return: (Math.random() - 0.5) * 6 },
    { period: '1 Week', return: (Math.random() - 0.5) * 12 },
    { period: '1 Month', return: (Math.random() - 0.5) * 20 },
    { period: '3 Months', return: (Math.random() - 0.5) * 30 },
    { period: '6 Months', return: (Math.random() - 0.5) * 40 },
    { period: '1 Year', return: (Math.random() - 0.5) * 60 },
    { period: '5 Years', return: (Math.random() - 0.2) * 200 },
  ]
}

export default MarketInfo