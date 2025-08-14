class FinancialDashboard {
    constructor() {
        this.currentTicker = 'AAPL';
        this.chart = null;
        this.chartData = null;
        this.activeIndicators = new Set();
        this.currentChartType = 'line';
        this.dataSource = 'demo';
        this.apiConfig = {
            key: '',
            rateLimit: 5
        };
        
        this.init();
    }
    
    init() {
        this.loadConfig();
        this.setupEventListeners();
        // Wait for Chart.js to load
        if (typeof Chart !== 'undefined') {
            this.initializeChart();
            this.loadSampleData();
        } else {
            setTimeout(() => this.init(), 100);
        }
    }
    
    loadConfig() {
        const savedConfig = localStorage.getItem('dashboardConfig');
        if (savedConfig) {
            try {
                const config = JSON.parse(savedConfig);
                this.dataSource = config.dataSource || 'demo';
                this.apiConfig = config.apiConfig || this.apiConfig;
            } catch (e) {
                console.log('Config load error, using defaults');
            }
        }
    }
    
    saveConfig() {
        const config = {
            dataSource: this.dataSource,
            apiConfig: this.apiConfig
        };
        localStorage.setItem('dashboardConfig', JSON.stringify(config));
    }
    
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Ticker input
        const tickerInput = document.getElementById('tickerInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const ticker = tickerInput?.value?.trim()?.toUpperCase();
                if (ticker) {
                    this.loadTickerData(ticker);
                }
            });
        }
        
        if (tickerInput) {
            tickerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const ticker = tickerInput.value.trim().toUpperCase();
                    if (ticker) {
                        this.loadTickerData(ticker);
                    }
                }
            });
        }
        
        // Chart type buttons
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentChartType = e.target.dataset.type;
                this.updateChartType();
            });
        });
        
        // Timeframe buttons
        document.querySelectorAll('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChartTimeframe(e.target.dataset.period);
            });
        });
        
        // Chart tools - with null checks
        const zoomTool = document.getElementById('zoomTool');
        const crosshairTool = document.getElementById('crosshairTool');
        const screenshotTool = document.getElementById('screenshotTool');
        const dataSourceBtn = document.getElementById('dataSourceBtn');
        
        if (zoomTool) {
            zoomTool.addEventListener('click', () => this.toggleZoom());
        }
        
        if (crosshairTool) {
            crosshairTool.addEventListener('click', () => this.toggleCrosshair());
        }
        
        if (screenshotTool) {
            screenshotTool.addEventListener('click', () => this.takeScreenshot());
        }
        
        if (dataSourceBtn) {
            dataSourceBtn.addEventListener('click', () => this.openDataSourceModal());
        }
        
        // Technical indicators
        document.querySelectorAll('#indicators input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const indicator = e.target.value;
                if (e.target.checked) {
                    this.activeIndicators.add(indicator);
                } else {
                    this.activeIndicators.delete(indicator);
                }
                this.updateChartIndicators();
            });
        });
        
        // Modal events
        this.setupModalEventListeners();
    }
    
    setupModalEventListeners() {
        const modal = document.getElementById('dataSourceModal');
        if (!modal) return;
        
        const closeBtn = document.querySelector('.modal-close');
        const cancelBtn = document.getElementById('cancelConfig');
        const saveBtn = document.getElementById('saveConfig');
        const apiConfig = document.getElementById('apiConfig');
        
        // Close modal events
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        // Click outside to close
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Data source selection
        document.querySelectorAll('input[name="dataSource"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (apiConfig) {
                    if (e.target.value !== 'demo') {
                        apiConfig.classList.add('active');
                    } else {
                        apiConfig.classList.remove('active');
                    }
                }
            });
        });
        
        // Save configuration
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const selectedSource = document.querySelector('input[name="dataSource"]:checked')?.value || 'demo';
                this.dataSource = selectedSource;
                
                if (selectedSource !== 'demo') {
                    const apiKeyInput = document.getElementById('apiKey');
                    const rateLimitSelect = document.getElementById('rateLimit');
                    
                    this.apiConfig.key = apiKeyInput?.value || '';
                    this.apiConfig.rateLimit = parseInt(rateLimitSelect?.value || '5');
                }
                
                this.saveConfig();
                modal.style.display = 'none';
                
                // Reload current ticker with new data source
                this.loadTickerData(this.currentTicker);
            });
        }
    }
    
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }
    
    initializeChart() {
        const ctx = document.getElementById('stockChart');
        if (!ctx) {
            console.error('Canvas element not found');
            return;
        }
        
        const canvasContext = ctx.getContext('2d');
        if (!canvasContext) {
            console.error('Could not get 2D context');
            return;
        }
        
        try {
            this.chart = new Chart(canvasContext, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'start',
                            labels: {
                                color: '#e1e5e9',
                                font: {
                                    size: 12,
                                    weight: 500
                                },
                                usePointStyle: true,
                                pointStyle: 'line'
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: '#131722',
                            titleColor: '#f7f8fa',
                            bodyColor: '#e1e5e9',
                            borderColor: '#2a2e39',
                            borderWidth: 1,
                            displayColors: false,
                            callbacks: {
                                label: (context) => {
                                    return `${context.dataset.label}: $${context.parsed.y?.toFixed(2) || 'N/A'}`;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM dd',
                                    hour: 'HH:mm'
                                }
                            },
                            grid: {
                                color: '#2a2e39',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#868b94',
                                maxTicksLimit: 8,
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            position: 'right',
                            grid: {
                                color: '#2a2e39',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#868b94',
                                font: {
                                    size: 11
                                },
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    hover: {
                        mode: 'index',
                        intersect: false
                    },
                    onHover: (event, elements) => {
                        if (event.native && event.native.target) {
                            event.native.target.style.cursor = elements.length ? 'crosshair' : 'default';
                        }
                    }
                }
            });
            
            console.log('Chart initialized successfully');
        } catch (error) {
            console.error('Chart initialization error:', error);
        }
    }
    
    updateChartType() {
        if (!this.chartData || !this.chart) return;
        
        // For now, just update the existing chart
        this.updateChart(this.chartData);
    }
    
    toggleZoom() {
        // Placeholder - advanced zoom functionality would need additional plugins
        console.log('Zoom toggle - would need chartjs-plugin-zoom');
    }
    
    toggleCrosshair() {
        // Placeholder - crosshair functionality would need additional plugins
        console.log('Crosshair toggle - would need chartjs-plugin-crosshair');
    }
    
    takeScreenshot() {
        const canvas = document.getElementById('stockChart');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.download = `${this.currentTicker}_chart_${new Date().toISOString().split('T')[0]}.png`;
            link.href = url;
            link.click();
        }
    }
    
    openDataSourceModal() {
        const modal = document.getElementById('dataSourceModal');
        if (modal) {
            // Set current configuration
            const currentRadio = document.querySelector(`input[name="dataSource"][value="${this.dataSource}"]`);
            if (currentRadio) {
                currentRadio.checked = true;
            }
            
            const apiKeyInput = document.getElementById('apiKey');
            const rateLimitSelect = document.getElementById('rateLimit');
            
            if (apiKeyInput) apiKeyInput.value = this.apiConfig.key;
            if (rateLimitSelect) rateLimitSelect.value = this.apiConfig.rateLimit;
            
            // Show/hide API config
            const apiConfig = document.getElementById('apiConfig');
            if (apiConfig) {
                if (this.dataSource !== 'demo') {
                    apiConfig.classList.add('active');
                } else {
                    apiConfig.classList.remove('active');
                }
            }
            
            modal.style.display = 'block';
        }
    }
    
    async loadTickerData(ticker) {
        this.currentTicker = ticker;
        const tickerInput = document.getElementById('tickerInput');
        if (tickerInput) {
            tickerInput.value = ticker;
        }
        
        try {
            let data;
            if (this.dataSource === 'demo') {
                data = this.generateSampleData(ticker);
            } else {
                data = await this.fetchRealData(ticker);
            }
            
            this.updateChart(data);
            this.updateTickerInfo(ticker, data);
        } catch (error) {
            console.error('Error loading ticker data:', error);
            // Fallback to demo data
            const data = this.generateSampleData(ticker);
            this.updateChart(data);
            this.updateTickerInfo(ticker, data);
        }
    }
    
    async fetchRealData(ticker) {
        switch (this.dataSource) {
            case 'alphavantage':
                return await this.fetchAlphaVantageData(ticker);
            default:
                return this.generateSampleData(ticker);
        }
    }
    
    async fetchAlphaVantageData(ticker) {
        if (!this.apiConfig.key) {
            throw new Error('API key required for Alpha Vantage');
        }
        
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=${this.apiConfig.key}&outputsize=compact`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data['Error Message'] || data['Note']) {
            throw new Error('API limit reached or invalid ticker');
        }
        
        const timeSeries = data['Time Series (Daily)'];
        if (!timeSeries) {
            throw new Error('No data available');
        }
        
        return this.formatAlphaVantageData(timeSeries);
    }
    
    formatAlphaVantageData(timeSeries) {
        const labels = [];
        const lineData = [];
        const volumeData = [];
        
        Object.keys(timeSeries)
            .sort()
            .slice(-90) // Last 90 days
            .forEach(date => {
                const dayData = timeSeries[date];
                const dateObj = new Date(date);
                
                labels.push(dateObj);
                
                const closePrice = parseFloat(dayData['4. close']);
                lineData.push({
                    x: dateObj,
                    y: closePrice
                });
                
                const volume = parseInt(dayData['5. volume']);
                volumeData.push({
                    x: dateObj,
                    y: volume
                });
            });
        
        return {
            labels,
            lineData,
            volumeData,
            currentPrice: lineData[lineData.length - 1]?.y || 0,
            volume: volumeData[volumeData.length - 1]?.y || 0
        };
    }
    
    generateSampleData(ticker, days = 90) {
        const labels = [];
        const lineData = [];
        const volumeData = [];
        
        const startPrice = Math.random() * 100 + 50; // $50-150 start price
        let currentPrice = startPrice;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            // Generate realistic price movement
            const change = (Math.random() - 0.5) * 0.1; // ±5% max change per day
            currentPrice *= (1 + change);
            currentPrice = Math.max(currentPrice, startPrice * 0.5); // Don't go below 50% of start
            currentPrice = Math.min(currentPrice, startPrice * 2); // Don't go above 200% of start
            
            labels.push(date);
            lineData.push({
                x: date,
                y: parseFloat(currentPrice.toFixed(2))
            });
            
            // Generate volume data
            const baseVolume = 1000000 + Math.random() * 5000000; // 1M-6M volume
            volumeData.push({
                x: date,
                y: Math.floor(baseVolume)
            });
        }
        
        return {
            labels,
            lineData,
            volumeData,
            currentPrice: currentPrice,
            volume: volumeData[volumeData.length - 1]?.y || 0
        };
    }
    
    updateChart(data) {
        if (!this.chart || !data) return;
        
        this.chartData = data;
        
        // Clear existing datasets
        this.chart.data.datasets = [];
        this.chart.data.labels = data.labels;
        
        // Add main price dataset
        this.chart.data.datasets.push({
            label: this.currentTicker,
            data: data.lineData,
            borderColor: '#2962ff',
            backgroundColor: this.currentChartType === 'area' ? 'rgba(41, 98, 255, 0.1)' : 'transparent',
            borderWidth: 2,
            fill: this.currentChartType === 'area',
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 4
        });
        
        // Add volume if enabled
        if (data.volumeData && this.activeIndicators.has('volume')) {
            this.chart.data.datasets.push({
                label: 'Volume',
                data: data.volumeData,
                type: 'bar',
                backgroundColor: 'rgba(255, 193, 7, 0.3)',
                borderColor: '#ffc107',
                borderWidth: 1,
                yAxisID: 'volume'
            });
            
            // Add volume scale
            if (!this.chart.options.scales.volume) {
                this.chart.options.scales.volume = {
                    type: 'linear',
                    position: 'left',
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#868b94',
                        font: { size: 10 },
                        callback: function(value) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                };
            }
        } else {
            delete this.chart.options.scales.volume;
        }
        
        try {
            this.chart.update('none');
            this.updateChartIndicators();
        } catch (error) {
            console.error('Chart update error:', error);
        }
    }
    
    updateChartIndicators() {
        if (!this.chartData || !this.chartData.lineData || !this.chart) return;
        
        // Remove existing indicator datasets (keep only main price and volume)
        this.chart.data.datasets = this.chart.data.datasets.filter(dataset => 
            dataset.label === this.currentTicker || dataset.label === 'Volume'
        );
        
        const prices = this.chartData.lineData.map(point => point.y);
        
        // Add technical indicators
        this.activeIndicators.forEach(indicator => {
            if (indicator !== 'volume') { // Volume handled separately
                const indicatorData = this.calculateIndicator(indicator, prices);
                if (indicatorData) {
                    if (Array.isArray(indicatorData)) {
                        indicatorData.forEach(dataset => this.chart.data.datasets.push(dataset));
                    } else {
                        this.chart.data.datasets.push(indicatorData);
                    }
                }
            }
        });
        
        try {
            this.chart.update('none');
        } catch (error) {
            console.error('Indicators update error:', error);
        }
    }
    
    calculateIndicator(indicator, prices) {
        switch (indicator) {
            case 'sma20':
                return this.calculateSMA(prices, 20, '#ff6b6b', 'SMA(20)');
            case 'sma50':
                return this.calculateSMA(prices, 50, '#4ecdc4', 'SMA(50)');
            case 'ema12':
                return this.calculateEMA(prices, 12, '#45b7d1', 'EMA(12)');
            case 'ema26':
                return this.calculateEMA(prices, 26, '#f39c12', 'EMA(26)');
            case 'bb':
                return this.calculateBollingerBands(prices);
            default:
                return null;
        }
    }
    
    calculateSMA(prices, period, color, label) {
        const smaData = [];
        
        for (let i = period - 1; i < prices.length; i++) {
            const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
            const avg = sum / period;
            smaData.push({
                x: this.chartData.labels[i],
                y: parseFloat(avg.toFixed(2))
            });
        }
        
        return {
            label: label,
            data: smaData,
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 3
        };
    }
    
    calculateEMA(prices, period, color, label) {
        const multiplier = 2 / (period + 1);
        const emaData = [];
        let ema = prices[0];
        
        for (let i = 0; i < prices.length; i++) {
            if (i === 0) {
                ema = prices[i];
            } else {
                ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
            }
            
            emaData.push({
                x: this.chartData.labels[i],
                y: parseFloat(ema.toFixed(2))
            });
        }
        
        return {
            label: label,
            data: emaData,
            borderColor: color,
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            fill: false,
            tension: 0.1,
            pointRadius: 0,
            pointHoverRadius: 3
        };
    }
    
    calculateBollingerBands(prices, period = 20, multiplier = 2) {
        const smaData = [];
        const upperBand = [];
        const lowerBand = [];
        
        for (let i = period - 1; i < prices.length; i++) {
            const slice = prices.slice(i - period + 1, i + 1);
            const sma = slice.reduce((a, b) => a + b) / period;
            const variance = slice.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
            const stdDev = Math.sqrt(variance);
            
            const date = this.chartData.labels[i];
            smaData.push({ x: date, y: parseFloat(sma.toFixed(2)) });
            upperBand.push({ x: date, y: parseFloat((sma + (stdDev * multiplier)).toFixed(2)) });
            lowerBand.push({ x: date, y: parseFloat((sma - (stdDev * multiplier)).toFixed(2)) });
        }
        
        return [
            {
                label: 'BB Upper',
                data: upperBand,
                borderColor: '#9b59b6',
                backgroundColor: 'transparent',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'BB Middle',
                data: smaData,
                borderColor: '#e74c3c',
                backgroundColor: 'transparent',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            },
            {
                label: 'BB Lower',
                data: lowerBand,
                borderColor: '#9b59b6',
                backgroundColor: 'transparent',
                borderWidth: 1,
                fill: false,
                pointRadius: 0
            }
        ];
    }
    
    updateChartTimeframe(period) {
        let days;
        switch (period) {
            case '1D': days = 1; break;
            case '5D': days = 5; break;
            case '1M': days = 30; break;
            case '3M': days = 90; break;
            case '1Y': days = 365; break;
            case '5Y': days = 1825; break;
            default: days = 90;
        }
        
        // Generate new data for the timeframe
        const data = this.generateSampleData(this.currentTicker, days);
        this.updateChart(data);
        this.updateTickerInfo(this.currentTicker, data);
    }
    
    loadSampleData() {
        const sampleData = this.generateSampleData(this.currentTicker);
        this.updateChart(sampleData);
        this.updateTickerInfo(this.currentTicker, sampleData);
    }
    
    updateTickerInfo(ticker, data) {
        const companies = {
            'AAPL': 'Apple Inc.',
            'MSFT': 'Microsoft Corporation',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'TSLA': 'Tesla Inc.',
            'NVDA': 'NVIDIA Corporation',
            'META': 'Meta Platforms Inc.',
            'NFLX': 'Netflix Inc.',
            'default': `${ticker} Corporation`
        };
        
        const companyName = companies[ticker] || companies.default;
        const currentPrice = data.currentPrice || 0;
        
        // Generate realistic derived data
        const openPrice = currentPrice * (0.95 + Math.random() * 0.1);
        const highPrice = currentPrice * (1 + Math.random() * 0.05);
        const lowPrice = currentPrice * (0.95 - Math.random() * 0.05);
        const volume = data.volume ? (data.volume / 1000000).toFixed(1) : (Math.random() * 50 + 10).toFixed(1);
        const marketCap = (currentPrice * Math.random() * 20 + 100).toFixed(2);
        const peRatio = (15 + Math.random() * 30).toFixed(2);
        const change = (Math.random() - 0.5) * 10;
        const changePercent = (change / currentPrice * 100).toFixed(2);
        
        // Update UI elements with null checks
        const elements = {
            currentTicker: ticker,
            companyName: companyName,
            currentPrice: `$${currentPrice.toFixed(2)}`,
            openPrice: `$${openPrice.toFixed(2)}`,
            highPrice: `$${highPrice.toFixed(2)}`,
            lowPrice: `$${lowPrice.toFixed(2)}`,
            volume: `${volume}M`,
            marketCap: `$${marketCap}B`,
            peRatio: peRatio,
            fiftyTwoWeekHigh: `$${(currentPrice * 1.5).toFixed(2)}`,
            fiftyTwoWeekLow: `$${(currentPrice * 0.7).toFixed(2)}`
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
        // Handle price change with color
        const priceChangeEl = document.getElementById('priceChange');
        if (priceChangeEl) {
            priceChangeEl.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent >= 0 ? '+' : ''}${changePercent}%)`;
            priceChangeEl.className = change >= 0 ? 'positive' : 'negative';
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing dashboard...');
    try {
        new FinancialDashboard();
    } catch (error) {
        console.error('Dashboard initialization error:', error);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Chart.js handles responsiveness automatically
});