/**
 * Ticker Service
 * Handles loading, caching, and managing stock ticker data
 */

import { getAllTickers, searchTickers } from '../data/stockTickers'

class TickerService {
  constructor() {
    this.tickers = []
    this.isLoaded = false
    this.isLoading = false
    this.loadPromise = null
    this.searchCache = new Map()
    this.SEARCH_CACHE_SIZE = 100 // Limit cache size
  }

  /**
   * Initialize and load all ticker data
   * Returns a promise that resolves when data is loaded
   */
  async initialize() {
    if (this.isLoaded) {
      return this.tickers
    }

    if (this.isLoading) {
      return this.loadPromise
    }

    this.isLoading = true
    this.loadPromise = this._loadTickers()
    
    try {
      const result = await this.loadPromise
      this.isLoaded = true
      return result
    } catch (error) {
      console.error('Failed to initialize ticker service:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Private method to load ticker data
   */
  async _loadTickers() {
    try {
      // In a real app, this might fetch from an API
      // For now, we're using static data
      this.tickers = getAllTickers()
      
      console.log(`Loaded ${this.tickers.length} stock tickers`)
      return this.tickers
    } catch (error) {
      console.error('Error loading ticker data:', error)
      throw new Error('Failed to load stock ticker data')
    }
  }

  /**
   * Search tickers with caching
   */
  searchTickers(query, limit = 10) {
    if (!query || query.length < 1) {
      return []
    }

    const cacheKey = `${query.toLowerCase()}_${limit}`
    
    // Check cache first
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)
    }

    // Perform search
    const results = searchTickers(query, limit)
    
    // Cache results (with size limit)
    if (this.searchCache.size >= this.SEARCH_CACHE_SIZE) {
      // Remove oldest entries
      const firstKey = this.searchCache.keys().next().value
      this.searchCache.delete(firstKey)
    }
    
    this.searchCache.set(cacheKey, results)
    return results
  }

  /**
   * Get all loaded tickers
   */
  getAllTickers() {
    return this.tickers
  }

  /**
   * Check if service is loaded
   */
  isReady() {
    return this.isLoaded
  }

  /**
   * Get loading status
   */
  getLoadingStatus() {
    return {
      isLoading: this.isLoading,
      isLoaded: this.isLoaded,
      tickerCount: this.tickers.length
    }
  }

  /**
   * Clear search cache
   */
  clearSearchCache() {
    this.searchCache.clear()
  }

  /**
   * Get ticker by symbol
   */
  getTickerBySymbol(symbol) {
    if (!this.isLoaded) {
      return null
    }
    
    return this.tickers.find(ticker => 
      ticker.symbol.toUpperCase() === symbol.toUpperCase()
    )
  }

  /**
   * Get popular tickers (most commonly traded)
   */
  getPopularTickers(limit = 20) {
    // Return the first N tickers which are generally the most popular
    return this.tickers.slice(0, limit)
  }

  /**
   * Get tickers by sector
   */
  getTickersBySector(sector, limit = 50) {
    return this.tickers
      .filter(ticker => ticker.sector.toLowerCase().includes(sector.toLowerCase()))
      .slice(0, limit)
  }

  /**
   * Get tickers by exchange
   */
  getTickersByExchange(exchange, limit = 100) {
    return this.tickers
      .filter(ticker => ticker.exchange.toUpperCase() === exchange.toUpperCase())
      .slice(0, limit)
  }
}

// Create singleton instance
const tickerService = new TickerService()

// Auto-initialize on import (for immediate availability)
tickerService.initialize().catch(error => {
  console.warn('Ticker service auto-initialization failed:', error)
})

export default tickerService