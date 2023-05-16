const hl7 = require('simple-hl7');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/meteor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema for HL7 messages
const hl7MessageSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now },
});
const HL7Message = mongoose.model('HL7Message', hl7MessageSchema);

// Create HL7 server
const app = hl7.tcp();

app.use(async function (req, res, next) {
    
    const hl7Message = new HL7Message({ message: req.msg.log() });


    try {
        await hl7Message.save();
        console.log('HL7 message saved to MongoDB');
      } catch (error) {
        console.error('Error saving HL7 message:', error);
      }
    console.log(req.msg.log());
    next();
});

// Middleware to send the ACK
app.use(function (req, res, next) {
    console.log('******sending ack*****');
    res.end();
});

// Middleware for error handling
app.use(function (err, req, res, next) {
    console.log('******ERROR*****');
    console.log(err);
    const msa = res.ack.getSegment('MSA');
    msa.setField(1, 'AR');
    res.ack.addSegment('ERR', err.message);
    res.end();
});

// Start the application if withListener is enabled
app.start(parseInt(1234));




