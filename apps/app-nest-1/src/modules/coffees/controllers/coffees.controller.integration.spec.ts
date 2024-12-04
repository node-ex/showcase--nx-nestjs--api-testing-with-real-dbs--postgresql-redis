import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CoffeeEntity } from '../entities/coffee.entity';
import { rootConfigModuleImports } from '../../../shared/imports/root-config-module.imports';
import { rootDatabaseModuleImports } from '../../../shared/imports/root-database-module.imports';
import { rootCacheModuleImports } from '../../../shared/imports/root-cache-module.imports';
import { coffeeEntityDatabaseModuleImports } from '../imports/coffee-entity-database-module.imports';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'net';
import { CoffeesController } from '../controllers/coffees.controller';
import { CoffeesService } from '../services/coffees.service';

describe('TypeormController', () => {
  // https://github.com/nestjs/nest/issues/13191
  let app: INestApplication<NestExpressApplication & Server>;
  let dataSource: DataSource;
  let coffeeRepository: Repository<CoffeeEntity>;

  beforeEach(async () => {
    /**
     * https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
     */
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ...rootConfigModuleImports,
        ...rootDatabaseModuleImports,
        ...rootCacheModuleImports,
        ...coffeeEntityDatabaseModuleImports,
      ],
      controllers: [CoffeesController],
      providers: [CoffeesService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
    coffeeRepository = moduleFixture.get(getRepositoryToken(CoffeeEntity));
  });

  afterEach(async () => {
    /**
     * Don't forget to close the app after the tests, otherwise Jest will hang,
     * because of an open connection from the MongooseModule.
     */
    await app.close();
    jest.restoreAllMocks();
  });

  describe('GET /coffees', () => {
    it('should respond with nothing when no coffees exist', async () => {
      const result = await request(app.getHttpServer())
        .get('/coffees')
        .expect(200);

      expect(result.body).toEqual([]);
    });

    it('should respond with existing coffees', async () => {
      await coffeeRepository.save([
        coffeeRepository.create({ name: 'mock-name-1', brand: 'mock-brand-1' }),
        coffeeRepository.create({
          name: 'mock-name-2',
          brand: 'mock-brand-2',
          flavors: ['mock-flavor-2.1', 'mock-flavor-2.2'],
        }),
      ]);

      const result = await request(app.getHttpServer())
        .get('/coffees')
        .expect(200);

      expect(result.body).toEqual([
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          name: 'mock-name-1',
          brand: 'mock-brand-1',
          flavors: null,
        },
        {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: expect.any(Number),
          name: 'mock-name-2',
          brand: 'mock-brand-2',
          flavors: ['mock-flavor-2.1', 'mock-flavor-2.2'],
        },
      ]);
    });
  });
});
