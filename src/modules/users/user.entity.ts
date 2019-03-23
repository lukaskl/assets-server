import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';

@provideRepository(User)
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;
}
