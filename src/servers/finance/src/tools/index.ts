import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { EastMoneyClient } from "../services/eastmoney-client.js";
import { registerSearchTool } from "./search.js";
import { registerQuoteTool } from "./quote.js";
import { registerKlineTool } from "./kline.js";
import { registerMarketTool } from "./market.js";

export { registerSearchTool } from "./search.js";
export { registerQuoteTool } from "./quote.js";
export { registerKlineTool } from "./kline.js";
export { registerMarketTool } from "./market.js";

export function registerAllTools(server: McpServer, client: EastMoneyClient): void {
  registerSearchTool(server, client);
  registerQuoteTool(server, client);
  registerKlineTool(server, client);
  registerMarketTool(server, client);
}
