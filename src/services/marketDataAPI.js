/**
 * Market Data API Integration
 * Supports multiple providers: Alpha Vantage, Polygon.io, etc.
 */

// Alpha Vantage API Integration
export const fetchAlphaVantageData = async (symbol, timeframe, apiKey) => {
  if (!apiKey) {
    throw new Error('Alpha Vantage API key is required')
  }

  const functionMap = {
    '1m': 'TIME_SERIES_INTRADAY&interval=1min',
    '5m': 'TIME_SERIES_INTRADAY&interval=5min',
    '15m': 'TIME_SERIES_INTRADAY&interval=15min',
    '30m': 'TIME_SERIES_INTRADAY&interval=30min',
    '1h': 'TIME_SERIES_INTRADAY&interval=60min',
    '1D': 'TIME_SERIES_DAILY',
    '1W': 'TIME_SERIES_WEEKLY',
    '1M': 'TIME_SERIES_MONTHLY'
  }

  const func = functionMap[timeframe] || functionMap['1D']
  const url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data['Error Message']) {
      throw new Error(`Invalid symbol: ${symbol}`)
    }

    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }

    if (data['Information']) {
      throw new Error(data['Information'])
    }

    return formatAlphaVantageData(data, symbol, timeframe)
  } catch (error) {
    console.error('Alpha Vantage fetch error:', error)
    throw new Error(`Alpha Vantage API error: ${error.message}`)
  }
}

const formatAlphaVantageData = (data, symbol, timeframe) => {
  let timeSeries
  
  // Find the time series data key
  const keys = Object.keys(data)
  const timeSeriesKey = keys.find(key => key.includes('Time Series'))
  
  if (!timeSeriesKey) {
    throw new Error('No time series data found')
  }
  
  timeSeries = data[timeSeriesKey]
  
  if (!timeSeries) {
    throw new Error('No time series data available')
  }

  // Convert to OHLCV format
  const ohlcData = Object.keys(timeSeries)
    .sort()
    .map(dateStr => {
      const dayData = timeSeries[dateStr]
      return {
        time: Math.floor(new Date(dateStr).getTime() / 1000),
        open: parseFloat(dayData['1. open']),
        high: parseFloat(dayData['2. high']),
        low: parseFloat(dayData['3. low']),
        close: parseFloat(dayData['4. close']),
        volume: parseInt(dayData['5. volume'] || dayData['6. volume'] || 0)
      }
    })
    .filter(bar => !isNaN(bar.open)) // Filter out invalid data

  if (ohlcData.length === 0) {
    throw new Error('No valid OHLC data found')
  }

  // Calculate market statistics
  const lastBar = ohlcData[ohlcData.length - 1]
  const previousBar = ohlcData[ohlcData.length - 2]
  
  const change = previousBar ? lastBar.close - previousBar.close : 0
  const changePercent = previousBar ? (change / previousBar.close) * 100 : 0

  return {
    ohlc: ohlcData,
    symbol,
    timeframe,
    currentPrice: lastBar.close,
    change,
    changePercent,
    volume: lastBar.volume,
    high24h: Math.max(...ohlcData.slice(-24).map(d => d.high)),
    low24h: Math.min(...ohlcData.slice(-24).map(d => d.low)),
    lastUpdate: new Date().toISOString(),
  }
}

// Polygon.io API Integration
export const fetchPolygonData = async (symbol, timeframe, apiKey) => {
  if (!apiKey) {
    throw new Error('Polygon.io API key is required')
  }

  const timeframeMap = {
    '1m': { multiplier: 1, timespan: 'minute' },
    '5m': { multiplier: 5, timespan: 'minute' },
    '15m': { multiplier: 15, timespan: 'minute' },
    '30m': { multiplier: 30, timespan: 'minute' },
    '1h': { multiplier: 1, timespan: 'hour' },
    '1D': { multiplier: 1, timespan: 'day' },
    '1W': { multiplier: 1, timespan: 'week' },
    '1M': { multiplier: 1, timespan: 'month' }
  }

  const { multiplier, timespan } = timeframeMap[timeframe] || timeframeMap['1D']
  
  // Calculate date range
  const to = new Date()
  const from = new Date()
  from.setMonth(from.getMonth() - 3) // 3 months of data

  const fromStr = from.toISOString().split('T')[0]
  const toStr = to.toISOString().split('T')[0]

  const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${fromStr}/${toStr}?adjusted=true&sort=asc&limit=1000&apikey=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'ERROR') {
      throw new Error(data.error || 'Polygon API error')
    }

    if (!data.results || data.results.length === 0) {
      throw new Error(`No data available for ${symbol}`)
    }

    return formatPolygonData(data, symbol, timeframe)
  } catch (error) {
    throw new Error(`Polygon.io API error: ${error.message}`)
  }
}

