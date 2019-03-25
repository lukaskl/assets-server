import { Length, IsOptional } from 'class-validator';
import { AssetTypeResponse } from '~/modules/assetTypes';

export class AssetCreateRequest {
  @Length(2, 100)
  typeCode: string;

  @Length(2, 100)
  name: string;

  attributeValues: { [key: string]: string };
}

export class AssetUpdateRequest {
  @Length(2, 100)
  @IsOptional()
  typeCode?: string;

  @Length(2, 100)
  @IsOptional()
  name?: string;

  attributeValues?: { [key: string]: string };
}

export class AssetResponse {
  name: string;
  type: AssetTypeResponse;
  attributeValues: { [key: string]: string };
}
