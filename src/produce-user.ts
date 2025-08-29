import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
})

const producer = kafka.producer();

// what is the benefit of using a key?
// The key is used to determine the partition the message will be sent to.
// This allows for messages with the same key to be sent to the same partition,
// which can be useful for maintaining message order for a specific user or session.

async function main() {
  await producer.connect();
  await producer.send({
    topic: "payment-done",
    messages: [{
      value: "hi there",
      key: "user1"
    }]
  });
}

main();