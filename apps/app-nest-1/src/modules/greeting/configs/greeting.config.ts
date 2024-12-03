import { registerAs } from '@nestjs/config';

const GREETING_CONFIG_NAMESPACE = 'greetingConfig';

export const greetingConfig = registerAs(GREETING_CONFIG_NAMESPACE, () => ({
  text: process.env['GREETING__TEXT'],
}));
