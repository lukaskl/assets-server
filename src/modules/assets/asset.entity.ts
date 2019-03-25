import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { IModel } from '~/modules/common';

import { Allocation } from '../allocations/allocation.entity';
import { AssetType } from '../assetTypes/assetType.entity';

@provideRepository(Asset)
@Entity()
export class Asset implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', readonly: true })
  @Index({ unique: true })
  uuid: string;

  @ManyToOne(() => AssetType, assetType => assetType.assets)
  type: AssetType;

  @OneToMany(() => Allocation, other => other.asset)
  allocations: Allocation[];

  @Column({ type: 'json' })
  attributeValues: { [key: string]: string };
}
