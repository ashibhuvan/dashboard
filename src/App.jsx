import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import TradingChart from './components/TradingChart'
import MarketInfo from './components/MarketInfo'
import TopBar from './components/TopBar'

function App() {
  const [currentSymbol, setCurrentSymbol] = useState('AAPL')
  const [timeframe, setTimeframe] = useState('1D')
  const [chartType, setChartType] = useState('candlestick')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeIndicators, setActiveIndicators] = useState(new Set())

  const handleSymbolChange = (symbol) => {
    setCurrentSymbol(symbol.toUpperCase())
  }

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf)
  }

  const handleChartTypeChange = (type) => {
    setChartType(type)
  }

  const toggleIndicator = (indicator) => {
    const newIndicators = new Set(activeIndicators)
    if (newIndicators.has(indicator)) {
      newIndicators.delete(indicator)
    } else {
      newIndicators.add(indicator)
    }
    setActiveIndicators(newIndicators)
  }

  return (
    <div className="flex h-screen w-screen bg-trading-dark">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeIndicators={activeIndicators}
        onToggleIndicator={toggleIndicator}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <TopBar
          currentSymbol={currentSymbol}
          onSymbolChange={handleSymbolChange}
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
          chartType={chartType}
          onChartTypeChange={handleChartTypeChange}
        />

        {/* Chart and market info */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Chart */}
          <div className="flex-1 p-4 min-h-0">
            <TradingChart
              symbol={currentSymbol}
              timeframe={timeframe}
              chartType={chartType}
              activeIndicators={activeIndicators}
            />
          </div>

          {/* Market info panel */}
          <div className="w-full lg:w-80 lg:border-l border-t lg:border-t-0 border-trading-border lg:max-h-full max-h-96 lg:min-h-0">
            <MarketInfo symbol={currentSymbol} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App