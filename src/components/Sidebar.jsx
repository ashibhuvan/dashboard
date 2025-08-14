import React, { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  Activity, 
  Eye,
  BarChart3,
  Timer,
  Target
} from 'lucide-react'

const Sidebar = ({ collapsed, onToggleCollapse, activeIndicators, onToggleIndicator }) => {
  const [activeTab, setActiveTab] = useState('indicators')

  const tabs = [
    { id: 'indicators', label: 'Indicators', icon: TrendingUp },
    { id: 'research', label: 'Research', icon: Search },
    { id: 'backtesting', label: 'Backtesting', icon: Activity },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
  ]

  const technicalIndicators = [
    {
      category: 'Trend Indicators',
      indicators: [
        { id: 'sma20', name: 'SMA (20)', description: 'Simple Moving Average' },
        { id: 'sma50', name: 'SMA (50)', description: 'Simple Moving Average' },
        { id: 'ema12', name: 'EMA (12)', description: 'Exponential Moving Average' },
        { id: 'ema26', name: 'EMA (26)', description: 'Exponential Moving Average' },
        { id: 'bb', name: 'Bollinger Bands', description: 'Volatility indicator' },
      ]
    },
    {
      category: 'Momentum',
      indicators: [
        { id: 'rsi', name: 'RSI (14)', description: 'Relative Strength Index' },
        { id: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence' },
        { id: 'stoch', name: 'Stochastic', description: 'Stochastic oscillator' },
      ]
    },
    {
      category: 'Volume',
      indicators: [
        { id: 'volume', name: 'Volume', description: 'Trading volume' },
        { id: 'vwap', name: 'VWAP', description: 'Volume Weighted Average Price' },
      ]
    }
  ]

  const watchlistItems = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.15, changePercent: 1.45 },
    { symbol: 'MSFT', name: 'Microsoft', price: 285.76, change: -0.85, changePercent: -0.30 },
    { symbol: 'GOOGL', name: 'Alphabet', price: 2650.12, change: 15.32, changePercent: 0.58 },
    { symbol: 'AMZN', name: 'Amazon', price: 3100.45, change: -12.33, changePercent: -0.40 },
    { symbol: 'TSLA', name: 'Tesla', price: 220.88, change: 8.76, changePercent: 4.13 },
  ]

  if (collapsed) {
    return (
      <div className="w-12 bg-trading-darker border-r border-trading-border flex flex-col">
        <div className="p-3 border-b border-trading-border">
          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 flex items-center justify-center text-trading-text-dim hover:text-trading-text transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col space-y-1 p-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  onToggleCollapse()
                }}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  activeTab === tab.id
                    ? 'bg-trading-blue text-white'
                    : 'text-trading-text-dim hover:text-trading-text hover:bg-trading-border'
                }`}
                title={tab.label}
              >
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-trading-darker border-r border-trading-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-trading-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-trading-text-bright">Trading Dashboard</h2>
        <button
          onClick={onToggleCollapse}
          className="p-1 text-trading-text-dim hover:text-trading-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-trading-border">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-trading-blue border-b-2 border-trading-blue bg-trading-blue bg-opacity-10'
                  : 'text-trading-text-dim hover:text-trading-text'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto trading-scrollbar">
        {activeTab === 'indicators' && (
          <div className="p-4 space-y-6">
            <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
              Technical Indicators
            </h3>
            
            {technicalIndicators.map(category => (
              <div key={category.category} className="space-y-3">
                <h4 className="text-xs font-medium text-trading-text-dim uppercase tracking-wide">
                  {category.category}
                </h4>
                
                <div className="space-y-2">
                  {category.indicators.map(indicator => (
                    <label
                      key={indicator.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-trading-border cursor-pointer group transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={activeIndicators.has(indicator.id)}
                        onChange={() => onToggleIndicator(indicator.id)}
                        className="text-trading-blue focus:ring-trading-blue focus:ring-offset-0 bg-transparent border-trading-border"
                      />
                      <div className="flex-1">
                        <div className="text-sm text-trading-text group-hover:text-trading-text-bright">
                          {indicator.name}
                        </div>
                        <div className="text-xs text-trading-text-dim">
                          {indicator.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'research' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
              Research Tools
            </h3>
            
            <div className="space-y-2">
              {[
                { icon: BarChart3, label: 'Analyst Ratings', description: 'Professional analyst recommendations' },
                { icon: Search, label: 'News & Events', description: 'Latest market news and events' },
                { icon: TrendingUp, label: 'Earnings Calendar', description: 'Upcoming earnings reports' },
                { icon: Timer, label: 'Economic Calendar', description: 'Key economic indicators' },
                { icon: Target, label: 'SEC Filings', description: 'Corporate filings and documents' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={index}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-trading-border hover:bg-trading-border transition-colors text-left"
                  >
                    <Icon className="w-5 h-5 text-trading-blue flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-trading-text">{item.label}</div>
                      <div className="text-xs text-trading-text-dim">{item.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'backtesting' && (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
              Backtesting Engine
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-trading-text-dim uppercase tracking-wide mb-2">
                  Strategy
                </label>
                <select className="w-full bg-trading-dark border border-trading-border rounded-lg px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue">
                  <option>SMA Crossover</option>
                  <option>RSI Reversal</option>
                  <option>Bollinger Squeeze</option>
                  <option>MACD Signal</option>
                  <option>Custom Strategy</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-trading-text-dim uppercase tracking-wide mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-trading-dark border border-trading-border rounded-lg px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-trading-text-dim uppercase tracking-wide mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-trading-dark border border-trading-border rounded-lg px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-trading-text-dim uppercase tracking-wide mb-2">
                  Initial Capital
                </label>
                <input
                  type="number"
                  defaultValue={10000}
                  className="w-full bg-trading-dark border border-trading-border rounded-lg px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue"
                />
              </div>

              <button className="w-full bg-trading-blue text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Run Backtest
              </button>
            </div>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-trading-text-bright uppercase tracking-wide">
                Watchlist
              </h3>
              <button className="text-xs text-trading-blue hover:text-blue-400 transition-colors">
                + Add Symbol
              </button>
            </div>
            
            <div className="space-y-2">
              {watchlistItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-trading-border hover:bg-trading-border transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-trading-text text-sm">{item.symbol}</span>
                      <span className="font-mono text-sm text-trading-text">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-trading-text-dim truncate mr-2">{item.name}</span>
                      <div className={`text-xs font-medium ${
                        item.change >= 0 ? 'text-trading-green' : 'text-trading-red'
                      }`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar