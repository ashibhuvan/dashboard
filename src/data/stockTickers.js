/**
 * Comprehensive stock ticker database
 * Includes major US exchanges: NYSE, NASDAQ, AMEX
 */

export const STOCK_TICKERS = [
  // Mega Cap Tech
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "AMZN", name: "Amazon.com Inc.", exchange: "NASDAQ", sector: "Consumer Discretionary" },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", sector: "Automotive" },
  { symbol: "META", name: "Meta Platforms Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "AVGO", name: "Broadcom Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "ORCL", name: "Oracle Corporation", exchange: "NASDAQ", sector: "Technology" },
  
  // Financial Services
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc. Class A", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "V", name: "Visa Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "MA", name: "Mastercard Incorporated", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "BAC", name: "Bank of America Corporation", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "WFC", name: "Wells Fargo & Company", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "GS", name: "The Goldman Sachs Group Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "MS", name: "Morgan Stanley", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "AXP", name: "American Express Company", exchange: "NYSE", sector: "Financial Services" },
  
  // Healthcare & Pharmaceuticals
  { symbol: "UNH", name: "UnitedHealth Group Incorporated", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "JNJ", name: "Johnson & Johnson", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "PFE", name: "Pfizer Inc.", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "ABBV", name: "AbbVie Inc.", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "LLY", name: "Eli Lilly and Company", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "MRK", name: "Merck & Co. Inc.", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc.", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "ABT", name: "Abbott Laboratories", exchange: "NYSE", sector: "Healthcare" },
  { symbol: "ISRG", name: "Intuitive Surgical Inc.", exchange: "NASDAQ", sector: "Healthcare" },
  { symbol: "DHR", name: "Danaher Corporation", exchange: "NYSE", sector: "Healthcare" },
  
  // Consumer & Retail
  { symbol: "WMT", name: "Walmart Inc.", exchange: "NYSE", sector: "Consumer Staples" },
  { symbol: "HD", name: "The Home Depot Inc.", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "PG", name: "The Procter & Gamble Company", exchange: "NYSE", sector: "Consumer Staples" },
  { symbol: "COST", name: "Costco Wholesale Corporation", exchange: "NASDAQ", sector: "Consumer Staples" },
  { symbol: "KO", name: "The Coca-Cola Company", exchange: "NYSE", sector: "Consumer Staples" },
  { symbol: "PEP", name: "PepsiCo Inc.", exchange: "NASDAQ", sector: "Consumer Staples" },
  { symbol: "MCD", name: "McDonald's Corporation", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "NKE", name: "NIKE Inc.", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "LOW", name: "Lowe's Companies Inc.", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "SBUX", name: "Starbucks Corporation", exchange: "NASDAQ", sector: "Consumer Discretionary" },
  
  // Entertainment & Media
  { symbol: "DIS", name: "The Walt Disney Company", exchange: "NYSE", sector: "Communication Services" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", sector: "Communication Services" },
  { symbol: "CMCSA", name: "Comcast Corporation", exchange: "NASDAQ", sector: "Communication Services" },
  { symbol: "T", name: "AT&T Inc.", exchange: "NYSE", sector: "Communication Services" },
  { symbol: "VZ", name: "Verizon Communications Inc.", exchange: "NYSE", sector: "Communication Services" },
  { symbol: "CHTR", name: "Charter Communications Inc.", exchange: "NASDAQ", sector: "Communication Services" },
  
  // Energy
  { symbol: "XOM", name: "Exxon Mobil Corporation", exchange: "NYSE", sector: "Energy" },
  { symbol: "CVX", name: "Chevron Corporation", exchange: "NYSE", sector: "Energy" },
  { symbol: "COP", name: "ConocoPhillips", exchange: "NYSE", sector: "Energy" },
  { symbol: "EOG", name: "EOG Resources Inc.", exchange: "NYSE", sector: "Energy" },
  { symbol: "SLB", name: "Schlumberger Limited", exchange: "NYSE", sector: "Energy" },
  { symbol: "PXD", name: "Pioneer Natural Resources Company", exchange: "NYSE", sector: "Energy" },
  
  // Industrials
  { symbol: "BA", name: "The Boeing Company", exchange: "NYSE", sector: "Industrials" },
  { symbol: "CAT", name: "Caterpillar Inc.", exchange: "NYSE", sector: "Industrials" },
  { symbol: "GE", name: "General Electric Company", exchange: "NYSE", sector: "Industrials" },
  { symbol: "HON", name: "Honeywell International Inc.", exchange: "NASDAQ", sector: "Industrials" },
  { symbol: "UPS", name: "United Parcel Service Inc.", exchange: "NYSE", sector: "Industrials" },
  { symbol: "RTX", name: "Raytheon Technologies Corporation", exchange: "NYSE", sector: "Industrials" },
  { symbol: "LMT", name: "Lockheed Martin Corporation", exchange: "NYSE", sector: "Industrials" },
  { symbol: "DE", name: "Deere & Company", exchange: "NYSE", sector: "Industrials" },
  { symbol: "MMM", name: "3M Company", exchange: "NYSE", sector: "Industrials" },
  { symbol: "FDX", name: "FedEx Corporation", exchange: "NYSE", sector: "Industrials" },
  
  // Additional Tech Companies
  { symbol: "CRM", name: "Salesforce Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "ADBE", name: "Adobe Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "NFLX", name: "Netflix Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "INTC", name: "Intel Corporation", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "AMD", name: "Advanced Micro Devices Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "QCOM", name: "QUALCOMM Incorporated", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "TXN", name: "Texas Instruments Incorporated", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "IBM", name: "International Business Machines Corporation", exchange: "NYSE", sector: "Technology" },
  { symbol: "NOW", name: "ServiceNow Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "INTU", name: "Intuit Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "MU", name: "Micron Technology Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "AMAT", name: "Applied Materials Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "LRCX", name: "Lam Research Corporation", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "ADI", name: "Analog Devices Inc.", exchange: "NASDAQ", sector: "Technology" },
  
  // Popular Growth Stocks
  { symbol: "SHOP", name: "Shopify Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "SQ", name: "Block Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "ROKU", name: "Roku Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "TWLO", name: "Twilio Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "ZM", name: "Zoom Video Communications Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "DOCU", name: "DocuSign Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "SNOW", name: "Snowflake Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "PLTR", name: "Palantir Technologies Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "U", name: "Unity Software Inc.", exchange: "NYSE", sector: "Technology" },
  { symbol: "RBLX", name: "Roblox Corporation", exchange: "NYSE", sector: "Technology" },
  
  // Electric Vehicles & Clean Energy
  { symbol: "NIO", name: "NIO Inc.", exchange: "NYSE", sector: "Automotive" },
  { symbol: "XPEV", name: "XPeng Inc.", exchange: "NYSE", sector: "Automotive" },
  { symbol: "LI", name: "Li Auto Inc.", exchange: "NASDAQ", sector: "Automotive" },
  { symbol: "RIVN", name: "Rivian Automotive Inc.", exchange: "NASDAQ", sector: "Automotive" },
  { symbol: "LCID", name: "Lucid Group Inc.", exchange: "NASDAQ", sector: "Automotive" },
  { symbol: "F", name: "Ford Motor Company", exchange: "NYSE", sector: "Automotive" },
  { symbol: "GM", name: "General Motors Company", exchange: "NYSE", sector: "Automotive" },
  
  // Biotechnology
  { symbol: "GILD", name: "Gilead Sciences Inc.", exchange: "NASDAQ", sector: "Biotechnology" },
  { symbol: "AMGN", name: "Amgen Inc.", exchange: "NASDAQ", sector: "Biotechnology" },
  { symbol: "BIIB", name: "Biogen Inc.", exchange: "NASDAQ", sector: "Biotechnology" },
  { symbol: "REGN", name: "Regeneron Pharmaceuticals Inc.", exchange: "NASDAQ", sector: "Biotechnology" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals Incorporated", exchange: "NASDAQ", sector: "Biotechnology" },
  { symbol: "CELG", name: "Celgene Corporation", exchange: "NASDAQ", sector: "Biotechnology" },
  
  // REITs
  { symbol: "AMT", name: "American Tower Corporation", exchange: "NYSE", sector: "Real Estate" },
  { symbol: "PLD", name: "Prologis Inc.", exchange: "NYSE", sector: "Real Estate" },
  { symbol: "CCI", name: "Crown Castle International Corp.", exchange: "NYSE", sector: "Real Estate" },
  { symbol: "EQIX", name: "Equinix Inc.", exchange: "NASDAQ", sector: "Real Estate" },
  { symbol: "SPG", name: "Simon Property Group Inc.", exchange: "NYSE", sector: "Real Estate" },
  
  // Utilities
  { symbol: "NEE", name: "NextEra Energy Inc.", exchange: "NYSE", sector: "Utilities" },
  { symbol: "SO", name: "The Southern Company", exchange: "NYSE", sector: "Utilities" },
  { symbol: "DUK", name: "Duke Energy Corporation", exchange: "NYSE", sector: "Utilities" },
  { symbol: "D", name: "Dominion Energy Inc.", exchange: "NYSE", sector: "Utilities" },
  
  // Materials
  { symbol: "LIN", name: "Linde plc", exchange: "NYSE", sector: "Materials" },
  { symbol: "APD", name: "Air Products and Chemicals Inc.", exchange: "NYSE", sector: "Materials" },
  { symbol: "FCX", name: "Freeport-McMoRan Inc.", exchange: "NYSE", sector: "Materials" },
  { symbol: "NEM", name: "Newmont Corporation", exchange: "NYSE", sector: "Materials" },
  
  // Popular Meme Stocks
  { symbol: "GME", name: "GameStop Corp.", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "AMC", name: "AMC Entertainment Holdings Inc.", exchange: "NYSE", sector: "Consumer Discretionary" },
  { symbol: "BB", name: "BlackBerry Limited", exchange: "NYSE", sector: "Technology" },
  { symbol: "NOK", name: "Nokia Corporation", exchange: "NYSE", sector: "Technology" },
  
  // Chinese ADRs
  { symbol: "BABA", name: "Alibaba Group Holding Limited", exchange: "NYSE", sector: "Technology" },
  { symbol: "JD", name: "JD.com Inc.", exchange: "NASDAQ", sector: "Consumer Discretionary" },
  { symbol: "BIDU", name: "Baidu Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "PDD", name: "PDD Holdings Inc.", exchange: "NASDAQ", sector: "Technology" },
  
  // Popular ETFs
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", exchange: "NYSE", sector: "ETF" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", exchange: "NASDAQ", sector: "ETF" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", exchange: "NYSE", sector: "ETF" },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", exchange: "NYSE", sector: "ETF" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", exchange: "NYSE", sector: "ETF" },
  { symbol: "DIA", name: "SPDR Dow Jones Industrial Average ETF Trust", exchange: "NYSE", sector: "ETF" },
  
  // Crypto-related
  { symbol: "COIN", name: "Coinbase Global Inc.", exchange: "NASDAQ", sector: "Financial Services" },
  { symbol: "MSTR", name: "MicroStrategy Incorporated", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "RIOT", name: "Riot Platforms Inc.", exchange: "NASDAQ", sector: "Technology" },
  { symbol: "MARA", name: "Marathon Digital Holdings Inc.", exchange: "NASDAQ", sector: "Technology" },
  
  // Additional Major Companies
  { symbol: "BLK", name: "BlackRock Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "SCHW", name: "The Charles Schwab Corporation", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "SPGI", name: "S&P Global Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "ICE", name: "Intercontinental Exchange Inc.", exchange: "NYSE", sector: "Financial Services" },
  { symbol: "CME", name: "CME Group Inc.", exchange: "NASDAQ", sector: "Financial Services" },
];

// Search function for stock tickers
export const searchTickers = (query, limit = 10) => {
  if (!query || query.length < 1) return [];
  
  const searchTerm = query.toUpperCase();
  
  // First, prioritize exact symbol matches
  const exactMatches = STOCK_TICKERS.filter(stock => 
    stock.symbol === searchTerm
  );
  
  // Then, symbol starts with
  const symbolMatches = STOCK_TICKERS.filter(stock => 
    stock.symbol.startsWith(searchTerm) && stock.symbol !== searchTerm
  );
  
  // Then, company name contains
  const nameMatches = STOCK_TICKERS.filter(stock => 
    stock.name.toUpperCase().includes(searchTerm) && 
    !stock.symbol.startsWith(searchTerm)
  );
  
  // Combine results with priority order
  const results = [...exactMatches, ...symbolMatches, ...nameMatches];
  
  // Remove duplicates and limit results
  const uniqueResults = results.filter((stock, index, self) => 
    index === self.findIndex(s => s.symbol === stock.symbol)
  );
  
  return uniqueResults.slice(0, limit);
};

// Get ticker by symbol
export const getTickerBySymbol = (symbol) => {
  return STOCK_TICKERS.find(stock => 
    stock.symbol.toUpperCase() === symbol.toUpperCase()
  );
};

// Get all tickers (for data loading)
export const getAllTickers = () => {
  return STOCK_TICKERS;
};

// Get tickers by exchange
export const getTickersByExchange = (exchange) => {
  return STOCK_TICKERS.filter(stock => 
    stock.exchange.toUpperCase() === exchange.toUpperCase()
  );
};

// Get tickers by sector
export const getTickersBySector = (sector) => {
  return STOCK_TICKERS.filter(stock => 
    stock.sector.toUpperCase() === sector.toUpperCase()
  );
};