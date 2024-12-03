import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigurationModule } from '../../modules/database-configuration/database-configuration.module';
import { DatabaseConfigurationService } from '../../modules/database-configuration/services/database-configuration.service';

export const rootDatabaseModuleImports = [
  TypeOrmModule.forRootAsync({
    imports: [DatabaseConfigurationModule],
    useFactory: (databaseConfigurationService: DatabaseConfigurationService) =>
      databaseConfigurationService.getTypeormModuleOptions(),
    inject: [DatabaseConfigurationService],
  }),
];
