import { Length } from 'class-validator';
import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { provideRepository } from '~/ioc';
import { IModel } from '~/modules/common';
import { Asset } from '../assets/asset.entity';

@provideRepository(AssetType)
@Entity()
export class AssetType implements IModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', readonly: true })
  @Index({ unique: true })
  uuid: string;

  @Column()
  @Length(2, 100)
  @Index({ unique: true })
  code: string;

  @Column('simple-array')
  attributes: string[];

  @OneToMany(() => Asset, asset => asset.type)
  assets: Asset[];
}
