export interface IPublisher {
  publish(channel: string, message: string): Promise<void>;
}
