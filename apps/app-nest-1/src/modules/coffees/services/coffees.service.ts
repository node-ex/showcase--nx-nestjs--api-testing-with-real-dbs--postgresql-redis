import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoffeeEntity } from '../entities/coffee.entity';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from '../dtos/create-coffee.dto';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Coffee } from '../types/coffee.interface';

@Injectable()
export class CoffeesService {
  COFFEES_CACHE_KEY = 'coffees';

  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeeRepository: Repository<CoffeeEntity>,
    private readonly redisService: RedisService,
  ) {}

  async getCoffees(): Promise<Coffee[]> {
    const connection = this.redisService.getOrThrow();
    const cachedCoffees = await connection.get(this.COFFEES_CACHE_KEY);

    if (cachedCoffees) {
      console.log('Cache hit');
      return JSON.parse(cachedCoffees) as Coffee[];
    }

    console.log('Cache miss');
    const coffees = await this.coffeeRepository.find();
    const coffeesToCache = JSON.stringify(coffees);
    await connection.set(this.COFFEES_CACHE_KEY, coffeesToCache);

    return coffees;
  }

  async createCoffee(createCoffeeDto: CreateCoffeeDto): Promise<Coffee> {
    let coffee = this.coffeeRepository.create(createCoffeeDto);
    coffee = await this.coffeeRepository.save(coffee);

    const connection = this.redisService.getOrThrow();
    await connection.del(this.COFFEES_CACHE_KEY);

    return coffee;
  }
}
