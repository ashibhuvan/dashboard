/**
 * Technical Indicators for Financial Charts
 * Optimized for TradingView Lightweight Charts
 */

export const calculateTechnicalIndicators = (ohlcData, indicatorType) => {
  if (!ohlcData || ohlcData.length === 0) return null

  switch (indicatorType) {
    case 'sma20':
      return calculateSMA(ohlcData, 20, '#ff6b6b', 'SMA(20)')
    
    case 'sma50':
      return calculateSMA(ohlcData, 50, '#4ecdc4', 'SMA(50)')
    
    case 'ema12':
      return calculateEMA(ohlcData, 12, '#45b7d1', 'EMA(12)')
    
    case 'ema26':
      return calculateEMA(ohlcData, 26, '#f39c12', 'EMA(26)')
    
    case 'bb':
      return calculateBollingerBands(ohlcData, 20, 2)
    
    case 'rsi':
      return calculateRSI(ohlcData, 14)
    
    case 'macd':
      return calculateMACD(ohlcData, 12, 26, 9)
    
    case 'vwap':
      return calculateVWAP(ohlcData)
    
    default:
      return null
  }
}

// Simple Moving Average
const calculateSMA = (data, period, color, name) => {
  if (data.length < period) return null

  const smaData = []
  
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, item) => acc + item.close, 0)
    const avg = sum / period
    
    smaData.push({
      time: data[i].time,
      value: parseFloat(avg.toFixed(2))
    })
  }
  
  return {
    name,
    color,
    data: smaData
  }
}

// Exponential Moving Average
const calculateEMA = (data, period, color, name) => {
  if (data.length < period) return null

  const multiplier = 2 / (period + 1)
  const emaData = []
  
  // Start with SMA for the first value
  let ema = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period
  
  for (let i = period - 1; i < data.length; i++) {
    if (i === period - 1) {
      ema = data.slice(0, period).reduce((acc, item) => acc + item.close, 0) / period
    } else {
      ema = (data[i].close * multiplier) + (ema * (1 - multiplier))
    }
    
    emaData.push({
      time: data[i].time,
      value: parseFloat(ema.toFixed(2))
    })
  }
  
  return {
    name,
    color,
    data: emaData
  }
}

// Bollinger Bands
const calculateBollingerBands = (data, period, multiplier) => {
  if (data.length < period) return null

  const upperBand = []
  const middleBand = []
  const lowerBand = []
  
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1)
    const sma = slice.reduce((acc, item) => acc + item.close, 0) / period
    
    const variance = slice.reduce((acc, item) => acc + Math.pow(item.close - sma, 2), 0) / period
    const stdDev = Math.sqrt(variance)
    
    const time = data[i].time
    
    upperBand.push({
      time,
      value: parseFloat((sma + (stdDev * multiplier)).toFixed(2))
    })
    
    middleBand.push({
      time,
      value: parseFloat(sma.toFixed(2))
    })
    
    lowerBand.push({
      time,
      value: parseFloat((sma - (stdDev * multiplier)).toFixed(2))
    })
  }
  
  return [
    {
      name: 'BB Upper',
      color: '#9b59b6',
      data: upperBand
    },
    {
      name: 'BB Middle',
      color: '#e74c3c',
      data: middleBand
    },
    {
      name: 'BB Lower',
      color: '#9b59b6',
      data: lowerBand
    }
  ]
}

// Relative Strength Index
const calculateRSI = (data, period) => {
  if (data.length < period + 1) return null

  const rsiData = []
  const changes = []
  
  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i - 1].close)
  }
  
  // Calculate initial averages
  let avgGain = 0
  let avgLoss = 0
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      avgGain += changes[i]
    } else {
      avgLoss += Math.abs(changes[i])
    }
  }
  
  avgGain /= period
  avgLoss /= period
  
  // Calculate RSI values
  for (let i = period; i < changes.length; i++) {
    const change = changes[i]
    
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period
    }
    
    const rs = avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    
    rsiData.push({
      time: data[i + 1].time,
      value: parseFloat(rsi.toFixed(2))
    })
  }
  
  return {
    name: 'RSI(14)',
    color: '#ff9500',
    data: rsiData
  }
}

