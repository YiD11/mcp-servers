import { HttpClient, McpToolError } from "@mcp-servers/shared";
import { API_BASE, SEARCH_TOKEN, KLINE_PERIOD, ADJUST_TYPE } from "../config.js";
import type { StockSearchResult, StockQuote, KlineDataPoint } from "./types.js";
import { buildSecId } from "./market-utils.js";
import { fetchSinaQuote } from "./sina-quote.js";
import { fetchTencentKline } from "./tencent-kline.js";

export class EastMoneyClient {
  private readonly http: HttpClient;

  constructor() {
    this.http = new HttpClient({
      defaultHeaders: {
        Referer: "https://quote.eastmoney.com/",
      },
    });
  }

  async searchStock(keyword: string): Promise<StockSearchResult[]> {
    try {
      const response = await this.http.getJson<any>(
        `${API_BASE.SEARCH}/api/suggest/get`,
        {
          params: {
            input: keyword,
            type: 14,
            token: SEARCH_TOKEN,
          },
        },
      );

      const items = response?.QuotationCodeTable?.Data;
      if (!Array.isArray(items)) return [];

      return items.slice(0, 10).map((item: any) => ({
        code: item.Code,
        name: item.Name,
        market: { 1: "SH", 0: "SZ", 116: "HK", 105: "US" }[item.MktNum as number] ?? String(item.MktNum),
        type: item.SecurityTypeName ?? "stock",
        secid: `${item.MktNum}.${item.Code}`,
      }));
    } catch (error) {
      throw new McpToolError(
        `搜索股票失败 (${keyword}): ${error instanceof Error ? error.message : String(error)}`,
        "SEARCH_ERROR",
        error,
      );
    }
  }

  async getRealtimeQuote(code: string): Promise<StockQuote> {
    const secid = buildSecId(code);
    try {
      const response = await this.http.getJson<any>(
        `${API_BASE.QUOTE}/api/qt/stock/get`,
        {
          params: {
            secid,
            fields: "f43,f44,f45,f46,f47,f48,f50,f51,f52,f55,f57,f58,f60,f71,f116,f117,f162,f167,f168,f169,f170,f171,f292",
          },
        },
      );

      const d = response?.data;
      if (!d) throw new Error("未获取到行情数据");

      return {
        code: String(d.f57 ?? code),
        name: String(d.f58 ?? ""),
        price: div100(safeNum(d.f43)),
        changePct: div100(safeNum(d.f170)),
        change: div100(safeNum(d.f169)),
        open: div100(safeNum(d.f46)),
        high: div100(safeNum(d.f44)),
        low: div100(safeNum(d.f45)),
        prevClose: div100(safeNum(d.f60)),
        volume: safeNum(d.f47),
        amount: safeNum(d.f48),
        pe: div100(safeNum(d.f162)),
        pb: div100(safeNum(d.f167)),
        marketCap: safeNum(d.f116),
        floatCap: safeNum(d.f117),
        turnover: div100(safeNum(d.f168)),
        amplitude: div100(safeNum(d.f171)),
      };
    } catch {
      return fetchSinaQuote(code);
    }
  }

  async getKline(
    code: string,
    period: string,
    adjust: string,
    limit: number,
  ): Promise<KlineDataPoint[]> {
    try {
      const secid = buildSecId(code);
      const response = await this.http.getJson<any>(
        `${API_BASE.HISTORY}/api/qt/stock/kline/get`,
        {
          params: {
            secid,
            klt: KLINE_PERIOD[period] ?? KLINE_PERIOD.daily,
            fqt: ADJUST_TYPE[adjust] ?? ADJUST_TYPE.none,
            fields1: "f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11",
            fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
            beg: 0,
            end: 20500101,
          },
        },
      );

      const klines: string[] = response?.data?.klines ?? [];
      return klines.slice(-limit).map(parseKlineLine);
    } catch {
      return fetchTencentKline(code, period, adjust, limit);
    }
  }
}

function safeNum(val: unknown): number | null {
  if (val === undefined || val === null || val === "-" || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

// The stock/get endpoint scales price and ratio fields by 100.
function div100(val: number | null): number | null {
  return val !== null ? val / 100 : null;
}

function parseKlineLine(line: string): KlineDataPoint {
  const parts = line.split(",");
  return {
    date: parts[0],
    open: Number(parts[1]),
    close: Number(parts[2]),
    high: Number(parts[3]),
    low: Number(parts[4]),
    volume: Number(parts[5]),
    amount: Number(parts[6]),
    amplitude: Number(parts[7]),
    changePct: Number(parts[8]),
    changeAmt: Number(parts[9]),
    turnover: Number(parts[10]),
  };
}
