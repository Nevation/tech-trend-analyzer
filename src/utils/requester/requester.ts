import { RequesterStrategy } from './requester.strategy';

type Headers = Record<string, string>;
type Body = Record<string, any>;

export class Requester {
  constructor(private readonly requesterStrategy: RequesterStrategy) {}

  private async request<T = any>(url: string, requestInit: RequestInit) {
    return await this.requesterStrategy.exec(() => fetch(url, requestInit).then((res) => res.json()) as Promise<T>);
  }

  public async get<T = any>(url: string, query?: Record<string, any>, headers?: Headers) {
    if (query === undefined) {
      return await this.request<T>(url, { headers });
    }

    const fullUrl = `${url}?${new URLSearchParams(query).toString()}`;
    return await this.request<T>(fullUrl, { headers });
  }

  public async post<T = any>(url: string, body: Body, headers?: Headers) {
    return await this.request<T>(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }

  public async delete<T = any>(url: string, body: Body, headers: Headers) {
    return await this.request<T>(url, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
  }
}
