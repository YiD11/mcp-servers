# MCP Servers

一个 TypeScript monorepo，用于维护多个可独立启动、独立配置和独立部署的 MCP Server。

## 结构

```text
src/
  shared/
  servers/
    finance/
  workers/
    cloudflare/
docs/
  finance/
  milestone/
```

## 已引入服务

| 服务 | 包名 | 说明 |
|---|---|---|
| finance | `@mcp-servers/finance` | 基于东方财富公开接口的金融数据 MCP 服务 |

Finance 服务文档见 [docs/finance/README.md](docs/finance/README.md)。

## 开发

```bash
pnpm install
pnpm build
pnpm dev:finance
pnpm dev:worker
```

## Cloudflare Workers

Worker 名称为 `mcp-servers`，同一个入口按主题暴露 MCP 服务。

| 主题 | MCP URL |
|---|---|
| finance | `https://<worker-domain>/finance/mcp` |

本地调试：

```bash
pnpm dev:worker
```

部署：

```bash
pnpm deploy:worker
```

Codex 配置：

```bash
codex mcp add finance --url https://<worker-domain>/finance/mcp
```

## 脚本

| 命令 | 说明 |
|---|---|
| `pnpm build` | 构建全部 workspace 包 |
| `pnpm typecheck` | 检查全部 workspace 包 |
| `pnpm build:finance` | 构建 finance 服务 |
| `pnpm dev:finance` | 以 stdio 方式启动 finance 服务 |
| `pnpm dev:worker` | 本地启动 Cloudflare Worker |
| `pnpm deploy:worker` | 部署 Cloudflare Worker |
| `pnpm clean` | 删除构建产物 |
