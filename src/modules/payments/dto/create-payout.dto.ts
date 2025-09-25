import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

class DocumentDto {
  @ApiProperty()
  @IsNumber()
  type!: number;

  @ApiProperty()
  @IsString()
  number!: string;
}

class AddressDto {
  @ApiProperty()
  @IsString()
  street!: string;

  @ApiProperty()
  @IsString()
  houseNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiProperty()
  @IsString()
  city!: string;

  @ApiProperty()
  @IsString()
  province!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsString()
  zipCode!: string;
}

class BeneficiaryDto {
  @ApiProperty()
  @IsString()
  customerId!: string;

  @ApiProperty()
  @IsString()
  userName!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  phoneNumber!: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DocumentDto)
  document!: DocumentDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;
}

class BankAccountLocationDto extends AddressDto {}

class BankAccountDto {
  @ApiProperty()
  @IsString()
  bankCode!: string;

  @ApiProperty()
  @IsString()
  accountType!: string;

  @ApiProperty()
  @IsString()
  accountNumber!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cbu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cci?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clabe?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BankAccountLocationDto)
  location!: BankAccountLocationDto;
}

class DestinationDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount!: BankAccountDto;
}

class SubMerchantInfoDto {
  @ApiProperty()
  @IsString()
  code!: string;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  url!: string;
}

export class CreatePayoutDto {
  @ApiProperty()
  @IsString()
  country!: string;

  @ApiProperty()
  @IsNumber()
  amount!: number;

  @ApiProperty()
  @IsString()
  currency!: string;

  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => BeneficiaryDto)
  beneficiary!: BeneficiaryDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DestinationDto)
  destination!: DestinationDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SubMerchantInfoDto)
  subMerchantInfo!: SubMerchantInfoDto;
}

export class PayoutResponseDto {
  payout: {
    Id: number;
    country: string;
    amount: number;
    currency: string;
    orderId: string;
  };
  output: {
    stage: string;
    status: string;
    statusChangeDateTime: string;
  };
}
