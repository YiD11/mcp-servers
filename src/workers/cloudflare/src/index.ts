import { createMcpHandler } from "agents/mcp";
import { createFinanceServer } from "@mcp-servers/finance/server";

const services: Record<string, { path: string; handle: HandlerFactory }> = {
  finance: {
    path: "/finance/mcp",
    handle: () => createMcpHandler(createFinanceServer(), { route: "/finance/mcp" }),
  },
};

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);

    for (const service of Object.values(services)) {
      if (url.pathname === service.path) {
        return service.handle()(request, env, ctx);
      }
    }

    return Response.json({
      name: "mcp-servers",
      services: Object.fromEntries(
        Object.entries(services).map(([name, service]) => [name, service.path]),
      ),
    });
  },
} satisfies ExportedHandler<Env>;

type HandlerFactory = () => (request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>;

interface Env {}
