import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private httpAdapter: AbstractHttpAdapter) {
    super();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    Logger.error(exception?.message, exception?.name);

    if (host.getType() == 'http') {
      const ctx = host.switchToHttp();
      this.httpAdapter.reply(ctx.getResponse(), exception, 200);
    }

    return exception;
  }
}
