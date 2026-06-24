export const MARKET_CODE = {
  SH: 1,
  SZ: 0,
  HK: 116,
  US: 105,
} as const;

export const KLINE_PERIOD: Record<string, number> = {
  "1m": 1,
  "5m": 5,
  "15m": 15,
  "30m": 30,
  "60m": 60,
  daily: 101,
  weekly: 102,
  monthly: 103,
};

export const ADJUST_TYPE: Record<string, number> = {
  none: 0,
  qfq: 1,
  hfq: 2,
};

export const API_BASE = {
  SEARCH: "https://searchapi.eastmoney.com",
  QUOTE: "https://push2.eastmoney.com",
  HISTORY: "https://push2his.eastmoney.com",
} as const;

export const SEARCH_TOKEN = "D43BF722C8E33BDC906FB84D85E326E8";
