import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export function createHttpClient(opts: {
  baseURL: string;
  timeout: number;
  retries: number;
  headers?: Record<string, string>;
}): AxiosInstance {
  const client = axios.create({
    baseURL: opts.baseURL,
    timeout: opts.timeout,
    headers: opts.headers,
  });

  axiosRetry(client, {
    retries: opts.retries,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (err) =>
      axiosRetry.isNetworkOrIdempotentRequestError(err) ||
      (err.response?.status ?? 0) >= 500,
  });

  client.interceptors.request.use((cfg) => {
    (cfg as any).meta = { startedAt: Date.now() };
    return cfg;
  });
  client.interceptors.response.use(
    (res) => {
      const ms = Date.now() - (res.config as any).meta.startedAt;
      return res;
    },
    (err) => {
      const cfg: any = err.config ?? {};
      const ms = Date.now() - (cfg.meta?.startedAt ?? Date.now());
      return Promise.reject(err);
    },
  );

  return client;
}