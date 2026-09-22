import { Injectable } from '@nestjs/common';
import axios from 'axios';

type Subscriber = {
  serviceName: string;
  calbackUrl: string;
};

@Injectable()
export class EventBusService {
  private readonly subscribers = new Map<string, Subscriber[]>();
  private readonly registeredEvents: string[] = [];

  snapshot() {
    return {
      events: [...this.subscribers.keys()],
      subscribers: Object.fromEntries(this.subscribers),
    };
  }

  registerNewEvent(eventName: string) {
    if (this.registeredEvents.includes(eventName)) return;
    this.registeredEvents.push(eventName);
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
  }

  subscribe(serviceName: string, calbackUrl: string, eventNames: string[]) {
    for (const eventName of eventNames) {
      this.registerNewEvent(eventName);
      const clients = this.subscribers.get(eventName)!;
      const exists = clients.some(
        (c) => c.serviceName === serviceName && c.calbackUrl === calbackUrl,
      );
      if (!exists) {
        clients.push({ serviceName, calbackUrl });
        console.log(`${serviceName} escutando ${eventName}`);
      } else {
        console.log(
          `${serviceName} não se inscreveu em ${eventName} por já estar inscrito.`,
        );
      }
    }
  }

  unsubscribe(serviceName: string, calbackUrl: string, eventNames: string[]) {
    for (const eventName of eventNames) {
      const list = this.subscribers.get(eventName);
      if (!Array.isArray(list)) continue;
      this.subscribers.set(
        eventName,
        list.filter(
          (s) =>
            s.serviceName !== serviceName || s.calbackUrl !== calbackUrl,
        ),
      );
      console.log(`${serviceName} se desinscreveu de ${eventName}`);
    }
  }

  async publish(event: string, payload: unknown): Promise<void> {
    const list = this.subscribers.get(event);
    if (!Array.isArray(list)) return;
    await Promise.allSettled(
      list.map(async (subscriber) => {
        try {
          await axios.post(subscriber.calbackUrl, { event, payload });
          console.log(`Evento ${event} enviado para ${subscriber.serviceName}`);
        } catch (e) {
          console.error(
            `Erro ao enviar evento ${event} para ${subscriber.serviceName}:`,
            e,
          );
        }
      }),
    );
  }
}
