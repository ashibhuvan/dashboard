/**
 * Generates realistic OHLCV data for financial charts
 * Optimized for trading scenarios with proper price movements and volume patterns
 */

export const generateSampleData = (symbol, timeframe) => {
  const now = new Date()
  const intervals = getIntervalConfig(timeframe)
  
  // Base price for different symbols (realistic starting points)
  const basePrices = {
    'AAPL': 150 + Math.random() * 50,
    'MSFT': 300 + Math.random() * 50,
    'GOOGL': 2500 + Math.random() * 200,
    'AMZN': 3100 + Math.random() * 200,
    'TSLA': 200 + Math.random() * 100,
    'NVDA': 400 + Math.random() * 100,
    'META': 300 + Math.random() * 50,
    'NFLX': 400 + Math.random() * 50,
    'default': 100 + Math.random() * 50
  }

  const basePrice = basePrices[symbol] || basePrices.default
  const data = []
  let currentPrice = basePrice

  // Generate realistic market data
  for (let i = intervals.count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervals.duration)
    
    // Create realistic OHLCV bar
    const bar = generateOHLCVBar(currentPrice, intervals.volatility, time)
    data.push(bar)
    
    currentPrice = bar.close // Update current price for next bar
  }

  // Calculate additional market data
  const lastBar = data[data.length - 1]
  const previousBar = data[data.length - 2]
  
  const change = lastBar.close - (previousBar?.close || lastBar.close)
  const changePercent = ((change / (previousBar?.close || lastBar.close)) * 100)

  return {
    ohlc: data,
    symbol,
    timeframe,
    currentPrice: lastBar.close,
    change,
    changePercent,
    volume: lastBar.volume,
    high24h: Math.max(...data.slice(-24).map(d => d.high)),
    low24h: Math.min(...data.slice(-24).map(d => d.low)),
    lastUpdate: now.toISOString(),
  }
}

const getIntervalConfig = (timeframe) => {
  const configs = {
    '1m': { duration: 60 * 1000, count: 300, volatility: 0.001 },      // 5 hours
    '5m': { duration: 5 * 60 * 1000, count: 288, volatility: 0.003 },  // 24 hours
    '15m': { duration: 15 * 60 * 1000, count: 192, volatility: 0.005 }, // 2 days
    '1h': { duration: 60 * 60 * 1000, count: 168, volatility: 0.01 },   // 1 week
    '4h': { duration: 4 * 60 * 60 * 1000, count: 180, volatility: 0.02 }, // 1 month
    '1D': { duration: 24 * 60 * 60 * 1000, count: 90, volatility: 0.025 }, // 3 months
    '1W': { duration: 7 * 24 * 60 * 60 * 1000, count: 104, volatility: 0.04 }, // 2 years
    '1M': { duration: 30 * 24 * 60 * 60 * 1000, count: 60, volatility: 0.06 }, // 5 years
  }

  return configs[timeframe] || configs['1D']
}

const generateOHLCVBar = (basePrice, volatility, time) => {
  // Generate realistic price movement with trend and noise
  const trend = (Math.random() - 0.5) * volatility * 0.5 // Small trend component
  const noise = (Math.random() - 0.5) * volatility // Random noise
  
  const priceChange = trend + noise
  
  // Calculate OHLC with realistic relationships
  const open = basePrice
  const close = open * (1 + priceChange)
  
  // High and low should make sense relative to open/close
  const maxOC = Math.max(open, close)
  const minOC = Math.min(open, close)
  
  const high = maxOC * (1 + Math.random() * volatility * 0.5)
  const low = minOC * (1 - Math.random() * volatility * 0.5)
  
  // Generate realistic volume (higher volume on bigger moves)
  const baseVolume = 1000000 + Math.random() * 5000000
  const volumeMultiplier = 1 + Math.abs(priceChange) * 10
  const volume = Math.floor(baseVolume * volumeMultiplier)

  return {
    time: Math.floor(time.getTime() / 1000), // Unix timestamp for TradingView
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
    volume
  }
}

// Generate real-time price updates for live trading simulation
export const generatePriceUpdate = (lastPrice) => {
  const volatility = 0.001 // 0.1% volatility per update
  const change = (Math.random() - 0.5) * volatility
  const newPrice = lastPrice * (1 + change)
  
  return {
    price: parseFloat(newPrice.toFixed(2)),
    change: parseFloat((newPrice - lastPrice).toFixed(2)),
    changePercent: parseFloat((change * 100).toFixed(3)),
    timestamp: Date.now()
  }
}

// Generate company information for different symbols
export const generateCompanyInfo = (symbol) => {
  const companies = {
    'AAPL': {
      name: 'Apple Inc.',
      sector: 'Technology',
      marketCap: '2.8T',
      peRatio: '28.5',
      dividend: '0.50%'
    },
    'MSFT': {
      name: 'Microsoft Corporation',
      sector: 'Technology',
      marketCap: '2.4T',
      peRatio: '32.1',
      dividend: '0.72%'
    },
    'GOOGL': {
      name: 'Alphabet Inc.',
      sector: 'Technology',
      marketCap: '1.7T',
      peRatio: '24.8',
      dividend: '0.00%'
    },
    'AMZN': {
      name: 'Amazon.com Inc.',
      sector: 'Consumer Discretionary',
      marketCap: '1.6T',
      peRatio: '58.3',
      dividend: '0.00%'
    },
    'TSLA': {
      name: 'Tesla Inc.',
      sector: 'Automotive',
      marketCap: '800B',
      peRatio: '45.2',
      dividend: '0.00%'
    },
    'NVDA': {
      name: 'NVIDIA Corporation',
      sector: 'Technology',
      marketCap: '1.2T',
      peRatio: '65.4',
      dividend: '0.16%'
    },
    'META': {
      name: 'Meta Platforms Inc.',
      sector: 'Technology',
      marketCap: '900B',
      peRatio: '23.7',
      dividend: '0.00%'
    },
    'NFLX': {
      name: 'Netflix Inc.',
      sector: 'Communication Services',
      marketCap: '200B',
      peRatio: '42.1',
      dividend: '0.00%'
    }
  }

  return companies[symbol] || {
    name: `${symbol} Corporation`,
    sector: 'Unknown',
    marketCap: 'N/A',
    peRatio: 'N/A',
    dividend: 'N/A'
  }
}