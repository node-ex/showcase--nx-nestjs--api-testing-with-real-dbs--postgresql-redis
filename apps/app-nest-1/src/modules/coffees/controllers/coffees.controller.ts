import { Body, Controller, Get, Post } from '@nestjs/common';
import { CoffeesService } from '../services/coffees.service';
import { CoffeeEntity } from '../entities/coffee.entity';
import { CreateCoffeeDto } from '../dtos/create-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  getCoffees(): Promise<CoffeeEntity[]> {
    return this.coffeesService.getCoffees();
  }

  @Post()
  createCoffee(
    @Body() createCoffeeDto: CreateCoffeeDto,
  ): Promise<CoffeeEntity> {
    return this.coffeesService.createCoffee(createCoffeeDto);
  }
}
