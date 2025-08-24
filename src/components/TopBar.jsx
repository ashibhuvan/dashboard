import React, { useState } from 'react'
import { Search, Settings, Download, Maximize2, Radar } from 'lucide-react'
import TickerAutocomplete from './TickerAutocomplete'

const TopBar = ({
  currentSymbol,
  onSymbolChange,
  timeframe,
  onTimeframeChange,
  chartType,
  onChartTypeChange,
  onRunScan
}) => {
  const [showSettings, setShowSettings] = useState(false)

  const timeframes = [
    { value: '1m', label: '1m' },
    { value: '5m', label: '5m' },
    { value: '15m', label: '15m' },
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
    { value: '1M', label: '1M' },
  ]

  const chartTypes = [
    { value: 'candlestick', label: 'Candlestick' },
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Area' },
    { value: 'ohlc', label: 'OHLC' },
  ]

  const handleTickerSelect = (ticker) => {
    onSymbolChange(ticker.symbol)
  }

  const openDataSourceSettings = () => {
    setShowSettings(true)
  }

  return (
    <>
      <div className="bg-trading-darker border-b border-trading-border px-2 sm:px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
        {/* Top row - Symbol search and tools */}
        <div className="flex items-center justify-between">
          {/* Left section - Symbol search */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <TickerAutocomplete
              value={currentSymbol}
              onSelect={handleTickerSelect}
              placeholder="Search stocks (AAPL, Apple...)"
              className="w-48 sm:w-64 lg:w-80"
            />
          </div>

          {/* Right section - Tools */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={onRunScan}
              className="flex items-center space-x-2 bg-trading-blue text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              title="Run Stock Scan"
            >
              <Radar className="w-4 h-4" />
              <span className="hidden sm:inline">Run Scan</span>
            </button>
            
            <button
              onClick={() => window.print()}
              className="p-2 text-trading-text-dim hover:text-trading-text hover:bg-trading-border rounded-lg transition-colors"
              title="Export Chart"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => document.documentElement.requestFullscreen()}
              className="p-2 text-trading-text-dim hover:text-trading-text hover:bg-trading-border rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={openDataSourceSettings}
              className="p-2 text-trading-text-dim hover:text-trading-text hover:bg-trading-border rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom row - Chart controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
          {/* Chart type */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-trading-text-dim hidden sm:inline">Type:</span>
            <select
              value={chartType}
              onChange={(e) => onChartTypeChange(e.target.value)}
              className="bg-trading-dark border border-trading-border rounded px-3 py-1 text-sm text-trading-text focus:outline-none focus:border-trading-blue"
            >
              {chartTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => onTimeframeChange(tf.value)}
                className={`px-2 sm:px-3 py-1 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  timeframe === tf.value
                    ? 'bg-trading-blue text-white'
                    : 'bg-trading-dark text-trading-text-dim hover:text-trading-text hover:bg-trading-border'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Source Settings Modal */}
      {showSettings && (
        <DataSourceModal onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}

// Data Source Configuration Modal
const DataSourceModal = ({ onClose }) => {
  const [config, setConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tradingDashboardConfig') || '{}')
    } catch {
      return { source: 'demo' }
    }
  })

  const dataSources = [
    { value: 'demo', label: 'Demo Data (Sample)', description: 'Realistic sample data for testing' },
    { value: 'alphavantage', label: 'Alpha Vantage', description: 'Professional financial data API' },
    { value: 'polygon', label: 'Polygon.io', description: 'Real-time and historical market data' },
    { value: 'yahoo', label: 'Yahoo Finance', description: 'Free financial data (limited)' },
  ]

  const handleSave = () => {
    localStorage.setItem('tradingDashboardConfig', JSON.stringify(config))
    onClose()
    // Refresh the page to reload with new data source
    window.location.reload()
  }

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-trading-darker border border-trading-border rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-trading-text-bright">Data Source Settings</h3>
          <button
            onClick={onClose}
            className="text-trading-text-dim hover:text-trading-text"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Data Source Selection */}
          <div>
            <label className="block text-sm font-medium text-trading-text mb-2">
              Data Source
            </label>
            <div className="space-y-2">
              {dataSources.map(source => (
                <label key={source.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dataSource"
                    value={source.value}
                    checked={config.source === source.value}
                    onChange={(e) => updateConfig('source', e.target.value)}
                    className="mt-1 text-trading-blue"
                  />
                  <div className="flex-1">
                    <div className="text-trading-text">{source.label}</div>
                    <div className="text-xs text-trading-text-dim">{source.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* API Configuration */}
          {(config.source === 'alphavantage' || config.source === 'polygon') && (
            <div className="space-y-3 pt-4 border-t border-trading-border">
              <div>
                <label className="block text-sm font-medium text-trading-text mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={config.apiKey || ''}
                  onChange={(e) => updateConfig('apiKey', e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full bg-trading-dark border border-trading-border rounded px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue"
                />
                <div className="text-xs text-trading-text-dim mt-1">
                  Your API key is stored locally and never shared
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-trading-text mb-1">
                  Update Frequency
                </label>
                <select
                  value={config.updateFrequency || '30'}
                  onChange={(e) => updateConfig('updateFrequency', e.target.value)}
                  className="w-full bg-trading-dark border border-trading-border rounded px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue"
                >
                  <option value="10">10 seconds (Premium)</option>
                  <option value="30">30 seconds (Standard)</option>
                  <option value="60">1 minute (Free tier)</option>
                  <option value="300">5 minutes (Conservative)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableLiveUpdates"
                  checked={config.enableLiveUpdates || false}
                  onChange={(e) => updateConfig('enableLiveUpdates', e.target.checked)}
                  className="text-trading-blue"
                />
                <label htmlFor="enableLiveUpdates" className="text-sm text-trading-text">
                  Enable live updates
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-trading-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-trading-text-dim hover:text-trading-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-trading-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default TopBar