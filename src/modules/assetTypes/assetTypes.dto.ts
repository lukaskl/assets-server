// import { IsEmail, Length, IsOptional } from 'class-validator';

// The copy pasting of DTO objects is necessary, so that swagger
// would be able to pick up the types
// type manipulation like Partial<Asset> does not work :/

export class AssetTypeCreateRequest {
  // @IsEmail()
  // email: string;
  // @Length(6, 50)
  // password: string;
  // @Length(2, 100)
  // firstName?: string;
  // @Length(2, 100)
  // lastName?: string;
}

export class AssetTypeUpdateRequest {
  // @IsEmail()
  // @IsOptional()
  // email?: string;
  // @Length(6, 50)
  // @IsOptional()
  // password?: string;
  // @Length(2, 100)
  // @IsOptional()
  // firstName?: string;
  // @Length(2, 100)
  // @IsOptional()
  // lastName?: string;
}
