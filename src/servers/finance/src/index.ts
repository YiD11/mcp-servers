#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createFinanceServer } from "./server.js";
import { Logger } from "@mcp-servers/shared";

const logger = new Logger("finance");

async function main() {
  const server = createFinanceServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Finance MCP Server started (stdio)");
}

main().catch((error) => {
  logger.error("Fatal error", error);
  process.exit(1);
});
