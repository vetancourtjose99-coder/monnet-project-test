import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, createHmac } from 'crypto';

@Injectable()
export class MonnetAuthService {
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('MONNET_API_KEY')!;
    this.apiSecret = this.config.get<string>('MONNET_API_SECRET')!;
  }

  generateTimestamp(): string {
    return Date.now().toString();
  }

  hashBody(body: string): string {
    if (!body || body === '') {
      return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
    return createHash('sha256').update(body, 'utf8').digest('hex');
  }

  generateSignature(method: string, resourcePath: string, timestamp: string, hashedBody: string): string {
    const content = `${method.toUpperCase()}:${resourcePath}?timestamp=${timestamp}:${hashedBody}`;
    return createHmac('sha256', this.apiSecret).update(content, 'utf8').digest('hex');
  }

  getApiKey(): string {
    return this.apiKey;
  }

  buildAuthenticatedUrl(method: string, resourcePath: string, body: string): {
    url: string;
    headers: Record<string, string>;
  } {
    const timestamp = this.generateTimestamp();
    const hashedBody = this.hashBody(body);
    const signature = this.generateSignature(method, resourcePath, timestamp, hashedBody);
    
    const url = `${resourcePath}?timestamp=${timestamp}&signature=${signature}`;
    const headers = {
      'monnet-api-key': this.apiKey,
    };

    return { url, headers };
  }
}