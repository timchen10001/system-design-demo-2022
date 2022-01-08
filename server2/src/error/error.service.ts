import { HttpException } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { ErrorCode } from './enum/error-code.enum';

export class ErrorService {}
registerEnumType(ErrorCode, { name: 'ErrorCode' });

class GeneralException extends HttpException {
  constructor(prefix?: string, error?: any, httpStatus?: ErrorCode) {
    let parsed =
      error?.response?.data?.error ||
      error?.response?.data?.errors?.[0]?.message ||
      error?.message ||
      error;

    parsed = typeof parsed === 'string' ? parsed : 'Server Error';

    let errorMessage = prefix
      ? prefix + ' - ' + parsed.toLowerCase()
      : parsed.toLowerCase();

    errorMessage = errorMessage
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    super(errorMessage, httpStatus);
  }
}

export class InvalidInputException extends GeneralException {
  constructor(
    error?: any,
    httpStatus: ErrorCode = ErrorCode.BAD_INPUT_DEFAULT,
  ) {
    super('INVALID_INPUT_ERROR', error, httpStatus);
  }
}
