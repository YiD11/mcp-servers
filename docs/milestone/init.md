
你正在参与一个全新的 TypeScript 项目。这个项目打算维护多个独立的 mcp server。

# 项目背景

这些 MCP Server 可能覆盖不同领域，例如：
- 文档处理
- 金融数据与金融分析
- 代码开发与软件工程
- 未来可能增加的其他领域

这些参考仓库不代表本项目的架构设计，不应直接决定本项目的：
- 目录结构；
- Server 划分方式；
- Tool 粒度；
- 命名方式；
- 配置体系；
- 依赖关系；
- 部署方式；
- 模块边界。

不要简单复制、拼接或移植参考仓库。项目架构应从“一个仓库长期维护多个 MCP 服务”的目标出发独立设计。

# 核心立项目标

本项目的核心目标是：使用一个结构清晰、可扩展、可测试、可独立部署的 TypeScript 代码仓库，维护多个逻辑独立的 MCP Server。

这里的“一个仓库”不等于“一个巨型 MCP Server”。

不同领域的 MCP Server 应当可以：
- 独立启动；
- 独立配置；
- 独立暴露 MCP Tools、Resources 和 Prompts；
- 独立连接外部服务；
- 独立设置权限和凭证；
- 独立测试；
- 独立部署；
- 独立启用或关闭；
- 在必要时共享经过明确设计的基础模块。

例如，未来可能存在：
- 文档处理 MCP Server；
- 金融数据 MCP Server；
- 代码开发 MCP Server。

这些 Server 可以位于同一个代码仓库中，但不能因为共享仓库而形成紧密耦合。

# 仓库组织

仓库目录阅读：
- `src/` 组织所有 TypeScript 源代码
- `docs/` 组织所有文档，该目录不是简单的一层目录，其复杂度可以随着项目的发展而增加。
  - 比如 `docs/deployment/` 可以存放部署相关的文档。
  - 比如 `docs/finance/` 可以存放金融数据相关的文档。
  - 比如 `docs/roadmap/` 可以存放项目的发展路线图。
  - 比如 `docs/daily/` 可以存放每日记录的文档。
  - 文档目录下存放的文档应该足够功能强大，为 agent 提供可能远超代码本身的上下文理解能力。

## 代码组织

提供一个代码组织形式，《代码组织》小节的内容仅供参考，在实际 agent 开发时，可以结合其他资料作为参考依据，不直接应用于决策和实施。

``` plain-text
src/
├── servers/
│   ├── docs/
│   │   ├── server.ts
│   │   ├── config.ts
│   │   ├── register.ts
│   │   ├── tools/
│   │   ├── resources/
│   │   ├── prompts/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── schemas/
│   │   └── index.ts
│   │
│   ├── finance/
│   │   ├── server.ts
│   │   ├── config.ts
│   │   ├── register.ts
│   │   ├── tools/
│   │   ├── resources/
│   │   ├── prompts/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── schemas/
│   │   └── index.ts
│   │
│   └── development/
│       ├── server.ts
│       ├── config.ts
│       ├── register.ts
│       ├── tools/
│       ├── resources/
│       ├── prompts/
│       ├── services/
│       ├── providers/
│       ├── schemas/
│       └── index.ts
│
├── runtime/
│   ├── create-server.ts
│   ├── server-registry.ts
│   ├── lifecycle.ts
│   ├── context.ts
│   └── errors.ts
│
├── transports/
│   ├── stdio.ts
│   └── streamable-http.ts
│
├── config/
│   ├── load-config.ts
│   ├── common-schema.ts
│   └── environment.ts
│
├── shared/
│   ├── logging/
│   ├── http/
│   ├── cache/
│   ├── errors/
│   └── types/
│
├── cli/
│   ├── commands/
│   └── main.ts
│
└── index.ts
```

每个 Server 目录负责：
- 创建和配置该 Server；
- 注册该 Server 暴露的 Tools、Resources 和 Prompts；
- 组织该主题相关的业务逻辑；
- 管理该 Server 使用的外部服务和配置；
- 提供独立启动和测试能力。
src/runtime/ 用于组织多个 Server 共用的 MCP 运行时能力，例如：

创建 MCP Server；
- Server 注册和查找；
- 生命周期管理；
- 请求上下文；
- MCP 错误转换。