// MACD (Moving Average Convergence Divergence)
const calculateMACD = (data, fastPeriod, slowPeriod, signalPeriod) => {
  if (data.length < slowPeriod) return null

  const fastEMA = calculateEMA(data, fastPeriod, '#00ff00', 'Fast EMA')
  const slowEMA = calculateEMA(data, slowPeriod, '#ff0000', 'Slow EMA')
  
  if (!fastEMA || !slowEMA) return null

  const macdLine = []
  const signalLine = []
  const histogram = []
  
  // Calculate MACD line
  const startIndex = slowPeriod - fastPeriod
  for (let i = startIndex; i < fastEMA.data.length; i++) {
    const macdValue = fastEMA.data[i].value - slowEMA.data[i - startIndex].value
    macdLine.push({
      time: fastEMA.data[i].time,
      value: parseFloat(macdValue.toFixed(4))
    })
  }
  
  // Calculate signal line (EMA of MACD line)
  if (macdLine.length >= signalPeriod) {
    const multiplier = 2 / (signalPeriod + 1)
    let signal = macdLine.slice(0, signalPeriod).reduce((acc, item) => acc + item.value, 0) / signalPeriod
    
    for (let i = signalPeriod - 1; i < macdLine.length; i++) {
      if (i === signalPeriod - 1) {
        signal = macdLine.slice(0, signalPeriod).reduce((acc, item) => acc + item.value, 0) / signalPeriod
      } else {
        signal = (macdLine[i].value * multiplier) + (signal * (1 - multiplier))
      }
      
      signalLine.push({
        time: macdLine[i].time,
        value: parseFloat(signal.toFixed(4))
      })
      
      // Calculate histogram (MACD - Signal)
      histogram.push({
        time: macdLine[i].time,
        value: parseFloat((macdLine[i].value - signal).toFixed(4))
      })
    }
  }
  
  return [
    {
      name: 'MACD',
      color: '#2196F3',
      data: macdLine
    },
    {
      name: 'Signal',
      color: '#FF5722',
      data: signalLine
    }
  ]
}

// Volume Weighted Average Price
const calculateVWAP = (data) => {
  if (data.length === 0) return null

  const vwapData = []
  let cumulativeVolume = 0
  let cumulativeVolumePrice = 0
  
  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
    const volume = data[i].volume || 1000000 // Default volume if not provided
    
    cumulativeVolumePrice += typicalPrice * volume
    cumulativeVolume += volume
    
    const vwap = cumulativeVolumePrice / cumulativeVolume
    
    vwapData.push({
      time: data[i].time,
      value: parseFloat(vwap.toFixed(2))
    })
  }
  
  return {
    name: 'VWAP',
    color: '#9c27b0',
    data: vwapData
  }
}

// Support and Resistance Levels
export const calculateSupportResistance = (data, lookback = 20) => {
  if (data.length < lookback) return { support: [], resistance: [] }

  const support = []
  const resistance = []
  
  for (let i = lookback; i < data.length - lookback; i++) {
    const window = data.slice(i - lookback, i + lookback + 1)
    const current = data[i]
    
    // Check for local minima (support)
    const isSupport = window.every(bar => bar.low >= current.low)
    if (isSupport) {
      support.push({
        time: current.time,
        price: current.low,
        strength: calculateLevelStrength(data, current.low, 'support')
      })
    }
    
    // Check for local maxima (resistance)
    const isResistance = window.every(bar => bar.high <= current.high)
    if (isResistance) {
      resistance.push({
        time: current.time,
        price: current.high,
        strength: calculateLevelStrength(data, current.high, 'resistance')
      })
    }
  }
  
  return { support, resistance }
}

const calculateLevelStrength = (data, price, type) => {
  // Simple strength calculation based on how many times price tested the level
  let touches = 0
  const tolerance = price * 0.005 // 0.5% tolerance
  
  for (const bar of data) {
    if (type === 'support' && Math.abs(bar.low - price) <= tolerance) {
      touches++
    } else if (type === 'resistance' && Math.abs(bar.high - price) <= tolerance) {
      touches++
    }
  }
  
  return Math.min(touches, 5) // Cap at 5 for visualization
}