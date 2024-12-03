import { Module } from '@nestjs/common';
import { CoffeesController } from './controllers/coffees.controller';
import { CoffeesService } from './services/coffees.service';
import { coffeeEntityDatabaseModuleImports } from './imports/coffee-entity-database-module.imports';

@Module({
  imports: [...coffeeEntityDatabaseModuleImports],
  controllers: [CoffeesController],
  providers: [CoffeesService],
})
export class CoffeesModule {}
