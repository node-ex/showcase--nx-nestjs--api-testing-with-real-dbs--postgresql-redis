import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from '../configs/database.config';

export const databaseConfigModuleImports = [
  ConfigModule.forFeature(databaseConfig),
];
