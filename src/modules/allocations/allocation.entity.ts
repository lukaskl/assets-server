import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { IModel } from '~/modules/common';

import { User } from '../users';
import { Asset } from '../assets/asset.entity';

@provideRepository(Allocation)
@Entity()
export class Allocation implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', readonly: true })
  @Index({ unique: true })
  uuid: string;

  @ManyToOne(() => User, other => other.allocations, { onDelete: 'CASCADE' })
  allocatedTo: User;

  @ManyToOne(() => Asset, other => other.allocations, { onDelete: 'CASCADE' })
  asset: Asset;

  @Column({ type: 'timestamp with time zone' })
  @Index({ unique: false })
  from: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  @Index({ unique: false })
  to?: Date;
}
