import { IsEmail, Length, IsOptional } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { IModel } from '~/modules/common';

export interface IUserContent {
  email: string;
  firstName?: string;
  lastName?: string;
}

@provideRepository(User)
@Entity()
export class User implements IModel, IUserContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  @Index({ unique: true })
  uuid: string;

  @Length(2, 100)
  @IsOptional()
  @Column({ nullable: true })
  firstName?: string;

  @Length(2, 100)
  @IsOptional()
  @Column({ nullable: true })
  lastName?: string;

  @Column()
  @IsEmail()
  email: string;
}
