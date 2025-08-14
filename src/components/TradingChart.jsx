import React, { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import { useMarketData } from '../hooks/useMarketData'
import { calculateTechnicalIndicators } from '../utils/technicalIndicators'

const TradingChart = ({ symbol, timeframe, chartType, activeIndicators }) => {
  const chartContainerRef = useRef()
  const chartRef = useRef()
  const candlestickSeriesRef = useRef()
  const volumeSeriesRef = useRef()
  const indicatorSeriesRef = useRef({})
  const [isLoading, setIsLoading] = useState(true)

  const { data, isLoading: dataLoading, error } = useMarketData(symbol, timeframe)

  // Chart theme optimized for traders
  const chartOptions = {
    layout: {
      background: { type: ColorType.Solid, color: '#131722' },
      textColor: '#e1e5e9',
      fontSize: 12,
      fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    },
    grid: {
      vertLines: { color: '#2a2e39', style: 1, visible: true },
      horzLines: { color: '#2a2e39', style: 1, visible: true },
    },
    crosshair: {
      mode: 1, // Normal crosshair
      vertLine: {
        color: '#2962ff',
        width: 1,
        style: 3, // Dashed
        labelBackgroundColor: '#2962ff',
      },
      horzLine: {
        color: '#2962ff',
        width: 1,
        style: 3, // Dashed
        labelBackgroundColor: '#2962ff',
      },
    },
    rightPriceScale: {
      borderColor: '#2a2e39',
      textColor: '#e1e5e9',
      entireTextOnly: true,
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
    },
    timeScale: {
      borderColor: '#2a2e39',
      textColor: '#e1e5e9',
      timeVisible: true,
      secondsVisible: false,
      rightOffset: 12,
      barSpacing: 12,
      minBarSpacing: 8,
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: true,
    },
    handleScale: {
      axisPressedMouseMove: {
        time: true,
        price: true,
      },
      axisDoubleClickReset: {
        time: true,
        price: true,
      },
      mouseWheel: true,
      pinch: true,
    },
  }

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    })

    chartRef.current = chart

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    candlestickSeriesRef.current = candlestickSeries

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#ffc107',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
    })

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    })

    volumeSeriesRef.current = volumeSeries

    // Handle resize
    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
    }
  }, [])

  // Update chart data
  useEffect(() => {
    if (!data || !chartRef.current || !candlestickSeriesRef.current || !volumeSeriesRef.current) return

    setIsLoading(true)

    try {
      // Set candlestick data
      candlestickSeriesRef.current.setData(data.ohlc)
      
      // Set volume data
      const volumeData = data.ohlc.map(item => ({
        time: item.time,
        value: item.volume || 0,
        color: item.close >= item.open ? '#26a69a66' : '#ef535066'
      }))
      
      volumeSeriesRef.current.setData(volumeData)

      // Fit content with some padding
      setTimeout(() => {
        chartRef.current.timeScale().fitContent()
        setIsLoading(false)
      }, 100)

    } catch (error) {
      console.error('Error updating chart data:', error)
      setIsLoading(false)
    }
  }, [data])

  // Update technical indicators
  useEffect(() => {
    if (!data || !chartRef.current) return

    // Remove existing indicator series
    Object.values(indicatorSeriesRef.current).forEach(series => {
      try {
        chartRef.current.removeSeries(series)
      } catch (e) {
        // Series might already be removed
      }
    })
    indicatorSeriesRef.current = {}

    // Add active indicators
    activeIndicators.forEach(indicator => {
      const indicatorData = calculateTechnicalIndicators(data.ohlc, indicator)
      
      if (indicatorData) {
        if (Array.isArray(indicatorData)) {
          // Multiple series (e.g., Bollinger Bands)
          indicatorData.forEach((series, index) => {
            const lineSeries = chartRef.current.addLineSeries({
              color: series.color,
              lineWidth: 1.5,
              lineType: 0, // Simple line
              title: series.name,
              priceLineVisible: false,
              lastValueVisible: false,
            })
            lineSeries.setData(series.data)
            indicatorSeriesRef.current[`${indicator}_${index}`] = lineSeries
          })
        } else {
          // Single series
          const lineSeries = chartRef.current.addLineSeries({
            color: indicatorData.color,
            lineWidth: 2,
            lineType: 0, // Simple line
            title: indicatorData.name,
            priceLineVisible: false,
            lastValueVisible: false,
          })
          lineSeries.setData(indicatorData.data)
          indicatorSeriesRef.current[indicator] = lineSeries
        }
      }
    })
  }, [data, activeIndicators])

  // Chart type switching (future enhancement for line charts, etc.)
  useEffect(() => {
    if (!candlestickSeriesRef.current) return
    
    // For now, we're using candlestick as the primary type
    // Future: implement line chart, OHLC bar chart switching
  }, [chartType])

  if (error) {
    return (
      <div className="chart-container bg-trading-darker rounded-lg border border-trading-border flex items-center justify-center">
        <div className="text-center">
          <div className="text-trading-red mb-2">⚠️ Chart Error</div>
          <div className="text-sm text-trading-text-dim">{error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container bg-trading-darker rounded-lg border border-trading-border relative overflow-hidden">
      {/* Loading overlay */}
      {(isLoading || dataLoading) && (
        <div className="absolute inset-0 bg-trading-darker bg-opacity-80 flex items-center justify-center z-10">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-trading-blue"></div>
            <span className="text-trading-text-dim">Loading {symbol} data...</span>
          </div>
        </div>
      )}

      {/* Chart controls overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-4">
        <div className="bg-trading-darker bg-opacity-90 rounded-lg px-3 py-1.5 border border-trading-border">
          <span className="text-trading-text-bright font-semibold text-lg">{symbol}</span>
        </div>
        
        {data && data.ohlc.length > 0 && (
          <div className="bg-trading-darker bg-opacity-90 rounded-lg px-3 py-1.5 border border-trading-border">
            <span className="text-xs text-trading-text-dim">Last: </span>
            <span className="text-sm text-trading-text-bright font-mono">
              ${data.ohlc[data.ohlc.length - 1]?.close?.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Chart container */}
      <div 
        ref={chartContainerRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Chart info overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-trading-darker bg-opacity-90 rounded-lg px-3 py-1.5 border border-trading-border">
          <div className="flex items-center space-x-2 text-xs text-trading-text-dim">
            <span>🔍 Scroll to zoom</span>
            <span>•</span>
            <span>🖱️ Drag to pan</span>
            <span>•</span>
            <span>Double-click to reset</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradingChart