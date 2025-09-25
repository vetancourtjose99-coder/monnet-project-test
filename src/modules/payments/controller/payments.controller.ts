import { BadRequestException, Body, Controller, Headers, Param, Post } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from '../service/payments.service';
import { IdempotencyService } from '../service/idempotency.service';
import { CreatePayinDto } from '../dto/create-payin.dto';
import { CreatePayoutDto } from '../dto/create-payout.dto';

@ApiTags('payments')
@Controller()
export class PaymentsController {
  constructor(
    private svc: PaymentsService,
    private idem: IdempotencyService,
  ) {}

  @Post('payins')
  async createPayin(
    @Body() dto: CreatePayinDto,
    @Headers('x-transaction-id') key?: string,
  ) {
    if (!key) throw new BadRequestException('Idempotency-Key header required');
    const cached = await this.idem.get(key);
    if (cached) return cached;

    const result = await this.svc.createPayin(dto);
    await this.idem.set(key, result);
    return result;
  }

  @Post('payouts/:merchantId')
  @ApiParam({ name: 'merchantId', description: 'Merchant ID for the payout' })
  async createPayout(
    @Param('merchantId') merchantId: string,
    @Body() dto: CreatePayoutDto,
    @Headers('x-transaction-id') key?: string,
  ) {
    if (!key) throw new BadRequestException('Idempotency-Key header required');
    const cached = await this.idem.get(key);
    if (cached) return cached;

    const result = await this.svc.createPayout(merchantId, dto);
    await this.idem.set(key, result);
    return result;
  }
}