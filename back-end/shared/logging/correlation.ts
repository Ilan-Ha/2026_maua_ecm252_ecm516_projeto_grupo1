import { AsyncLocalStorage } from 'async_hooks';

export const correlationStore = new AsyncLocalStorage<string>();

export function getCorrelationId(): string | undefined {
  return correlationStore.getStore();
}
