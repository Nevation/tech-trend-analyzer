import { RequesterStrategy } from './requester.strategy';
import { HttpRequestMethodType } from './requester.type';

export class FetchRequester extends RequesterStrategy {
  constructor(
    private readonly url: string,
    private readonly headers: Record<string, string>,
    private readonly method: HttpRequestMethodType
  ) {
    super();
  }

  public async request(body?: object): Promise<Response> {
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(body),
    });
  }

  public async retry(body: object = {}, attempts: number, delay: number = 100): Promise<Response> {
    for (let trial = 0; trial < attempts; trial++) {
      try {
        return this.request(body);
      } catch (error) {
        if (trial === attempts - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, trial)));
      }
    }
  }

  public requestBulk(bodies?: object[]): Promise<Response[]> {
    const requests = bodies.map((body) => this.request(body));
    return Promise.all(requests);
  }
}
