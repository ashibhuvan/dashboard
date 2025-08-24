import React, { useState, useEffect, useRef } from 'react'
import { Search, TrendingUp, Loader } from 'lucide-react'
import tickerService from '../services/tickerService'

const TickerAutocomplete = ({ 
  value = '', 
  onChange, 
  onSelect, 
  placeholder = 'Search stocks...', 
  className = '',
  showIcon = true 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [inputValue, setInputValue] = useState(value)
  const [isServiceLoading, setIsServiceLoading] = useState(!tickerService.isReady())
  
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Initialize ticker service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsServiceLoading(true)
        await tickerService.initialize()
        setIsServiceLoading(false)
      } catch (error) {
        console.error('Failed to initialize ticker service:', error)
        setIsServiceLoading(false)
      }
    }

    if (!tickerService.isReady()) {
      initializeService()
    }
  }, [])

  // Handle search
  useEffect(() => {
    if (!tickerService.isReady()) {
      setSearchResults([])
      setIsOpen(false)
      return
    }

    if (inputValue.trim().length > 0) {
      const results = tickerService.searchTickers(inputValue, 8)
      setSearchResults(results)
      setIsOpen(results.length > 0)
      setHighlightedIndex(-1)
    } else {
      setSearchResults([])
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }, [inputValue, isServiceLoading])

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  // Handle selection
  const handleSelect = (ticker) => {
    setInputValue(ticker.symbol)
    setIsOpen(false)
    setHighlightedIndex(-1)
    if (onSelect) {
      onSelect(ticker)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
          handleSelect(searchResults[highlightedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          listRef.current && !listRef.current.contains(event.target)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex]
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest'
        })
      }
    }
  }, [highlightedIndex])

  return (
    <div className={`relative ${className}`}>
      {/* Input Field */}
      <div className="relative">
        {showIcon && !isServiceLoading && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-trading-text-dim" />
        )}
        {showIcon && isServiceLoading && (
          <Loader className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-trading-blue animate-spin" />
        )}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) {
              setIsOpen(true)
            }
          }}
          placeholder={isServiceLoading ? 'Loading stocks...' : placeholder}
          disabled={isServiceLoading}
          className={`
            w-full bg-trading-darker border border-trading-border rounded-lg px-3 py-2.5 
            text-trading-text placeholder-trading-text-dim
            focus:outline-none focus:border-trading-blue focus:ring-1 focus:ring-trading-blue
            transition-colors duration-200
            ${showIcon ? 'pl-10' : 'pl-3'}
            ${isServiceLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          autoComplete="off"
          spellCheck="false"
        />
      </div>

      {/* Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div 
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 bg-trading-darker border border-trading-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto trading-scrollbar"
        >
          {searchResults.map((ticker, index) => (
            <div
              key={ticker.symbol}
              onClick={() => handleSelect(ticker)}
              className={`
                flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-150
                hover:bg-trading-border hover:bg-opacity-50
                ${highlightedIndex === index ? 'bg-trading-blue bg-opacity-20' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-trading-blue bg-opacity-20 rounded-full">
                  <TrendingUp className="w-4 h-4 text-trading-blue" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-trading-text-bright">
                      {ticker.symbol}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 bg-trading-border rounded text-trading-text-dim">
                      {ticker.exchange}
                    </span>
                  </div>
                  <span className="text-sm text-trading-text-dim truncate max-w-xs">
                    {ticker.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-trading-text-dim">
                  {ticker.sector}
                </div>
              </div>
            </div>
          ))}
          
          {/* Show "Press Enter to select" hint */}
          {highlightedIndex >= 0 && (
            <div className="px-4 py-2 border-t border-trading-border bg-trading-dark bg-opacity-50">
              <div className="text-xs text-trading-text-dim text-center">
                Press Enter to select • ↑↓ to navigate • Esc to close
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results message */}
      {isOpen && searchResults.length === 0 && inputValue.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-trading-darker border border-trading-border rounded-lg shadow-lg z-50">
          <div className="px-4 py-6 text-center text-trading-text-dim">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-sm">No stocks found for "{inputValue}"</div>
            <div className="text-xs mt-1 opacity-75">Try searching by symbol or company name</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TickerAutocomplete