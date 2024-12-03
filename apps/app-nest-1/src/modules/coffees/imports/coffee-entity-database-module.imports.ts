import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeEntity } from '../entities/coffee.entity';

export const coffeeEntityDatabaseModuleImports = [
  TypeOrmModule.forFeature([CoffeeEntity]),
];
