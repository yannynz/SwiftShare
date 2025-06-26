import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS || '').split(',') });
  private producer!: Producer;

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }
  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  emit(topic: string, message: any) {
    return this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }
}

