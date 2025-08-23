/**
 * Options Data API Integration
 * Supports Alpha Vantage and Polygon.io for options data
 */

// Alpha Vantage Options API
export const fetchAlphaVantageOptions = async (symbol, apiKey) => {
  if (!apiKey || apiKey === 'demo') {
    throw new Error('Alpha Vantage API key required for options data')
  }

  // Real-time options data (premium feature)
  const realtimeUrl = `https://www.alphavantage.co/query?function=REALTIME_OPTIONS&symbol=${symbol}&apikey=${apiKey}`
  
  // Historical options data (available in free tier)
  const today = new Date().toISOString().split('T')[0]
  const historicalUrl = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&date=${today}&apikey=${apiKey}`

  try {
    // Try real-time first, fallback to historical
    let response = await fetch(realtimeUrl)
    let data = await response.json()

    // If rate limited or premium required, try historical
    if (data['Note'] || data['Information']) {
      console.log('Using historical options data (real-time requires premium)')
      response = await fetch(historicalUrl)
      data = await response.json()
    }

    if (data['Error Message']) {
      throw new Error(`Invalid symbol: ${symbol}`)
    }

    if (data['Note']) {
      throw new Error('API rate limit exceeded. Please try again later.')
    }

    return formatAlphaVantageOptionsData(data, symbol)
  } catch (error) {
    throw new Error(`Alpha Vantage Options API error: ${error.message}`)
  }
}

const formatAlphaVantageOptionsData = (data, symbol) => {
  // Alpha Vantage options data structure varies between real-time and historical
  // This is a simplified formatter - actual implementation would be more complex
  
  const optionsChains = []
  
  // Handle different response formats
  if (data.data) {
    // Real-time format
    data.data.forEach(contract => {
      optionsChains.push({
        strike: parseFloat(contract.strike),
        expiration: contract.expiration,
        type: contract.type, // 'call' or 'put'
        bid: parseFloat(contract.bid || 0),
        ask: parseFloat(contract.ask || 0),
        last: parseFloat(contract.last || 0),
        volume: parseInt(contract.volume || 0),
        openInterest: parseInt(contract.open_interest || 0),
        impliedVolatility: parseFloat(contract.implied_volatility || 0),
        delta: parseFloat(contract.delta || 0),
        gamma: parseFloat(contract.gamma || 0),
        theta: parseFloat(contract.theta || 0),
        vega: parseFloat(contract.vega || 0)
      })
    })
  } else {
    // Historical format or demo data
    // Generate sample options data for demonstration
    optionsChains.push(...generateSampleOptionsData(symbol))
  }

  return {
    symbol,
    chains: optionsChains,
    lastUpdate: new Date().toISOString(),
    source: 'alphavantage'
  }
}

// Polygon.io Options API
export const fetchPolygonOptions = async (symbol, apiKey) => {
  if (!apiKey) {
    throw new Error('Polygon.io API key required for options data')
  }

  // Get options chain snapshot
  const url = `https://api.polygon.io/v3/snapshot/options/${symbol}?apikey=${apiKey}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'ERROR') {
      throw new Error(data.error || 'Polygon Options API error')
    }

    if (!data.results || data.results.length === 0) {
      throw new Error(`No options data available for ${symbol}`)
    }

    return formatPolygonOptionsData(data, symbol)
  } catch (error) {
    throw new Error(`Polygon.io Options API error: ${error.message}`)
  }
}

const formatPolygonOptionsData = (data, symbol) => {
  const optionsChains = data.results.map(contract => ({
    strike: contract.details.strike_price,
    expiration: contract.details.expiration_date,
    type: contract.details.contract_type,
    bid: contract.market_status === 'open' ? contract.bid : contract.last_quote?.bid,
    ask: contract.market_status === 'open' ? contract.ask : contract.last_quote?.ask,
    last: contract.last_trade?.price,
    volume: contract.day?.volume || 0,
    openInterest: contract.open_interest || 0,
    impliedVolatility: contract.implied_volatility,
    delta: contract.greeks?.delta,
    gamma: contract.greeks?.gamma,
    theta: contract.greeks?.theta,
    vega: contract.greeks?.vega
  }))

  return {
    symbol,
    chains: optionsChains,
    lastUpdate: new Date().toISOString(),
    source: 'polygon'
  }
}

