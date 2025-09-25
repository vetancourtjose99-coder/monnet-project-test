import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';



export class CreatePayinDto {
  @ApiProperty() @IsString() payinMerchantID!: string;
  @ApiProperty() @IsString() payinAmount!: string;
  @ApiProperty() @IsString() payinCurrency!: string;
  @ApiProperty() @IsString() payinMerchantOperationNumber!: string;
  @ApiProperty() @IsString() payinMethod!: string;
  @ApiProperty() @IsString() payinVerification!: string;
  @ApiProperty() @IsString() payinTransactionOKURL!: string;
  @ApiProperty() @IsString() payinTransactionErrorURL!: string;
  @ApiProperty() @IsString() payinExpirationTime!: string;
  @ApiProperty() @IsString() payinLanguage!: string;
  @ApiProperty() @IsString() payinCustomerEmail!: string;
  @ApiProperty() @IsString() payinCustomerName!: string;
  @ApiProperty() @IsString() payinCustomerLastName!: string;
  @ApiProperty() @IsString() payinCustomerTypeDocument!: string;
  @ApiProperty() @IsString() payinCustomerDocument!: string;
  @ApiProperty() @IsString() payinCustomerPhone!: string;
  @ApiProperty() @IsString() payinCustomerAddress!: string;
  @ApiProperty() @IsString() payinCustomerCity!: string;
  @ApiProperty() @IsString() payinCustomerRegion!: string;
  @ApiProperty() @IsString() payinCustomerCountry!: string;
  @ApiProperty() @IsString() payinCustomerZipCode!: string;
  @ApiProperty() @IsString() payinCustomerShippingName!: string;
  @ApiProperty() @IsString() payinCustomerShippingPhone!: string;
  @ApiProperty() @IsString() payinCustomerShippingAddress!: string;
  @ApiProperty() @IsString() payinCustomerShippingCity!: string;
  @ApiProperty() @IsString() payinCustomerShippingRegion!: string;
  @ApiProperty() @IsString() payinCustomerShippingCountry!: string;
  @ApiProperty() @IsString() payinCustomerShippingZipCode!: string;
  @ApiProperty() @IsString() payinProductID!: string;
  @ApiProperty() @IsString() payinProductDescription!: string;
  @ApiProperty() @IsString() payinProductAmount!: string;
  @ApiProperty() @IsString() payinDateTime!: string;
  @ApiProperty() @IsString() payinProductSku!: string;
  @ApiProperty() @IsString() payinProductQuantity!: string;
  
  // Optional fields
  @ApiPropertyOptional() @IsOptional() @IsString() payinRegularCustomer?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payinCustomerID?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payinDiscountCoupon?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() payinFilterBy?: string;
}
