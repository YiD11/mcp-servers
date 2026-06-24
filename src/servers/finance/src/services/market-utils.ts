import { MARKET_CODE } from "../config.js";

export function detectMarket(code: string): { market: string; marketCode: number } {
  if (/^[A-Za-z]+$/.test(code)) {
    return { market: "US", marketCode: MARKET_CODE.US };
  }

  if (/^\d{5}$/.test(code)) {
    return { market: "HK", marketCode: MARKET_CODE.HK };
  }

  if (/^\d{6}$/.test(code)) {
    if (code.startsWith("6")) {
      return { market: "SH", marketCode: MARKET_CODE.SH };
    }
    if (/^(000|001|002|003|300)/.test(code)) {
      return { market: "SZ", marketCode: MARKET_CODE.SZ };
    }
  }

  return { market: "SH", marketCode: MARKET_CODE.SH };
}

export function buildSecId(code: string): string {
  const { marketCode } = detectMarket(code);
  return `${marketCode}.${code}`;
}

export function formatLargeNumber(num: number): string {
  const YI = 1_0000_0000;
  const WAN = 1_0000;

  if (Math.abs(num) >= YI) {
    return `${(num / YI).toFixed(2)}亿`;
  }
  if (Math.abs(num) >= WAN) {
    return `${(num / WAN).toFixed(2)}万`;
  }
  return String(num);
}
