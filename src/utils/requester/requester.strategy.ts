export abstract class RequesterStrategy<T> {
  public abstract request(body?: object): Promise<T>;
  public abstract retry(body: object, attempts: number): Promise<T>;
  public abstract requestBulk(bodies?: object[]): Promise<T[]>;
}
