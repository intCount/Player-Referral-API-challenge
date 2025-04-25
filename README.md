
# 🎮 Player Referral API

A TypeScript REST API for gaming referrals with wallet management and bonus system

[![GitHub](https://img.shields.io/badge/Repo-GitHub-green)](https://github.com/intCount/Player-Referral-API-challenge.git)  
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)

---

## 🌟 Features

### 🔐 Player Authentication
- Secure JWT login  
- Password hashing with bcrypt  
- Unique player ID generation  
- IP/URL tracking  

### 💰 Wallet Management
- Deposit/withdraw funds (min 100, max 100,000)  
- Transaction history  
- Balance verification  

### 🤝 Referral System
- Unique referral links  
- 100 bonus for referred signups  
- 10% bonus on referred deposits  
- Referral statistics tracking  

---

## 🛠 Tech Stack

- **Backend**: Node.js + Express  
- **Database**: MongoDB (Mongoose ODM)  
- **Authentication**: JWT  
- **Validation**: Joi  
- **Testing**: Jest  
- **Language**: TypeScript  

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/intCount/Player-Referral-API-challenge.git
cd Player-Referral-API-challenge

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run the app
npm run build && npm start    # Production
npm run dev                   # Development (hot reload)
```

---

## 📡 API Endpoints

### 🔑 Authentication

| Endpoint         | Method | Description           |
|------------------|--------|-----------------------|
| `/auth/register` | POST   | Register new player   |
| `/auth/login`    | POST   | Login with credentials|

### 💼 Wallet

| Endpoint               | Method | Description            |
|------------------------|--------|------------------------|
| `/wallet`              | GET    | Get wallet balance     |
| `/wallet/deposit`      | POST   | Deposit funds          |
| `/wallet/withdraw`     | POST   | Withdraw funds         |
| `/wallet/transactions` | GET    | Transaction history    |

### 👥 Referrals

| Endpoint              | Method | Description             |
|-----------------------|--------|-------------------------|
| `/referrals/link`     | GET    | Generate referral link  |
| `/referrals/players`  | GET    | List referred players   |
| `/referrals/stats`    | GET    | Get referral statistics |

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Optional: Run bash script
chmod +x test-api.sh
./test-api.sh
```

---

## 🏗 Architecture

- **Modular Structure**: `Controllers → Services → Models`  
- **Middleware**: Authentication, validation, error handling  
- **Security**: Bcrypt hashing, JWT expiration  
- **Validation**: Request sanitization with Joi  
- **Error Handling**: Centralized error middleware  

---

## 🔒 Security Features

- Password hashing with bcrypt  
- JWT authentication with expiration  
- Input validation for all requests  
- No plain-text password storage  
- Protection against common web vulnerabilities  

---

## 📜 License

MIT License