import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EastMoneyClient } from "../services/eastmoney-client.js";
import { formatLargeNumber } from "../services/market-utils.js";

export function registerQuoteTool(server: McpServer, client: EastMoneyClient): void {
  server.registerTool(
    "get_stock_quote",
    {
      title: "获取实时行情",
      description:
        "获取单只股票的实时行情数据，包括最新价、涨跌幅、成交量、市值等详细信息。",
      inputSchema: {
        code: z.string().describe("股票代码，如 600519、000001、00700、AAPL"),
      },
    },
    async ({ code }) => {
      try {
        const q = await client.getRealtimeQuote(code);

        const fmt = (v: number | null, suffix = "") =>
          v !== null ? `${v}${suffix}` : "-";
        const fmtLarge = (v: number | null) =>
          v !== null ? formatLargeNumber(v) : "-";

        const text = [
          `## ${q.name} (${q.code})`,
          "",
          "### 价格信息",
          `最新价: ${fmt(q.price)} | 涨跌额: ${fmt(q.change)} | 涨跌幅: ${fmt(q.changePct, "%")}`,
          `今开: ${fmt(q.open)} | 最高: ${fmt(q.high)} | 最低: ${fmt(q.low)} | 昨收: ${fmt(q.prevClose)}`,
          "",
          "### 成交信息",
          `成交量: ${fmtLarge(q.volume)} | 成交额: ${fmtLarge(q.amount)} | 换手率: ${fmt(q.turnover, "%")} | 振幅: ${fmt(q.amplitude, "%")}`,
          "",
          "### 估值信息",
          `市盈率(PE): ${fmt(q.pe)} | 市净率(PB): ${fmt(q.pb)}`,
          `总市值: ${fmtLarge(q.marketCap)} | 流通市值: ${fmtLarge(q.floatCap)}`,
        ].join("\n");

        return { content: [{ type: "text", text }] };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    },
  );
}
