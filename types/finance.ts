export interface SparkPoint {
  price: number;
  ts: number;
}

export interface QuoteDetail {
  symbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketState: string;
  sparkline: SparkPoint[];
}
