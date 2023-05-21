const amqp = require('amqplib');
const mongoose = require('mongoose');
import { IComponent,IMessage } from "./eip.interface";

// RabbitMQ configuration
const rabbitMQConfig = {
    url: 'amqp://rabbitmq',
    exchange: 'hl7_exchange',
    queue: 'hl7_queue',
};



export class Component implements IComponent
{
    name: string
    queueConnection: any
    queueChannel: any
    mongoDb: any
    options: {}

    constructor(name: string,options: {}) {
        this.name = name;
        this.options = options;
      }

      async start(): Promise<void> {
        this.queueConnection = await amqp.connect(rabbitMQConfig.url);
        this.queueChannel = await this.queueConnection.createChannel();
        await this.queueChannel.assertExchange(rabbitMQConfig.exchange, 'direct', { durable: true });
        await this.queueChannel.assertQueue(rabbitMQConfig.queue, { durable: true });
        await this.queueChannel.bindQueue(rabbitMQConfig.queue, rabbitMQConfig.exchange, '');

        // Connect to MongoDB
        mongoose.connect('mongodb://mongodb:27017/meteor', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        this.mongoDb = mongoose.connection;
        this.mongoDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
        this.mongoDb.once('open', () => {
            console.log('Connected to MongoDB');
        });
          
      }

      async stop(): Promise<void> {
        await this.queueChannel.close();
        await this.queueConnection.close();
        await this.mongoDb.close()
      }

      async storeMessage(message: IMessage): Promise<IMessage|null> {
        try {
            await message.save();
            console.log('HL7 message saved to MongoDB');
            return Promise.resolve(message);
            
          } catch (error) {
            console.error('Error saving HL7 message:', error);
            return Promise.resolve(null);
          }
        
      }

      async sendToQueue(message: IMessage): Promise<void> {

        try {
            await this.queueChannel.publish(rabbitMQConfig.exchange, '', Buffer.from(message.content));
            console.log('Message sent to RabbitMQ');
          } catch (error) {
            console.error('Error publishing message to RabbitMQ:', error);
        }
        
      }



    
}