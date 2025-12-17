
export interface SentimentData {
  category: string;
  score: number; // 0 (Bearish) to 100 (Bullish)
  summary: string;
  keyDrivers: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  sentiments: SentimentData[];
  globalOutlook: string;
  sources: GroundingSource[];
  timestamp: string;
}

export enum MarketSector {
  STOCKS = 'Stocks',
  CRYPTO = 'Crypto',
  FOREX = 'Forex',
  COMMODITIES = 'Commodities'
}
