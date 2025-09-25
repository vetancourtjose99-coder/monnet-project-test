import { Module } from '@nestjs/common';
import { AppCacheModule } from '../../../common/cache/cache.module';
import { MonnetAuthService } from '../../../common/auth';
import { PaymentsController } from '../controller/payments.controller';
import { PaymentsService } from '../service/payments.service';
import { IdempotencyService } from '../service/idempotency.service';
import { ProviderClient } from '../service/provider.client';

@Module({
  imports: [AppCacheModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, IdempotencyService, ProviderClient, MonnetAuthService],
})
export class PaymentsModule {}