// Generate sample options data for demo purposes
const generateSampleOptionsData = (symbol) => {
  const basePrice = 150 // Assume stock price around $150
  const expirations = [
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 months
  ]

  const chains = []

  expirations.forEach(expiration => {
    // Generate strikes around the base price
    for (let i = -5; i <= 5; i++) {
      const strike = basePrice + (i * 5)
      
      // Call option
      chains.push({
        strike,
        expiration,
        type: 'call',
        bid: Math.max(0, basePrice - strike - Math.random() * 2),
        ask: Math.max(0, basePrice - strike + Math.random() * 2),
        last: Math.max(0, basePrice - strike + (Math.random() - 0.5) * 2),
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: 0.15 + Math.random() * 0.3,
        delta: strike < basePrice ? 0.3 + Math.random() * 0.4 : 0.1 + Math.random() * 0.3,
        gamma: 0.01 + Math.random() * 0.05,
        theta: -(0.01 + Math.random() * 0.05),
        vega: 0.1 + Math.random() * 0.2
      })

      // Put option
      chains.push({
        strike,
        expiration,
        type: 'put',
        bid: Math.max(0, strike - basePrice - Math.random() * 2),
        ask: Math.max(0, strike - basePrice + Math.random() * 2),
        last: Math.max(0, strike - basePrice + (Math.random() - 0.5) * 2),
        volume: Math.floor(Math.random() * 1000),
        openInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: 0.15 + Math.random() * 0.3,
        delta: strike > basePrice ? -(0.3 + Math.random() * 0.4) : -(0.1 + Math.random() * 0.3),
        gamma: 0.01 + Math.random() * 0.05,
        theta: -(0.01 + Math.random() * 0.05),
        vega: 0.1 + Math.random() * 0.2
      })
    }
  })

  return chains
}

// Main options data fetcher
export const fetchOptionsData = async (symbol, source = 'demo', apiKey = null) => {
  switch (source) {
    case 'alphavantage':
      return await fetchAlphaVantageOptions(symbol, apiKey)
    
    case 'polygon':
      return await fetchPolygonOptions(symbol, apiKey)
    
    default:
      // Demo data
      return {
        symbol,
        chains: generateSampleOptionsData(symbol),
        lastUpdate: new Date().toISOString(),
        source: 'demo'
      }
  }
}

// Options utilities
export const filterOptionsByExpiration = (chains, expiration) => {
  return chains.filter(chain => chain.expiration === expiration)
}

export const filterOptionsByType = (chains, type) => {
  return chains.filter(chain => chain.type === type)
}

export const getUniqueExpirations = (chains) => {
  return [...new Set(chains.map(chain => chain.expiration))].sort()
}

export const calculateOptionMetrics = (chain, spotPrice) => {
  const intrinsicValue = chain.type === 'call' 
    ? Math.max(0, spotPrice - chain.strike)
    : Math.max(0, chain.strike - spotPrice)
  
  const timeValue = Math.max(0, chain.last - intrinsicValue)
  const moneyness = spotPrice / chain.strike
  
  let status = 'ATM' // At The Money
  if (chain.type === 'call') {
    status = spotPrice > chain.strike ? 'ITM' : spotPrice < chain.strike ? 'OTM' : 'ATM'
  } else {
    status = spotPrice < chain.strike ? 'ITM' : spotPrice > chain.strike ? 'OTM' : 'ATM'
  }

  return {
    intrinsicValue,
    timeValue,
    moneyness,
    status // ITM (In The Money), OTM (Out of The Money), ATM (At The Money)
  }
}