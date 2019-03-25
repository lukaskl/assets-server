import { IsDate, IsEmail, IsOptional, IsUUID } from 'class-validator';

import { AssetResponse } from '~/modules/assets';
import { UserResponse } from '~/modules/users';

export class AllocationCreateRequest {
  /**
   * Email of the user
   */
  @IsEmail()
  allocatedTo: string;

  /**
   * uuid of the asset
   */
  @IsUUID('4')
  assetUuid: string;

  /**
   * date with a timezone
   */
  @IsDate()
  from: Date;

  /**
   * date with a timezone
   */
  @IsDate()
  @IsOptional()
  to?: Date;
}

export class AllocationUpdateRequest {
  /**
   * Email of the user
   */
  @IsEmail()
  @IsOptional()
  allocatedTo?: string;

  /**
   * uuid of the asset
   */
  @IsUUID('4')
  @IsOptional()
  assetUuid?: string;

  /**
   * date with a timezone
   */
  @IsDate()
  @IsOptional()
  from?: Date;

  /**
   * date with a timezone
   */
  @IsDate()
  @IsOptional()
  to?: Date;
}

export class AllocationResponse {
  asset: AssetResponse;
  allocatedTo?: UserResponse;
  from?: Date;
  to?: Date;
}
