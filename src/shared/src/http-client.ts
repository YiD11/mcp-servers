import { Logger } from "./logger.js";

export interface HttpClientOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
}

export interface RequestOptions {
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;
  private readonly logger: Logger;

  constructor(options: HttpClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "";
    this.timeout = options.timeout ?? 10_000;
    this.logger = new Logger("HttpClient");
    this.defaultHeaders = {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "application/json",
      "Accept-Language": "zh-CN,zh;q=0.9",
      ...options.defaultHeaders,
    };
  }

  async getJson<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const url = this.buildUrl(path, options.params);
    const timeout = options.timeout ?? this.timeout;

    this.logger.debug(`GET ${url}`);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        headers: { ...this.defaultHeaders, ...options.headers },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      return this.parseResponse<T>(text);
    } finally {
      clearTimeout(timer);
    }
  }

  private parseResponse<T>(text: string): T {
    const trimmed = text.trim();

    // East Money may return JSONP instead of JSON.
    const jsonpMatch = trimmed.match(/^\w+\((.+)\);?$/s);
    if (jsonpMatch) {
      return JSON.parse(jsonpMatch[1]) as T;
    }

    return JSON.parse(trimmed) as T;
  }

  private buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
    const base = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const url = new URL(base);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }
}
