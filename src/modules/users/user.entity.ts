import { IsEmail, IsOptional, Length } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { IModel } from '~/modules/common';

@provideRepository(User)
@Entity()
export class User implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'uuid', readonly: true })
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

  @IsEmail()
  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ select: false })
  salt: string;
}
