export interface IConsumer {
  subscribe(channel: string): void;
  processMessage(channel: string, message: string): void;
  unsubscribe(channel: string): void;
}
