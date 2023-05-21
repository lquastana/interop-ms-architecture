export interface IMessage {
  header: any;
  content: string;
  timestamp: Date;

  save():Promise<IMessage>
}

export interface IComponent {
  name: string
  queueConnection: any
  queueChannel: any
  mongoDb: any
  options: {}

  start():Promise<void>
  stop():void
  storeMessage(message: IMessage): Promise<IMessage|null>
  sendToQueue(message: IMessage): void;
}
export interface IConsumer extends IComponent{
  subscribe():void
  unsubscribe():void
}



export interface IProcessor extends IComponent{
  subscribe():void
  unsubscribe():void
  process(message:IMessage):IMessage
}

export interface IProducer {
  subscribe():void
  unsubscribe():void
  subscribeReplay():void
  unsubscribeReplay():void
}

