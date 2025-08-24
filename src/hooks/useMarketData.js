import { useState, useEffect, useCallback } from 'react'
import { generateSampleData } from '../utils/dataGenerator'
import { fetchAlphaVantageData, fetchPolygonData } from '../services/marketDataAPI'
import { getApiConfig, validateApiConfig, DATA_SOURCES } from '../utils/apiConfig'

// Simple cache for market data
const dataCache = new Map()
const loadingPromises = new Map()
const CACHE_DURATION = 60000 // 1 minute

export const useMarketData = (symbol, timeframe) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const cacheKey = `${symbol}_${timeframe}`

  const fetchData = useCallback(async () => {
    if (!symbol) return

    // Check cache first
    const cached = dataCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data)
      setError(cached.error)
      setIsLoading(false)
      return
    }

    // Check if already loading to prevent duplicate requests
    const existingPromise = loadingPromises.get(cacheKey)
    if (existingPromise) {
      try {
        const result = await existingPromise
        setData(result.data)
        setError(result.error)
        setIsLoading(false)
        return
      } catch (err) {
        setError(err)
        setIsLoading(false)
        return
      }
    }

    setIsLoading(true)
    setError(null)

    // Create promise for this fetch
    const fetchPromise = (async () => {
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

        // Cache the successful result
        const result = {
          data: marketData,
          error: null,
          timestamp: Date.now()
        }
        dataCache.set(cacheKey, result)
        
        return result
      } catch (err) {
        console.error('Error fetching market data:', err)
        
        // Fallback to demo data on error
        try {
          console.log('Falling back to demo data...')
          const fallbackData = generateSampleData(symbol, timeframe)
          
          // Cache the fallback data
          const result = {
            data: fallbackData,
            error: null,
            timestamp: Date.now()
          }
          dataCache.set(cacheKey, result)
          
          return result
        } catch (fallbackErr) {
          const finalError = new Error('Failed to load market data')
          
          // Cache the error
          const result = {
            data: null,
            error: finalError,
            timestamp: Date.now()
          }
          dataCache.set(cacheKey, result)
          
          return result
        }
      } finally {
        loadingPromises.delete(cacheKey)
      }
    })()

    loadingPromises.set(cacheKey, fetchPromise)

    try {
      const result = await fetchPromise
      setData(result.data)
      setError(result.error)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [symbol, timeframe, cacheKey])

  // Initial data fetch
  useEffect(() => {
    // Check cache immediately to set initial state
    const cached = dataCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data)
      setError(cached.error)
      setIsLoading(false)
    } else {
      fetchData()
    }
  }, [fetchData, cacheKey])

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