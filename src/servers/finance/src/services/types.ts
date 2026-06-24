export interface StockSearchResult {
  code: string;
  name: string;
  market: string;
  type: string;
  secid: string;
}

export interface StockQuote {
  code: string;
  name: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  prevClose: number | null;
  volume: number | null;
  amount: number | null;
  pe: number | null;
  pb: number | null;
  marketCap: number | null;
  floatCap: number | null;
  turnover: number | null;
  amplitude: number | null;
}

export interface KlineDataPoint {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  amplitude: number;
  changePct: number;
  changeAmt: number;
  turnover: number;
}

export interface MarketListItem {
  code: string;
  name: string;
  price: number | null;
  changePct: number | null;
  changeAmt: number | null;
  volume: number | null;
  amount: number | null;
  turnover: number | null;
  pe: number | null;
  marketCap: number | null;
  floatCap: number | null;
  high: number | null;
  low: number | null;
  open: number | null;
  prevClose: number | null;
  amplitude: number | null;
}
