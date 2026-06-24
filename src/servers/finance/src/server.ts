import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { EastMoneyClient } from "./services/eastmoney-client.js";
import { registerAllTools } from "./tools/index.js";

export function createFinanceServer(): McpServer {
  const server = new McpServer({
    name: "finance-data-server",
    version: "0.1.0",
  });

  const client = new EastMoneyClient();
  registerAllTools(server, client);

  return server;
}
