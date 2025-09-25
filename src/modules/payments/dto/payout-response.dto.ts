export interface PayoutResponseDto {
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