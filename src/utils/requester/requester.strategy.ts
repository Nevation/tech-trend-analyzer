export abstract class RequesterStrategy {
  public abstract request(body?: object): Promise<any>;
  public abstract retry(body: object, attempts: number): Promise<any>;
  public abstract requestBulk(bodies?: object[]): Promise<any>;
}
