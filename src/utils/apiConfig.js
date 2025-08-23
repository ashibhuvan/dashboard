/**
 * API Configuration Utility
 * Manages data sources and API keys for market data
 */

export const DATA_SOURCES = {
  DEMO: 'demo',
  ALPHA_VANTAGE: 'alphavantage',
  POLYGON: 'polygon',
  YAHOO: 'yahoo'
}

export const getApiConfig = () => {
  // Environment variables take precedence
  const envSource = import.meta.env.VITE_DATA_SOURCE
  const envAlphaKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
  const envPolygonKey = import.meta.env.VITE_POLYGON_API_KEY
  const envUpdateInterval = parseInt(import.meta.env.VITE_UPDATE_INTERVAL) || 60000

  if (envSource && envSource !== 'demo') {
    return {
      source: envSource === 'alpha_vantage' ? DATA_SOURCES.ALPHA_VANTAGE : envSource,
      apiKey: envSource === 'alpha_vantage' ? envAlphaKey : envPolygonKey,
      enableLiveUpdates: true,
      updateInterval: envUpdateInterval
    }
  }

  // Fallback to localStorage
  try {
    const config = localStorage.getItem('tradingDashboardConfig')
    if (config) {
      const parsed = JSON.parse(config)
      return {
        source: parsed.source || DATA_SOURCES.DEMO,
        apiKey: parsed.apiKey,
        enableLiveUpdates: parsed.enableLiveUpdates || false,
        updateInterval: parsed.updateFrequency ? parsed.updateFrequency * 1000 : 60000
      }
    }
  } catch (error) {
    console.warn('Error reading API config from localStorage:', error)
  }

  // Default demo configuration
  return {
    source: DATA_SOURCES.DEMO,
    apiKey: null,
    enableLiveUpdates: true,
    updateInterval: 30000 // Demo data updates every 30 seconds
  }
}

export const validateApiConfig = (config) => {
  if (!config.source) {
    throw new Error('Data source not specified')
  }

  if (config.source !== DATA_SOURCES.DEMO && !config.apiKey) {
    throw new Error(`API key required for ${config.source}`)
  }

  if (config.source === DATA_SOURCES.ALPHA_VANTAGE && config.apiKey === 'demo') {
    console.warn('Using demo Alpha Vantage key - get your free key at https://www.alphavantage.co/support/#api-key')
  }

  return true
}

export const getDataSourceInfo = (source) => {
  const info = {
    [DATA_SOURCES.DEMO]: {
      name: 'Demo Data',
      description: 'Realistic sample data for testing',
      features: ['Historical data', 'Real-time simulation'],
      limitations: ['Not real market data'],
      cost: 'Free',
      supportsOptions: false
    },
    [DATA_SOURCES.ALPHA_VANTAGE]: {
      name: 'Alpha Vantage',
      description: 'Professional financial data API',
      features: ['Real-time quotes', 'Historical data', 'Technical indicators', 'Options data*'],
      limitations: ['25 requests/day (free)', 'Options data in premium tier'],
      cost: 'Free tier available',
      supportsOptions: true,
      signupUrl: 'https://www.alphavantage.co/support/#api-key'
    },
    [DATA_SOURCES.POLYGON]: {
      name: 'Polygon.io',
      description: 'High-quality market data API',
      features: ['Real-time data', 'Options chains', 'WebSocket streams'],
      limitations: ['5 calls/minute (free)', 'Premium features require paid plan'],
      cost: 'Free tier available',
      supportsOptions: true,
      signupUrl: 'https://polygon.io'
    },
    [DATA_SOURCES.YAHOO]: {
      name: 'Yahoo Finance (Unofficial)',
      description: 'Free but unofficial scraping-based data',
      features: ['Basic stock data'],
      limitations: ['Unofficial', 'May break anytime', 'CORS issues'],
      cost: 'Free',
      supportsOptions: false
    }
  }

  return info[source] || info[DATA_SOURCES.DEMO]
}

// Rate limiting utility
const rateLimitStore = new Map()

export const checkRateLimit = (source, apiKey) => {
  const key = `${source}_${apiKey || 'default'}`
  const now = Date.now()
  const limits = {
    [DATA_SOURCES.ALPHA_VANTAGE]: { requests: 25, window: 24 * 60 * 60 * 1000 }, // 25 per day
    [DATA_SOURCES.POLYGON]: { requests: 300, window: 60 * 1000 }, // 5 per minute (300 per hour)
    [DATA_SOURCES.DEMO]: { requests: 1000, window: 60 * 1000 } // No real limit for demo
  }

  const limit = limits[source] || limits[DATA_SOURCES.DEMO]
  const usage = rateLimitStore.get(key) || { count: 0, windowStart: now }

  // Reset window if expired
  if (now - usage.windowStart > limit.window) {
    usage.count = 0
    usage.windowStart = now
  }

  if (usage.count >= limit.requests) {
    const resetTime = new Date(usage.windowStart + limit.window)
    throw new Error(`Rate limit exceeded for ${source}. Resets at ${resetTime.toLocaleTimeString()}`)
  }

  usage.count++
  rateLimitStore.set(key, usage)
  
  return {
    remaining: limit.requests - usage.count,
    resetTime: new Date(usage.windowStart + limit.window)
  }
}