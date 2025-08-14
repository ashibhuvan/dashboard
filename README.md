# Professional Trading Dashboard

A high-performance React trading dashboard built with TradingView's Lightweight Charts library. Designed for professional traders with advanced charting capabilities, technical indicators, and real-time data integration.

## 🚀 Features

### Interactive Charting
- **TradingView Lightweight Charts** - Industry-standard charting library
- **Multiple Chart Types** - Candlestick, Line, Area, OHLC
- **Interactive Controls** - Zoom, pan, crosshair, double-click reset
- **Professional Styling** - Dark theme optimized for trading

### Technical Analysis
- **Moving Averages** - SMA(20), SMA(50), EMA(12), EMA(26)
- **Bollinger Bands** - Volatility analysis
- **RSI** - Relative Strength Index
- **MACD** - Moving Average Convergence Divergence
- **VWAP** - Volume Weighted Average Price
- **Volume Analysis** - Trading volume visualization

### Data Integration
- **Demo Mode** - Realistic sample data for testing
- **Alpha Vantage** - Professional financial data API
- **Polygon.io** - Real-time and historical market data
- **Yahoo Finance** - Free financial data (limited)
- **Real-time Updates** - Configurable live data refresh

### Trading Tools
- **Symbol Search** - Quick symbol lookup and switching
- **Timeframe Selection** - 1m, 5m, 15m, 1h, 4h, 1D, 1W, 1M
- **Watchlist** - Track multiple symbols
- **Price Alerts** - Set price notifications
- **Research Tools** - News, earnings, analyst ratings
- **Backtesting** - Strategy testing engine

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TradingView Lightweight Charts** - Professional charting
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Data Sources

1. **Demo Mode (Default)**
   - No setup required
   - Generates realistic market data
   - Perfect for testing and development

2. **Alpha Vantage**
   - Get free API key: https://www.alphavantage.co/support/#api-key
   - 5 requests/minute (free), 75/minute (premium)
   - Professional-grade financial data

3. **Polygon.io**
   - Get API key: https://polygon.io/
   - Real-time and historical data
   - WebSocket support for live updates

### API Configuration

Click the Settings (⚙️) button in the top toolbar to configure:
- Data source selection
- API key entry
- Update frequency
- Live data toggle

Configuration is stored locally in your browser.

## 🎯 Usage

### Basic Navigation
- **Symbol Search** - Enter ticker in top-left search bar
- **Timeframes** - Click timeframe buttons (1D, 1W, etc.)
- **Chart Types** - Select from dropdown (Candlestick, Line, etc.)
- **Sidebar** - Access indicators, research, backtesting, watchlist

### Chart Interactions
- **Zoom** - Mouse wheel or pinch gesture
- **Pan** - Click and drag to move chart
- **Reset** - Double-click to fit content
- **Crosshair** - Hover for price/time precision

### Technical Indicators
1. Open sidebar (if collapsed)
2. Go to "Indicators" tab
3. Check desired indicators
4. Indicators appear on chart immediately

### Adding Symbols to Watchlist
1. Go to "Watchlist" tab in sidebar
2. Click "+ Add Symbol"
3. Enter ticker symbol
4. Symbol added to watchlist

## 🏗️ Architecture

```
src/
├── components/          # React components
│   ├── TradingChart.jsx # Main chart component
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── TopBar.jsx      # Top navigation bar
│   └── MarketInfo.jsx  # Market data panel
├── hooks/              # Custom React hooks
│   └── useMarketData.js # Market data fetching
├── services/           # API services
│   └── marketDataAPI.js # Data provider APIs
├── utils/              # Utility functions
│   ├── dataGenerator.js # Sample data generation
│   └── technicalIndicators.js # TA calculations
└── styles/             # CSS styles
    └── index.css       # Global styles + Tailwind
```

## 🔄 Real-time Updates

The dashboard supports real-time data updates:

- **Demo Mode** - Updates every 30 seconds with simulated data
- **Live APIs** - Configurable update frequency (10s to 5min)
- **WebSocket Support** - Real-time price feeds (Polygon.io)
- **Price Animations** - Visual feedback for price changes

## 📊 Performance

Optimized for professional trading:
- **Fast Rendering** - TradingView charts handle thousands of data points
- **Efficient Updates** - Only re-render when data changes
- **Memory Management** - Proper cleanup of chart instances
- **Responsive Design** - Works on desktop, tablet, mobile

## 🔒 Security

- **Local Storage** - API keys stored in browser only
- **No Server** - All processing happens client-side
- **HTTPS Required** - Secure API connections
- **Rate Limiting** - Built-in API rate limit handling

## 📱 Mobile Support

Fully responsive design:
- **Touch Gestures** - Pinch to zoom, drag to pan
- **Mobile Layout** - Optimized sidebar and panels
- **Portrait/Landscape** - Adapts to screen orientation

## 🎨 Customization

Easy to customize:
- **Tailwind CSS** - Utility classes for rapid styling
- **CSS Variables** - Consistent color theming
- **Component Props** - Configurable component behavior
- **Chart Themes** - TradingView styling options

## 🐛 Troubleshooting

### Common Issues

1. **Chart not loading**
   - Check browser console for errors
   - Ensure TradingView scripts loaded
   - Try refreshing the page

2. **API errors**
   - Verify API key is correct
   - Check API rate limits
   - Ensure symbol exists

3. **Performance issues**
   - Reduce number of active indicators
   - Use longer timeframes for large datasets
   - Close unused browser tabs

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📈 Roadmap

- [ ] Options chain analysis
- [ ] Cryptocurrency support  
- [ ] Advanced order types simulation
- [ ] Portfolio tracking
- [ ] Custom indicator builder
- [ ] Market screener
- [ ] Real-time news integration
- [ ] Social sentiment analysis

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TradingView](https://tradingview.com) for Lightweight Charts library
- [Alpha Vantage](https://alphavantage.co) for financial data API
- [Polygon.io](https://polygon.io) for real-time market data
- [Tailwind CSS](https://tailwindcss.com) for styling framework

---

Built with ❤️ for professional traders