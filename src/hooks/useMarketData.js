import { useState, useEffect, useCallback } from 'react'
import { generateSampleData } from '../utils/dataGenerator'
import { fetchAlphaVantageData, fetchPolygonData } from '../services/marketDataAPI'

export const useMarketData = (symbol, timeframe) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get data source from localStorage
  const getDataSource = useCallback(() => {
    try {
      const config = localStorage.getItem('tradingDashboardConfig')
      return config ? JSON.parse(config) : { source: 'demo' }
    } catch {
      return { source: 'demo' }
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (!symbol) return

    setIsLoading(true)
    setError(null)

    try {
      const config = getDataSource()
      let marketData

      switch (config.source) {
        case 'alphavantage':
          marketData = await fetchAlphaVantageData(symbol, timeframe, config.apiKey)
          break
        
        case 'polygon':
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
        const fallbackData = generateSampleData(symbol, timeframe)
        setData(fallbackData)
      } catch (fallbackErr) {
        setError(new Error('Failed to load market data'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [symbol, timeframe, getDataSource])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh for live data (every 30 seconds for demo, configurable for real APIs)
  useEffect(() => {
    const config = getDataSource()
    
    if (config.source === 'demo' || config.enableLiveUpdates) {
      const interval = setInterval(fetchData, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [fetchData, getDataSource])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch,
  }
}