import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const globalValidationPipeProviders = [
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      // Enable only when process.NODE_ENV === 'development'
      enableDebugMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  },
];
