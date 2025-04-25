# Player Referral API

A TypeScript-based REST API for a player referral system. This API allows players to register, login, manage their wallet, and participate in a referral program to earn bonuses.

## Features

1. **Player Authentication**
   - Registration with unique player ID generation
   - Secure login with JWT authentication
   - Password hashing for security

2. **Wallet Management**
   - Deposit funds (min 100, max 100,000)
   - Withdraw funds with balance verification
   - Transaction history tracking

3. **Referral System**
   - Generate unique referral links
   - Registration bonus (100 units) for referring new players
   - Deposit bonus (10% of amount) when referred players make deposits
   - Track referred players and referral earnings

4. **Security Features**
   - JWT-based authentication
   - Password hashing using bcrypt
   - Request validation
   - Centralized error handling

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type system for JavaScript
- **MongoDB** - NoSQL database (using Mongoose ODM)
- **JWT** - Authentication mechanism
- **Jest** - Testing framework
- **Joi** - Validation library

## Project Structure

The project follows a modular architecture with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define database schemas and data models
- **Routes**: Define API endpoints
- **Middlewares**: Handle cross-cutting concerns like authentication, validation
- **Utils**: Utility functions and helpers
- **Tests**: Unit and integration tests

## Setup and Installation

### Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd player-referral-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Build the TypeScript code
   ```bash
   npm run build
   ```

5. Start the server
   ```bash
   npm start
   ```

6. For development with hot reload
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new player
- `POST /api/auth/login` - Login with existing credentials

### Player

- `GET /api/players/profile` - Get player profile information

### Wallet

- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit funds to wallet
- `POST /api/wallet/withdraw` - Withdraw funds from wallet
- `GET /api/wallet/transactions` - Get transaction history

### Referrals

- `GET /api/referrals/link` - Generate referral link
- `GET /api/referrals/players` - Get list of referred players
- `GET /api/referrals/stats` - Get referral statistics (bonuses earned)

## Testing

Run tests with:

```bash
npm test
```

Or run tests with coverage:

```bash
npm run test:coverage
```

## Design Decisions and Architecture

This API is designed with object-oriented principles and follows clean architecture practices:

1. **Separation of Concerns**: Controllers, services, and data access are separated for better maintainability.

2. **Dependency Injection**: Services are injected into controllers to maintain loose coupling.

3. **Error Handling**: Centralized error handling with custom error types.

4. **Middleware-Based Architecture**: Application concerns like authentication, validation, and error handling are handled through middleware.

5. **Repository Pattern**: Data access is abstracted through models to separate business logic from data access.

6. **Type Safety**: TypeScript interfaces ensure type safety throughout the application.

## Performance and Scalability Considerations

- MongoDB indexes for optimized queries
- Connection pooling for database efficiency
- Stateless authentication for horizontal scaling
- Error boundary for resilience

## Security Measures

- Password hashing with bcrypt
- JWT-based authentication with expiration
- Request validation to prevent malicious input
- No storage of plain-text passwords
- Protection against common web vulnerabilities

## License

MIT