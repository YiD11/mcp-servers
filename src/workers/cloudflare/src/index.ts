import { createMcpHandler } from "agents/mcp";
import { createFinanceServer } from "@mcp-servers/finance/server";

const services: Record<string, ServiceDefinition> = {
  finance: {
    createServer: createFinanceServer,
  },
};

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);
    const topic = url.pathname.slice(1).split("/")[0];
    const service = services[topic];

    if (service && url.pathname === `/${topic}`) {
      return createMcpHandler(service.createServer(), { route: `/${topic}` })(request, env, ctx);
    }

    return Response.json({
      name: "mcp-servers",
      services: Object.fromEntries(
        Object.keys(services).map((name) => [name, `/${name}`]),
      ),
    });
  },
} satisfies ExportedHandler<Env>;

interface ServiceDefinition {
  createServer: () => Parameters<typeof createMcpHandler>[0];
}

interface Env {}
