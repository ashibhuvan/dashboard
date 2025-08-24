import React, { useState, useEffect } from 'react'
import { ArrowLeft, Play, Filter, Download, TrendingUp, TrendingDown, BarChart3, Volume } from 'lucide-react'
import { getAllTickers } from '../data/stockTickers'

const StockScanner = ({ onBack }) => {
  const [selectedScan, setSelectedScan] = useState('breakout')
  const [timeRange, setTimeRange] = useState('1D')
  const [minVolume, setMinVolume] = useState(1000000)
  const [minPrice, setMinPrice] = useState(5)
  const [maxPrice, setMaxPrice] = useState(1000)
  const [minMarketCap, setMinMarketCap] = useState(100)
  const [exchanges, setExchanges] = useState(['NYSE', 'NASDAQ', 'AMEX'])
  const [sectors, setSectors] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState([])
  const [resultCount, setResultCount] = useState(0)

  // Predefined scan types
  const scanTypes = [
    {
      id: 'breakout',
      name: 'Breakout Stocks',
      description: 'Stocks breaking above resistance with high volume',
      icon: TrendingUp,
      color: 'text-trading-green'
    },
    {
      id: 'breakdown',
      name: 'Breakdown Stocks', 
      description: 'Stocks breaking below support with high volume',
      icon: TrendingDown,
      color: 'text-trading-red'
    },
    {
      id: 'highVolume',
      name: 'High Volume',
      description: 'Stocks with unusually high trading volume',
      icon: Volume,
      color: 'text-trading-blue'
    },
    {
      id: 'gapUp',
      name: 'Gap Up',
      description: 'Stocks opening significantly higher than previous close',
      icon: TrendingUp,
      color: 'text-trading-green'
    },
    {
      id: 'gapDown',
      name: 'Gap Down',
      description: 'Stocks opening significantly lower than previous close',
      icon: TrendingDown,
      color: 'text-trading-red'
    },
    {
      id: 'momentum',
      name: 'Strong Momentum',
      description: 'Stocks showing consistent upward price movement',
      icon: BarChart3,
      color: 'text-trading-blue'
    },
    {
      id: 'oversold',
      name: 'Oversold Bounce',
      description: 'Potentially oversold stocks ready for reversal',
      icon: TrendingUp,
      color: 'text-trading-green'
    },
    {
      id: 'overbought',
      name: 'Overbought Pullback',
      description: 'Potentially overbought stocks due for correction',
      icon: TrendingDown,
      color: 'text-trading-red'
    },
    {
      id: 'earnings',
      name: 'Pre-Earnings Movers',
      description: 'Stocks showing unusual activity before earnings',
      icon: BarChart3,
      color: 'text-trading-blue'
    },
    {
      id: 'newHighs',
      name: '52-Week Highs',
      description: 'Stocks hitting new 52-week highs',
      icon: TrendingUp,
      color: 'text-trading-green'
    },
    {
      id: 'newLows',
      name: '52-Week Lows',
      description: 'Stocks hitting new 52-week lows',
      icon: TrendingDown,
      color: 'text-trading-red'
    },
    {
      id: 'unusual',
      name: 'Unusual Activity',
      description: 'Stocks with unusual options or volume activity',
      icon: BarChart3,
      color: 'text-trading-blue'
    }
  ]

  const timeRanges = [
    { value: '1m', label: '1 Minute' },
    { value: '5m', label: '5 Minutes' },
    { value: '15m', label: '15 Minutes' },
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '1D', label: '1 Day' },
    { value: '1W', label: '1 Week' },
    { value: '1M', label: '1 Month' }
  ]

  const availableSectors = [
    'Technology', 'Healthcare', 'Financial Services', 'Consumer Discretionary',
    'Consumer Staples', 'Energy', 'Industrials', 'Real Estate', 'Materials',
    'Communication Services', 'Utilities', 'Automotive', 'Biotechnology'
  ]

  const availableExchanges = ['NYSE', 'NASDAQ', 'AMEX']

  // Handle sector selection
  const handleSectorChange = (sector) => {
    setSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    )
  }

  // Handle exchange selection
  const handleExchangeChange = (exchange) => {
    setExchanges(prev => 
      prev.includes(exchange)
        ? prev.filter(e => e !== exchange)
        : [...prev, exchange]
    )
  }

  // Simulate scan execution
  const runScan = async () => {
    setIsScanning(true)
    setScanResults([])
    setResultCount(0)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Get all tickers and apply filters
      const allTickers = getAllTickers()
      
      // Filter by exchange
      let filteredTickers = allTickers.filter(ticker => 
        exchanges.includes(ticker.exchange)
      )

      // Filter by sector if specified
      if (sectors.length > 0) {
        filteredTickers = filteredTickers.filter(ticker =>
          sectors.includes(ticker.sector)
        )
      }

      // Simulate scan-specific filtering and generate mock results
      const mockResults = generateMockResults(filteredTickers, selectedScan)
      
      setScanResults(mockResults)
      setResultCount(mockResults.length)
    } catch (error) {
      console.error('Scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  // Generate mock scan results
  const generateMockResults = (tickers, scanType) => {
    // Randomly select 5-15 tickers and add mock data
    const shuffled = [...tickers].sort(() => 0.5 - Math.random())
    const count = Math.floor(Math.random() * 10) + 5
    
    return shuffled.slice(0, count).map(ticker => {
      const basePrice = 50 + Math.random() * 200
      const change = (Math.random() - 0.5) * 20
      const changePercent = (change / basePrice) * 100
      const volume = Math.floor(Math.random() * 10000000) + 1000000
      
      return {
        ...ticker,
        price: basePrice,
        change,
        changePercent,
        volume,
        signal: getScanSignal(scanType),
        strength: Math.floor(Math.random() * 5) + 1, // 1-5 strength rating
        lastUpdate: new Date().toLocaleTimeString()
      }
    })
  }

  // Get scan-specific signal description
  const getScanSignal = (scanType) => {
    const signals = {
      breakout: 'Breaking resistance at $X.XX',
      breakdown: 'Breaking support at $X.XX', 
      highVolume: 'Volume 300% above average',
      gapUp: 'Gap up 5.2% from previous close',
      gapDown: 'Gap down 4.8% from previous close',
      momentum: 'Strong upward momentum',
      oversold: 'RSI oversold, potential bounce',
      overbought: 'RSI overbought, potential pullback',
      earnings: 'Unusual pre-earnings activity',
      newHighs: 'New 52-week high',
      newLows: 'New 52-week low',
      unusual: 'Options volume spike 500%'
    }
    return signals[scanType] || 'Meeting scan criteria'
  }

  return (
    <div className="h-screen bg-trading-dark text-trading-text flex flex-col">
      {/* Header */}
      <div className="bg-trading-darker border-b border-trading-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-trading-text-dim hover:text-trading-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Chart</span>
          </button>
          <div className="h-6 w-px bg-trading-border"></div>
          <h1 className="text-xl font-bold text-trading-text-bright">Stock Scanner</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-trading-text-dim">
            {resultCount} results found
          </span>
          <button
            onClick={() => {/* Export functionality */}}
            className="flex items-center space-x-2 px-3 py-2 bg-trading-border text-trading-text rounded-lg hover:bg-opacity-70 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Scan Configuration */}
        <div className="w-80 bg-trading-darker border-r border-trading-border p-6 overflow-y-auto trading-scrollbar">
          <div className="space-y-6">
            {/* Scan Type Selection */}
            <div>
              <h3 className="text-lg font-semibold text-trading-text-bright mb-3">Scan Type</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto trading-scrollbar">
                {scanTypes.map(scan => {
                  const IconComponent = scan.icon
                  return (
                    <div
                      key={scan.id}
                      onClick={() => setSelectedScan(scan.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedScan === scan.id
                          ? 'border-trading-blue bg-trading-blue bg-opacity-20'
                          : 'border-trading-border hover:border-trading-border hover:bg-opacity-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${scan.color}`} />
                        <div className="flex-1">
                          <div className="font-medium text-trading-text-bright text-sm">
                            {scan.name}
                          </div>
                          <div className="text-xs text-trading-text-dim mt-1">
                            {scan.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Time Range */}
            <div>
              <h3 className="text-sm font-semibold text-trading-text-bright mb-2">Time Range</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full bg-trading-dark border border-trading-border rounded-lg px-3 py-2 text-trading-text focus:outline-none focus:border-trading-blue"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-trading-text-bright flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </h3>
              
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs text-trading-text-dim">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    placeholder="Min"
                    className="flex-1 bg-trading-dark border border-trading-border rounded px-3 py-1 text-sm text-trading-text focus:outline-none focus:border-trading-blue"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    placeholder="Max"
                    className="flex-1 bg-trading-dark border border-trading-border rounded px-3 py-1 text-sm text-trading-text focus:outline-none focus:border-trading-blue"
                  />
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="text-xs text-trading-text-dim">Minimum Volume</label>
                <input
                  type="number"
                  value={minVolume}
                  onChange={(e) => setMinVolume(Number(e.target.value))}
                  className="w-full mt-1 bg-trading-dark border border-trading-border rounded px-3 py-1 text-sm text-trading-text focus:outline-none focus:border-trading-blue"
                />
              </div>

              {/* Market Cap */}
              <div>
                <label className="text-xs text-trading-text-dim">Min Market Cap (M)</label>
                <input
                  type="number"
                  value={minMarketCap}
                  onChange={(e) => setMinMarketCap(Number(e.target.value))}
                  className="w-full mt-1 bg-trading-dark border border-trading-border rounded px-3 py-1 text-sm text-trading-text focus:outline-none focus:border-trading-blue"
                />
              </div>

              {/* Exchanges */}
              <div>
                <label className="text-xs text-trading-text-dim mb-2 block">Exchanges</label>
                <div className="space-y-1">
                  {availableExchanges.map(exchange => (
                    <label key={exchange} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exchanges.includes(exchange)}
                        onChange={() => handleExchangeChange(exchange)}
                        className="text-trading-blue"
                      />
                      <span className="text-sm text-trading-text">{exchange}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sectors */}
              <div>
                <label className="text-xs text-trading-text-dim mb-2 block">Sectors (Optional)</label>
                <div className="max-h-32 overflow-y-auto trading-scrollbar space-y-1">
                  {availableSectors.map(sector => (
                    <label key={sector} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sectors.includes(sector)}
                        onChange={() => handleSectorChange(sector)}
                        className="text-trading-blue"
                      />
                      <span className="text-sm text-trading-text">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Run Scan Button */}
            <button
              onClick={runScan}
              disabled={isScanning}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                isScanning
                  ? 'bg-trading-border text-trading-text-dim cursor-not-allowed'
                  : 'bg-trading-blue text-white hover:bg-blue-600'
              }`}
            >
              <Play className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Run Scan'}</span>
            </button>
          </div>
        </div>

        {/* Main Content - Results */}
        <div className="flex-1 p-6 overflow-y-auto trading-scrollbar">
          {scanResults.length === 0 && !isScanning && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 text-trading-text-dim mx-auto mb-4" />
                <h3 className="text-lg font-medium text-trading-text mb-2">
                  Ready to Scan
                </h3>
                <p className="text-trading-text-dim">
                  Configure your scan parameters and click "Run Scan" to find opportunities
                </p>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-trading-blue mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-trading-text mb-2">
                  Scanning Market...
                </h3>
                <p className="text-trading-text-dim">
                  Analyzing {getAllTickers().length} stocks with your criteria
                </p>
              </div>
            </div>
          )}

          {scanResults.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-trading-text-bright mb-2">
                  Scan Results
                </h2>
                <p className="text-trading-text-dim">
                  Found {resultCount} stocks matching your {scanTypes.find(s => s.id === selectedScan)?.name} criteria
                </p>
              </div>

              {/* Results Table */}
              <div className="bg-trading-darker rounded-lg border border-trading-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-trading-border bg-opacity-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Symbol
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Change
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Volume
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Signal
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-trading-text-dim uppercase tracking-wider">
                          Strength
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-trading-border">
                      {scanResults.map((result, index) => (
                        <tr key={result.symbol} className="hover:bg-trading-border hover:bg-opacity-30 cursor-pointer">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-semibold text-trading-text-bright">
                                {result.symbol}
                              </div>
                              <div className="text-sm text-trading-text-dim">
                                {result.exchange}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-trading-text-bright font-mono">
                              ${result.price.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`font-medium ${
                              result.change >= 0 ? 'text-trading-green' : 'text-trading-red'
                            }`}>
                              {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)}
                              <span className="ml-1">
                                ({result.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-trading-text">
                              {(result.volume / 1000000).toFixed(1)}M
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-trading-text">
                              {result.signal}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < result.strength ? 'bg-trading-green' : 'bg-trading-border'
                                  }`}
                                ></div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StockScanner