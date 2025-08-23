import { useState, useEffect, useCallback } from 'react'
import { generateSampleData } from '../utils/dataGenerator'
import { fetchAlphaVantageData, fetchPolygonData } from '../services/marketDataAPI'
import { getApiConfig, validateApiConfig, DATA_SOURCES } from '../utils/apiConfig'

export const useMarketData = (symbol, timeframe) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!symbol) return

    setIsLoading(true)
    setError(null)

    try {
      const config = getApiConfig()

      let marketData

      switch (config.source) {
        case DATA_SOURCES.ALPHA_VANTAGE:
          marketData = await fetchAlphaVantageData(symbol, timeframe, config.apiKey)
          break
        
        case DATA_SOURCES.POLYGON:
          marketData = await fetchPolygonData(symbol, timeframe, config.apiKey)
          break
        
        default:
          // Generate realistic sample data
          marketData = generateSampleData(symbol, timeframe)
      }

      setData(marketData)
    } catch (err) {
      console.error('Error fetching market data:', err)
      setError(err)
      
      // Fallback to demo data on error
      try {
        console.log('Falling back to demo data...')
        const fallbackData = generateSampleData(symbol, timeframe)
        setData(fallbackData)
      } catch (fallbackErr) {
        setError(new Error('Failed to load market data'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [symbol, timeframe])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh for live data (only for demo data to avoid API limits)
  useEffect(() => {
    const config = getApiConfig()
    
    // Only enable auto-refresh for demo data to avoid hitting API limits
    if (config.source === DATA_SOURCES.DEMO) {
      console.log(`Setting up demo auto-refresh every ${config.updateInterval}ms`)
      const interval = setInterval(() => {
        fetchData()
      }, config.updateInterval)
      return () => {
        console.log('Clearing auto-refresh interval')
        clearInterval(interval)
      }
    }
  }, [symbol, timeframe]) // Only depend on symbol and timeframe changes

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch,
    config: getApiConfig()
  }
}