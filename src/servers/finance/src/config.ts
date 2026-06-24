export const MARKET_CODE = {
  SH: 1,
  SZ: 0,
  HK: 116,
  US: 105,
} as const;

export const MARKET_FILTER: Record<string, string> = {
  sha: "m:1+t:2,m:1+t:23",
  sza: "m:0+t:6,m:0+t:80",
  cyb: "m:0+t:80",
  kcb: "m:1+t:23",
  bk: "m:90+t:2",
};

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

export const SORT_FIELD: Record<string, string> = {
  price: "f2",
  change_pct: "f3",
  volume: "f5",
  amount: "f6",
  turnover: "f8",
  market_cap: "f20",
};

export const API_BASE = {
  SEARCH: "https://searchapi.eastmoney.com",
  QUOTE: "https://push2.eastmoney.com",
  HISTORY: "https://push2his.eastmoney.com",
  DATACENTER: "https://datacenter-web.eastmoney.com",
} as const;

export const SEARCH_TOKEN = "D43BF722C8E33BDC906FB84D85E326E8";
