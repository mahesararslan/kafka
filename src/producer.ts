import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"]
});

const producer = kafka.producer();

async function main() {
  // Producer
  await producer.connect();
  await producer.send({
    topic: "payment-done",
    messages: [{
      value: "hi there from the nodejs producer"
    }]
  });

}

main().catch(console.error);