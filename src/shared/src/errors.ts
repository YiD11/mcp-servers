export class McpToolError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "McpToolError";
  }

  toToolResponse() {
    return {
      content: [{ type: "text" as const, text: `Error: ${this.message}` }],
      isError: true,
    };
  }
}
