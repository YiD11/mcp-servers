import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EastMoneyClient } from "../services/eastmoney-client.js";

export function registerMarketTool(server: McpServer, client: EastMoneyClient): void {
  server.registerTool(
    "get_market_overview",
    {
      title: "市场行情概览",
      description:
        "获取A股市场行情列表，可按涨跌幅、成交量、市值等排序，支持沪市、深市、创业板、科创板分类查看。",
      inputSchema: {
        market: z
          .enum(["sha", "sza", "cyb", "kcb"])
          .default("sha")
          .describe("市场：sha=沪市A股, sza=深市A股, cyb=创业板, kcb=科创板"),
        sort_field: z
          .enum(["price", "change_pct", "volume", "amount", "turnover", "market_cap"])
          .default("change_pct")
          .describe("排序字段"),
        sort_order: z
          .enum(["asc", "desc"])
          .default("desc")
          .describe("排序方向"),
        limit: z
          .number()
          .min(1)
          .max(100)
          .default(20)
          .describe("返回条数"),
      },
    },
    async ({ market, sort_field, sort_order, limit }) => {
      try {
        const items = await client.getMarketList(market, sort_field, sort_order, limit);

        if (items.length === 0) {
          return { content: [{ type: "text", text: "未获取到市场数据" }] };
        }

        const header =
          "| 代码 | 名称 | 最新价 | 涨跌幅 | 涨跌额 | 成交量 | 成交额 | 换手率 | 市盈率 |\n" +
          "| --- | --- | --- | --- | --- | --- | --- | --- | --- |";
        const rows = items
          .map((i) => {
            const fmt = (v: number | null, suffix = "") =>
              v !== null ? `${v}${suffix}` : "-";
            return `| ${i.code} | ${i.name} | ${fmt(i.price)} | ${fmt(i.changePct, "%")} | ${fmt(i.changeAmt)} | ${fmt(i.volume)} | ${fmt(i.amount)} | ${fmt(i.turnover, "%")} | ${fmt(i.pe)} |`;
          })
          .join("\n");

        return { content: [{ type: "text", text: `${header}\n${rows}` }] };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    },
  );
}
