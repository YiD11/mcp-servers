import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EastMoneyClient } from "../services/eastmoney-client.js";

export function registerSearchTool(server: McpServer, client: EastMoneyClient): void {
  server.registerTool(
    "search_stock",
    {
      title: "搜索股票",
      description:
        "根据关键词搜索股票（支持代码、名称、拼音首字母）。返回匹配的股票列表，包含代码、名称、市场等信息。",
      inputSchema: {
        keyword: z
          .string()
          .describe("搜索关键词，如股票代码(600519)、名称(贵州茅台)或拼音(gzmt)"),
      },
    },
    async ({ keyword }) => {
      try {
        const results = await client.searchStock(keyword);

        if (results.length === 0) {
          return { content: [{ type: "text", text: `未找到与 "${keyword}" 匹配的股票` }] };
        }

        const header = "| 代码 | 名称 | 市场 | 类型 |\n| --- | --- | --- | --- |";
        const rows = results
          .map((r) => `| ${r.code} | ${r.name} | ${r.market} | ${r.type} |`)
          .join("\n");

        return { content: [{ type: "text", text: `${header}\n${rows}` }] };
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `Error: ${msg}` }], isError: true };
      }
    },
  );
}
