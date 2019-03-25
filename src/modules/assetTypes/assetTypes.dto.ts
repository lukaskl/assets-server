import { ArrayUnique, Length, IsOptional } from 'class-validator';

export class AssetTypeCreateRequest {
  @Length(2, 100)
  code: string;

  @ArrayUnique()
  @Length(2, 100, { each: true })
  attributes: string[];
}

export class AssetTypeUpdateRequest {
  @Length(2, 100)
  @IsOptional()
  code: string;

  @ArrayUnique()
  @IsOptional()
  @Length(2, 100, { each: true })
  attributes: string[];
}

export class AssetTypeResponse {
  uuid: string;
  code: string;
  attributes: string[];
}
