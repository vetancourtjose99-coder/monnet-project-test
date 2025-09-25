import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHttpClient } from '../../../common/http/axios.factory';
import { MonnetAuthService } from '../../../common/auth';
import { CreatePayinDto } from '../dto/create-payin.dto';
import { CreatePayoutDto } from '../dto/create-payout.dto';
import { PayoutResponseDto } from '../dto/payout-response.dto';

@Injectable()
export class ProviderClient {
  private payinClient;
  private payoutClient;

  constructor(
    private cfg: ConfigService,
    private monnetAuth: MonnetAuthService,
  ) {
    const timeout = Number(this.cfg.get('HTTP_TIMEOUT_MS') ?? 5000);
    const retries = Number(this.cfg.get('HTTP_RETRIES') ?? 2);
    const apiKey = this.cfg.get('PROVIDER_API_KEY');
    
    this.payinClient = createHttpClient({
      baseURL: 'https://cert.payin.api.monnetpayments.com',
      timeout,
      retries,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
    
    // Payout client without auth headers (will be added per request)
    this.payoutClient = createHttpClient({
      baseURL: 'https://cert.api.payout.monnet.io',
      timeout,
      retries,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private toMoneyStr(v: string | number): string {
    if (typeof v === 'number') return v.toFixed(2);
    const n = Number(v);
    return isNaN(n) ? v : n.toFixed(2);
  }
  
  async createPayout(merchantId: string, dto: CreatePayoutDto) {
    const resourcePath = `/api/v1/${merchantId}/payouts`;
    const body = JSON.stringify(dto);
    
    const { url, headers } = this.monnetAuth.buildAuthenticatedUrl('POST', resourcePath, body);
    
    const { data } = await this.payoutClient.post(url, dto, { headers });
    return data as PayoutResponseDto;
  }

  async createPayin(dto: CreatePayinDto) {
    const payload = { data: dto };
    const { data } = await this.payinClient.post('/api-payin/v1/online-payments', payload);
    return data;
  }
}
