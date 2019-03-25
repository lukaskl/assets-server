import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { Asset } from '~/modules/assets';
import { IModel } from '~/modules/common';
import { User } from '~/modules/users';

@provideRepository(Allocation)
@Entity()
export class Allocation implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', readonly: true })
  @Index({ unique: true })
  uuid: string;

  @ManyToOne(() => require('../users').User, (other: User) => other.allocations, { onDelete: 'CASCADE' })
  allocatedTo: User;

  @ManyToOne(() => require('../assets').Asset, (other: Asset) => other.allocations, { onDelete: 'CASCADE' })
  asset: Asset;

  @Column({ type: 'timestamp with time zone' })
  @Index({ unique: false })
  from: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @Index({ unique: false })
  to?: Date;
}
