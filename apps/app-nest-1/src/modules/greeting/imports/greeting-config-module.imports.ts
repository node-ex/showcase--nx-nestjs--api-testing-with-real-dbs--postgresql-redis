import { ConfigModule } from '@nestjs/config';
import { greetingConfig } from '../configs/greeting.config';

export const greetingConfigModuleImports = [
  ConfigModule.forFeature(greetingConfig),
];
