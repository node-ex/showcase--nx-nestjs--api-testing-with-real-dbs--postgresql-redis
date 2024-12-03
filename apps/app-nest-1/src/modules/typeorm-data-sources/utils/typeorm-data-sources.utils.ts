import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeormDataSourcesModule } from '../typeorm-data-sources.module';
import { DatabaseConfigurationService } from '../../database-configuration/services/database-configuration.service';

export async function createAppAndExtractTypeormDataSource(): Promise<DataSource> {
  await ConfigModule.envVariablesLoaded;
  const app = await NestFactory.createApplicationContext(
    TypeormDataSourcesModule,
    {
      logger: false,
    },
  );

  const typeormDataSourceService = app.get(DatabaseConfigurationService);
  const dataSource = new DataSource(
    typeormDataSourceService.getTypeormDataSourceOptions(true),
  );

  return dataSource;
}
