import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EastMoneyClient } from "../services/eastmoney-client.js";

export function registerKlineTool(server: McpServer, client: EastMoneyClient): void {
  server.registerTool(
    "get_kline_data",
    {
      title: "获取K线数据",
      description:
        "获取股票的K线（蜡烛图）数据，支持日K、周K、月K和分钟级别数据，可选前复权/后复权。",
      inputSchema: {
        code: z.string().describe("股票代码"),
        period: z
          .enum(["1m", "5m", "15m", "30m", "60m", "daily", "weekly", "monthly"])
          .default("daily")
          .describe("K线周期"),
        adjust: z
          .enum(["none", "qfq", "hfq"])
          .default("qfq")
          .describe("复权类型：none=不复权, qfq=前复权, hfq=后复权"),
        limit: z
          .number()
          .min(1)
          .max(500)
          .default(30)
          .describe("返回数据条数，最多500条"),
      },
    },
    async ({ code, period, adjust, limit }) => {
      try {
        const points = await client.getKline(code, period, adjust, limit);

        if (points.length === 0) {
          return { content: [{ type: "text", text: "未获取到K线数据" }] };
        }

        const header =
          "| 日期 | 开盘 | 收盘 | 最高 | 最低 | 涨跌幅 | 成交量 | 成交额 | 换手率 |\n" +
          "| --- | --- | --- | --- | --- | --- | --- | --- | --- |";
        const rows = points
          .map(
            (p) =>
              `| ${p.date} | ${p.open} | ${p.close} | ${p.high} | ${p.low} | ${p.changePct}% | ${p.volume} | ${p.amount} | ${p.turnover}% |`,
          )
          .join("\n");

        return { content: [{ type: "text", text: `${header}\n${rows}` }] };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    },
  );
}
