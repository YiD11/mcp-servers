import type { StockQuote } from "./types.js";
import { detectMarket } from "./market-utils.js";

const SINA_HQ = "https://hq.sinajs.cn/list=";
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  Referer: "https://finance.sina.com.cn/",
} as const;

function buildSinaSymbol(code: string): string {
  const { market } = detectMarket(code);
  const prefix = { SH: "sh", SZ: "sz", HK: "hk", US: "" }[market] ?? "";
  return `${prefix}${code}`;
}

export async function fetchSinaQuote(code: string): Promise<StockQuote> {
  const symbol = buildSinaSymbol(code);
  const resp = await fetch(`${SINA_HQ}${symbol}`, { headers: HEADERS });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);

  const buf = await resp.arrayBuffer();
  const raw = new TextDecoder("gbk").decode(buf);

  const match = raw.match(/="(.+?)"/);
  if (!match?.[1]) throw new Error("新浪返回数据格式异常");

  const fields = match[1].split(",");

  const num = (i: number): number | null => {
    const v = parseFloat(fields[i]);
    return Number.isFinite(v) ? v : null;
  };

  return {
    code,
    name: fields[0] ?? "",
    price: num(3),
    change: num(31) !== null ? num(31)! : num(3) !== null && num(2) !== null ? num(3)! - num(2)! : null,
    changePct: num(32),
    open: num(1),
    high: num(4),
    low: num(5),
    prevClose: num(2),
    volume: num(8),
    amount: num(9),
    pe: num(39) ?? num(44),
    pb: num(46),
    marketCap: num(45),
    floatCap: null,
    turnover: num(38),
    amplitude: num(43),
  };
}
