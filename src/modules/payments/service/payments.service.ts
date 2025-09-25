import { BadGatewayException, BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ProviderClient } from './provider.client';
import { CreatePayinDto } from '../dto/create-payin.dto';
import { CreatePayoutDto } from '../dto/create-payout.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private provider: ProviderClient) {}

  async createPayin(dto: CreatePayinDto) {
    try {
      this.logger.log(`Creating payin for merchant operation: ${dto.payinMerchantOperationNumber}`);
      return await this.provider.createPayin(dto);
    } catch (error) {
      this.logger.error(`Payin failed for operation ${dto.payinMerchantOperationNumber}:`, this.formatError(error));
      this.throwAppropriateException('payin', error);
    }
  }

  async createPayout(merchantId: string, dto: CreatePayoutDto) {
    try {
      this.logger.log(`Creating payout for order: ${dto.orderId}`);
      return await this.provider.createPayout(merchantId, dto);
    } catch (error) {
      this.logger.error(`Payout failed for order ${dto.orderId}:`, this.formatError(error));
      this.throwAppropriateException('payout', error);
    }
  }

  private buildErrorMessage(operation: string, error: any): string {
    if (this.isAuthenticationError(error)) {
      return `${operation} authentication failed: Invalid credentials or signature`;
    }
    
    if (this.isValidationError(error)) {
      return `${operation} validation failed: Invalid request data`;
    }
    
    const baseMessage = `${operation} provider temporarily unavailable`;
    
    if (error?.response?.data) {
      const providerError = error.response.data;
      
      if (providerError.message && this.isSafeMessage(providerError.message)) {
        return `${baseMessage}: ${providerError.message}`;
      }
      
      if (providerError.error_description && this.isSafeMessage(providerError.error_description)) {
        return `${baseMessage}: ${providerError.error_description}`;
      }
    }
    
    return baseMessage;
  }

  private isAuthenticationError(error: any): boolean {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || '';
    
    return (
      status === 401 ||
      status === 403 ||
      message.toLowerCase().includes('authentication') ||
      message.toLowerCase().includes('unauthorized') ||
      message.toLowerCase().includes('invalid signature') ||
      message.toLowerCase().includes('invalid credentials')
    );
  }

  private isValidationError(error: any): boolean {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error?.message || '';
    
    return (
      status === 400 ||
      message.toLowerCase().includes('validation') ||
      message.toLowerCase().includes('invalid request') ||
      message.toLowerCase().includes('bad request')
    );
  }

  private throwAppropriateException(operation: string, error: any): never {
    if (this.isAuthenticationError(error)) {
      throw new UnauthorizedException(`${operation} authentication failed: Invalid credentials or signature`);
    }
    
    if (this.isValidationError(error)) {
      throw new BadRequestException(`${operation} validation failed: Invalid request data`);
    }
    
    const message = this.buildErrorMessage(operation, error);
    throw new BadGatewayException(message);
  }

  private formatError(error: any): object {
    if (error?.response) {
      return {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        method: error.config?.method,
      };
    }
    
    return {
      message: error.message,
      code: error.code,
      name: error.name,
    };
  }

  private isSafeMessage(message: string): boolean {
    const unsafePatterns = [
      /internal/i,
      /server/i,
      /database/i,
      /sql/i,
      /stack/i,
      /localhost/i,
      /127\.0\.0\.1/,
      /\d+\.\d+\.\d+\.\d+/,
    ];
    
    return !unsafePatterns.some(pattern => pattern.test(message)) && message.length < 200;
  }
}