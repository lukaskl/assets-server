import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { Allocation } from '~/modules/allocations';
import { AssetType } from '~/modules/assetTypes';
import { IModel } from '~/modules/common';
import { Length } from 'class-validator';

@provideRepository(Asset)
@Entity()
export class Asset implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', readonly: true })
  @Index({ unique: true })
  uuid: string;

  @Length(2, 100)
  @Column()
  name: string;

  @ManyToOne(() => AssetType, assetType => assetType.assets, { onDelete: 'RESTRICT', eager: true })
  type: AssetType;

  @OneToMany(() => Allocation, other => other.asset)
  allocations: Allocation[];

  @Column({ type: 'jsonb' })
  attributeValues: { [key: string]: string };
}
