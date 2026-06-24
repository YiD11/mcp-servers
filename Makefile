.PHONY: build-worker deploy-worker deploy-worker-dry-run dev-worker

build-worker:
	pnpm --filter @mcp-servers/cloudflare-worker run build

deploy-worker:
	pnpm --filter @mcp-servers/cloudflare-worker exec wrangler deploy

deploy-worker-dry-run:
	pnpm --filter @mcp-servers/cloudflare-worker exec wrangler deploy --dry-run

dev-worker:
	pnpm --filter @mcp-servers/cloudflare-worker run dev
