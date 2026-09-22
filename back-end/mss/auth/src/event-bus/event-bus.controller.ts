import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { getAppConfig } from '../common/config/app-config';

type EventBody = {
  event?: string;
  payload?: unknown;
};

@Controller()
export class EventBusController {
  private readonly eventFunctions: Record<
    string,
    (payload: unknown) => void | Promise<void>
  >;

  constructor(private readonly authService: AuthService) {
    const events = getAppConfig().events;
    this.eventFunctions = {
      [events.user.added]: async (payload) => {
        await this.authService.markUsuarioCadastrado(payload);
      },
    };
  }

  @Post('eventos')
  handleEvent(@Body() body: EventBody, @Res() res: Response): void {
    const { event, payload } = body;
    try {
      if (event && this.eventFunctions[event]) {
        void this.eventFunctions[event](payload);
      }
    } catch {
      // engole erros de handler
    }
    res.status(200).end();
  }
}
