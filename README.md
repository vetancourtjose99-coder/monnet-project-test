# Monnet Payments Integration API

A robust NestJS application for integrating with Monnet payment services, supporting both Payin and Payout operations with enterprise-grade features.

## 🏗️ Architecture

```
src/
├── common/
│   ├── auth/           # HMAC authentication service
│   ├── cache/          # Redis/Memory cache configuration
│   └── http/           # HTTP client factory with retries
├── modules/
│   └── payments/
│       ├── controller/ # REST endpoints
│       ├── dto/        # Data validation objects
│       ├── service/    # Business logic
│       └── module/     # Module configuration
└── main.ts             # Application bootstrap
```

## 📋 Prerequisites

- Node.js 18+
- Redis (optional, falls back to memory cache)
- Monnet API credentials

## ⚙️ Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

## 🔧 Configuration

Update `.env` with your Monnet credentials:

## 🚀 Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/docs`

## 📡 API Endpoints

### Payin 
```http
POST /payins
Headers:
  Content-Type: application/json
  x-transaction-id: unique-transaction-id
Body: CreatePayinDto
```

### Payout (HMAC-SHA256 Authentication)
```http
POST /payouts/{merchantId}
Headers:
  Content-Type: application/json
  x-transaction-id: unique-transaction-id
Body: CreatePayoutDto
```

## 🔐 Authentication

### Payin Authentication
- Simple header-based authentication

### Payout Authentication
- Uses HMAC-SHA256 signature authentication
- Automatic signature generation with:
  - Timestamp generation
  - SHA-256 body hashing
  - HMAC-SHA256 signature creation
  - Query parameter injection

## 🛡️ Idempotency

All endpoints require `x-transaction-id` header for idempotency:
- Prevents duplicate payments
- Configurable TTL (default: 1 hour)
- Redis-backed with memory fallback
- Automatic cache cleanup

## 🔄 Error Handling

The API provides specific error responses:

- **401 Unauthorized**: Authentication failures (invalid credentials/signature)
- **400 Bad Request**: Validation errors (invalid request data)
- **502 Bad Gateway**: Provider service unavailable

### Project Structure
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and orchestration
- **Providers**: Manage external API communications
- **DTOs**: Define and validate data structures
- **Common**: Shared utilities and configurations

### Adding New Payment Methods
1. Create new DTO in `dto/` folder
2. Add service method in `PaymentsService`
3. Implement provider method in `ProviderClient`
4. Add controller endpoint
5. Update module providers