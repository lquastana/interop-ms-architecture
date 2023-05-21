import Message from "./message.model";
import { Component } from "./eip";
import { IConsumer } from "./eip.interface";
const hl7 = require('simple-hl7');

export class MLLPConsumer extends Component implements IConsumer
{

  app = hl7.tcp();


  async subscribe(): Promise<void> {
    // Create HL7 server
    
    this.app.use(async (req: any, res: any, next: any) => {
    
      const message = new Message({ content: req.msg.log() });
      await this.storeMessage(message)
      await this.sendToQueue(message)
      next();
});

// Middleware to send the ACK
this.app.use(function (req: any, res: any, next: any) {
    console.log('******sending ack*****');
    res.end();
});

// Middleware for error handling
this.app.use(function (err:any, req:any, res:any, next:any) {
    console.log('******ERROR*****');
    console.log(err);
    const msa = res.ack.getSegment('MSA');
    msa.setField(1, 'AR');
    res.ack.addSegment('ERR', err.message);
    res.end();
});

// Start the application if withListener is enabled
this.app.start(1234);

  }
  
  async unsubscribe(): Promise<void> {
    this.app.stop();
  }

}