const formatPolygonData = (data, symbol, timeframe) => {
  const ohlcData = data.results.map(bar => ({
    time: Math.floor(bar.t / 1000), // Convert from milliseconds to seconds
    open: parseFloat(bar.o.toFixed(2)),
    high: parseFloat(bar.h.toFixed(2)),
    low: parseFloat(bar.l.toFixed(2)),
    close: parseFloat(bar.c.toFixed(2)),
    volume: bar.v
  }))

  const lastBar = ohlcData[ohlcData.length - 1]
  const previousBar = ohlcData[ohlcData.length - 2]
  
  const change = previousBar ? lastBar.close - previousBar.close : 0
  const changePercent = previousBar ? (change / previousBar.close) * 100 : 0

  return {
    ohlc: ohlcData,
    symbol,
    timeframe,
    currentPrice: lastBar.close,
    change,
    changePercent,
    volume: lastBar.volume,
    high24h: Math.max(...ohlcData.slice(-24).map(d => d.high)),
    low24h: Math.min(...ohlcData.slice(-24).map(d => d.low)),
    lastUpdate: new Date().toISOString(),
  }
}

// Yahoo Finance API (free, but requires CORS proxy)
export const fetchYahooFinanceData = async (symbol, timeframe) => {
  const intervalMap = {
    '1m': '1m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1h': '1h',
    '1D': '1d',
    '1W': '1wk',
    '1M': '1mo'
  }

  const interval = intervalMap[timeframe] || '1d'
  const period = timeframe.includes('m') || timeframe === '1h' ? '1d' : '3mo'

  // Note: This requires a CORS proxy in production
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&period=${period}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.chart.error) {
      throw new Error(data.chart.error.description)
    }

    const result = data.chart.result[0]
    if (!result.timestamp) {
      throw new Error(`No data available for ${symbol}`)
    }

    return formatYahooFinanceData(result, symbol, timeframe)
  } catch (error) {
    throw new Error(`Yahoo Finance API error: ${error.message}`)
  }
}

const formatYahooFinanceData = (result, symbol, timeframe) => {
  const { timestamp, indicators } = result
  const quotes = indicators.quote[0]
  
  const ohlcData = timestamp.map((time, index) => ({
    time,
    open: parseFloat((quotes.open[index] || 0).toFixed(2)),
    high: parseFloat((quotes.high[index] || 0).toFixed(2)),
    low: parseFloat((quotes.low[index] || 0).toFixed(2)),
    close: parseFloat((quotes.close[index] || 0).toFixed(2)),
    volume: quotes.volume[index] || 0
  })).filter(bar => bar.open > 0) // Filter out invalid data

  const lastBar = ohlcData[ohlcData.length - 1]
  const previousBar = ohlcData[ohlcData.length - 2]
  
  const change = previousBar ? lastBar.close - previousBar.close : 0
  const changePercent = previousBar ? (change / previousBar.close) * 100 : 0

  return {
    ohlc: ohlcData,
    symbol,
    timeframe,
    currentPrice: lastBar.close,
    change,
    changePercent,
    volume: lastBar.volume,
    high24h: Math.max(...ohlcData.slice(-24).map(d => d.high)),
    low24h: Math.min(...ohlcData.slice(-24).map(d => d.low)),
    lastUpdate: new Date().toISOString(),
  }
}

// WebSocket connections for real-time data (placeholder for future implementation)
export const subscribeToRealtimeData = (symbol, callback) => {
  // This would implement WebSocket connections for real-time data
  // For now, we'll simulate with periodic updates
  console.log(`Subscribing to real-time data for ${symbol}`)
  
  const interval = setInterval(() => {
    // Simulate real-time price updates
    const mockUpdate = {
      symbol,
      price: 150 + Math.random() * 10,
      change: (Math.random() - 0.5) * 2,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: Date.now()
    }
    callback(mockUpdate)
  }, 1000)

  return () => clearInterval(interval) // Cleanup function
}