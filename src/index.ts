import express from 'express';
import cors from 'cors';
import { Kafka } from "kafkajs";

const app = express();
const port = 3000;

// Allow access from anywhere
app.use(cors());

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Producer route
app.get('/produce', async (req, res) => {
  try {
    const producer = kafka.producer();
    await producer.connect();
    
    await producer.send({
      topic: "payment-done",
      messages: [{
        value: "hi there from the nodejs producer"
      }]
    });
    
    await producer.disconnect();
    res.json({ message: 'Message produced successfully' });
  } catch (error) {
    console.error('Error producing message:', error);
    res.status(500).json({ error: 'Failed to produce message' });
  }
});

// Consumer route
app.get('/consume', async (req, res) => {
  try {
    const consumer = kafka.consumer({groupId: "my-app3"});
    await consumer.connect();
    
    await consumer.subscribe({
      topic: "payment-done",
      fromBeginning: true
    });

    const messages: any[] = [];
    let messageCount = 0;
    const maxMessages = 5; // Limit messages to avoid hanging

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageData = {
          partition: partition,
          offset: message.offset,
          value: message?.value?.toString(),
        };
        
        console.log(messageData);
        messages.push(messageData);
        messageCount++;

        if (messageCount >= maxMessages) {
          await consumer.disconnect();
        }
      },
    });

    // Wait a bit for messages then return
    setTimeout(async () => {
      await consumer.disconnect();
      res.json({ 
        message: 'Consumer ran successfully', 
        messagesReceived: messages 
      });
    }, 2000);

  } catch (error) {
    console.error('Error consuming messages:', error);
    res.status(500).json({ error: 'Failed to consume messages' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});