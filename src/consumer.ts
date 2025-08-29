import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

// This is code for consumer to recieve messages produced by the producer.

const consumer = kafka.consumer({groupId: "my-app3"});

async function main() {

  await consumer.connect();
  await consumer.subscribe({
    topic: "payment-done",
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition: partition, 
        offset: message.offset,
        value: message?.value?.toString(),
      });
    },
  });
}

main().catch(console.error);