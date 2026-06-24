# Finance MCP Server

基于多数据源的金融数据 MCP 服务，为 AI Agent 提供中国股票市场实时行情、K线数据等能力。

> **⚠️ 免责声明**: 本服务使用东方财富/新浪/腾讯网页端公开接口，仅供个人学习研究使用，不构成任何投资建议。数据接口为非官方接口，可能随时变更。禁止商用。

## 功能概述

| 工具 | 说明 |
|---|---|
| `search_stock` | 根据关键词搜索股票（支持代码、名称、拼音首字母） |
| `get_stock_quote` | 获取单只股票的实时行情（价格、涨跌幅、成交量、市值等） |
| `get_kline_data` | 获取K线数据（日K/周K/月K/分钟K，支持前复权/后复权） |

## 安装与构建

```bash
# 在项目根目录
pnpm install
pnpm build

# 仅构建 finance server
pnpm build:finance
```

## 启动方式

### 开发模式

```bash
pnpm dev:finance
```

### 生产模式

```bash
node src/servers/finance/dist/index.js
```

## MCP 客户端配置

### Codex Streamable HTTP

部署 Cloudflare Worker 后，finance 主题使用同一 Worker 入口下的路径：

```bash
codex mcp add finance --url https://mcp.yid11.net/finance
```

等价的 `~/.codex/config.toml`：

```toml
[mcp_servers.finance]
url = "https://mcp.yid11.net/finance"
enabled = true
tool_timeout_sec = 60
```

### Claude Desktop

在 `claude_desktop_config.json` 中添加：

```json
{
  "mcpServers": {
    "finance": {
      "command": "node",
      "args": ["/path/to/mcp-servers/src/servers/finance/dist/index.js"]
    }
  }
}
```

### Cursor

在 `.cursor/mcp.json` 中添加：

```json
{
  "mcpServers": {
    "finance": {
      "command": "node",
      "args": ["/path/to/mcp-servers/src/servers/finance/dist/index.js"]
    }
  }
}
```

## 工具详细说明

### search_stock

根据关键词搜索股票。支持股票代码、名称、拼音首字母。

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `keyword` | string | ✅ | 搜索关键词，如 `600519`、`贵州茅台`、`gzmt` |

### get_stock_quote

获取单只股票的实时行情详情。

**参数**:
| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `code` | string | ✅ | 股票代码，如 `600519`(A股)、`00700`(港股)、`AAPL`(美股) |

### get_kline_data

获取股票K线（蜡烛图）数据。

**参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `code` | string | ✅ | - | 股票代码 |
| `period` | enum | ❌ | `daily` | K线周期：`1m`/`5m`/`15m`/`30m`/`60m`/`daily`/`weekly`/`monthly` |
| `adjust` | enum | ❌ | `qfq` | 复权类型：`none`(不复权)/`qfq`(前复权)/`hfq`(后复权) |
| `limit` | number | ❌ | `30` | 返回数据条数，1-500 |

## 数据源

- **股票搜索**: `searchapi.eastmoney.com`（东方财富）
- **实时行情**: `push2.eastmoney.com`（东方财富，失败时 fallback 到 `hq.sinajs.cn` 新浪）
- **历史K线**: `push2his.eastmoney.com`（东方财富，失败时 fallback 到 `web.ifzq.gtimg.cn` 腾讯）

支持市场：
- 沪市A股（含科创板）
- 深市A股（含创业板）
- 港股
- 美股

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `LOG_LEVEL` | `info` | 日志级别：`debug`/`info`/`warn`/`error` |
