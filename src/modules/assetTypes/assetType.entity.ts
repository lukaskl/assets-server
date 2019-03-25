import { Length } from 'class-validator';
import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { provideRepository } from '~/ioc';
import { Asset } from '~/modules/assets';
import { IModel } from '~/modules/common';

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
