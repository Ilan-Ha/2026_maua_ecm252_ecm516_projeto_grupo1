import {
  Injectable,
  OnModuleDestroy,
  OnApplicationBootstrap,
} from '@nestjs/common';
import axios from 'axios';
import { getAppConfig, SERVICE_NAME } from '../common/config/app-config';

@Injectable()
export class EventBusLifecycle
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private subscribe: string[] = [];
  private callbackUrl = '';

  async onApplicationBootstrap(): Promise<void> {
    const config = getAppConfig();
    const { back: ports } = config.ports;
    const { paths } = config;

    this.subscribe = [
      config.events.user.register,
      config.events.user['not.register'],
    ];
    this.callbackUrl = `${config.url}:${ports.user}${paths.events.event}`;

    try {
      await axios.post(
        `${config.url}:${ports.eventBus}${paths.events.subscribe}`,
        {
          calbackUrl: this.callbackUrl,
          serviceName: SERVICE_NAME,
          events: this.subscribe,
        },
      );
      console.log('Serviço de usuario inscrito');
      console.log(this.subscribe);
    } catch (err) {
      console.error(
        'Falha ao se inscrever no Event Bus (siga sem eventos):',
        err instanceof Error ? err.message : err,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    const config = getAppConfig();
    const { back: ports } = config.ports;
    const { paths } = config;

    try {
      await axios.post(
        `${config.url}:${ports.eventBus}${paths.events.unsubscribe}`,
        {
          calbackUrl: this.callbackUrl,
          serviceName: SERVICE_NAME,
          events: this.subscribe,
        },
      );
    } catch {
      // shutdown best-effort
    }
  }
}
