import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoffeeEntity } from '../entities/coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from '../dtos/create-coffee.dto';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeeRepository: Repository<CoffeeEntity>,
  ) {}

  getCoffees(): Promise<CoffeeEntity[]> {
    return this.coffeeRepository.find();
  }

  createCoffee(createCoffeeDto: CreateCoffeeDto): Promise<CoffeeEntity> {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }
}
