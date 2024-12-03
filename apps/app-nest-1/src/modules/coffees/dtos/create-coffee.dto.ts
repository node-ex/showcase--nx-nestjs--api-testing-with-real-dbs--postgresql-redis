import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsArray()
  @IsString({ each: true })
  flavors!: string[];
}
