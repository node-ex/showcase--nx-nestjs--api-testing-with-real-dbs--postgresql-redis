import { Inject, Injectable } from '@nestjs/common';
import { databaseConfig as _databaseConfig } from '../configs/database.config';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import path from 'path';

@Injectable()
export class DatabaseConfigurationService {
  constructor(
    @Inject(_databaseConfig.KEY)
    private databaseConfig: ConfigType<typeof _databaseConfig>,
  ) {}

  getTypeormModuleOptions(): TypeOrmModuleOptions {
    return {
      ...this.getTypeormDataSourceOptions(),
      autoLoadEntities: true,
    };
  }

  getTypeormDataSourceOptions(
    shouldLoadEntitiesUsingPaths = false,
  ): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.databaseConfig.host,
      port: this.databaseConfig.port,
      username: this.databaseConfig.username,
      password: this.databaseConfig.password,
      database: this.databaseConfig.database,
      /*
       * This only properly works when running TypeORM CLI commands
       * using ts-node. When running NestJS app using NestJS CLI, JS code would
       * import uncompiled TS code of entities.
       */
      ...(shouldLoadEntitiesUsingPaths && {
        entities: [
          path.resolve(
            __dirname,
            '..',
            '..',
            '..',
            'modules',
            '**',
            '*.entity.ts',
          ),
        ],
      }),
      /*
       * Its ok to use paths here, because migrations are run via
       * TypeORM CLI commands using ts-node
       */
      migrations: [
        path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          'migrations',
          'files',
          '*.ts',
        ),
      ],
      ...(this.databaseConfig.shouldSynchronize ? { synchronize: true } : {}),
    };
  }
}
