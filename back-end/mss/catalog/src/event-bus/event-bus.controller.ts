import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

type EventBody = {
  event?: string;
  payload?: unknown;
};

@Controller()
export class EventBusController {
  private readonly eventFunctions: Record<
    string,
    (payload: unknown) => void | Promise<void>
  > = {};

  @Post('eventos')
  handleEvent(@Body() body: EventBody, @Res() res: Response): void {
    const { event, payload } = body;
    try {
      if (event && this.eventFunctions[event]) {
        void this.eventFunctions[event](payload);
      }
    } catch {
      // igual ao Express antigo: engole erros de handler
    }
    res.status(200).end();
  }
}
