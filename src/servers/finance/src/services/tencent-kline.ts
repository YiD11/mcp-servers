import type { KlineDataPoint } from "./types.js";
import { detectMarket } from "./market-utils.js";

const TENCENT_KLINE = "https://web.ifzq.gtimg.cn/appstock/app/fqkline/get";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
} as const;

const PERIOD_MAP: Record<string, string> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "60m": "60m",
  daily: "day",
  weekly: "week",
  monthly: "month",
};

const FQT_MAP: Record<string, string> = {
  none: "none",
  qfq: "qfq",
  hfq: "hfq",
};

function buildTencentCode(code: string): string {
  const { market } = detectMarket(code);
  const prefix = { SH: "sh", SZ: "sz", HK: "hk", US: "" }[market] ?? "";
  return `${prefix}${code}`;
}

export async function fetchTencentKline(
  code: string,
  period: string,
  adjust: string,
  limit: number,
): Promise<KlineDataPoint[]> {
  const tcCode = buildTencentCode(code);
  const tcPeriod = PERIOD_MAP[period] ?? "day";
  const fqt = FQT_MAP[adjust] ?? "qfq";
  const url = `${TENCENT_KLINE}?param=${tcCode},${tcPeriod},,,${limit},${fqt}`;

  const resp = await fetch(url, { headers: HEADERS });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);

  const json = await resp.json();
  if (json.code !== 0) throw new Error(`腾讯K线接口错误: ${json.msg || json.code}`);

  const stockData = json.data?.[tcCode];
  if (!stockData) throw new Error(`未找到 ${tcCode} 的K线数据`);

  const key = `${fqt}${tcPeriod}`;
  const altKey = `${fqt}${tcPeriod === "day" ? "day" : tcPeriod}`;
  const rows: any[] = stockData[key] ?? stockData[altKey] ?? stockData["day"] ?? stockData["qfqday"] ?? [];

  return rows.map((r: any) => ({
    date: String(r[0] ?? ""),
    open: Number(r[1]) || 0,
    close: Number(r[2]) || 0,
    high: Number(r[3]) || 0,
    low: Number(r[4]) || 0,
    volume: (Number(r[5]) || 0) * 100, // 手 → 股
    amount: 0,
    amplitude: 0,
    changePct: 0,
    changeAmt: 0,
    turnover: 0,
  }));
}
