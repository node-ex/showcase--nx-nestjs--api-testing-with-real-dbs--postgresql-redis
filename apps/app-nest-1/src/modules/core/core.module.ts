import { Module } from '@nestjs/common';
import { GreetingModule } from '../greeting/greeting.module';
import { rootConfigModuleImports } from '../../shared/imports/root-config-module.imports';
import { globalValidationPipeProviders } from '../../shared/providers/global-validation-pipe.providers';
import { CoffeesModule } from '../coffees/coffees.module';
import { rootDatabaseModuleImports } from '../../shared/imports/root-database-module.imports';

@Module({
  imports: [
    ...rootConfigModuleImports,
    ...rootDatabaseModuleImports,
    GreetingModule,
    CoffeesModule,
  ],
  providers: [...globalValidationPipeProviders],
})
export class CoreModule {}
