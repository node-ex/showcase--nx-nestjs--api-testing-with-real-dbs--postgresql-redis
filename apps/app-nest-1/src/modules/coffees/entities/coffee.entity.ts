import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Coffee } from '../types/coffee.interface';

@Entity({
  name: 'coffees',
})
export class CoffeeEntity implements Coffee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  brand!: string;

  @Column('json', { nullable: true })
  flavors!: string[];
}
