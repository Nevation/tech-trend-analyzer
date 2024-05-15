export interface RequesterStrategy {
  exec<T>(fn: () => Promise<T>): Promise<T>;
}
