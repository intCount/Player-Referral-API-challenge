# 🎮 Player Referral API

A TypeScript REST API for gaming referrals with wallet management and bonus system

[![GitHub](https://img.shields.io/badge/Repo-GitHub-green)](https://github.com/intCount/Player-Referral-API-challenge.git)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)

## 🌟 Features

- **Player Authentication**
  - Secure JWT login
  - Password hashing with bcrypt
  - Unique player ID generation
  - IP/URL tracking

- **Wallet Management**
  - Deposit/withdraw funds (min 100, max 100,000)
  - Transaction history
  - Balance verification

- **Referral System**
  - Unique referral links
  - 100 bonus for referred signups
  - 10% bonus on referred deposits
  - Referral statistics tracking

## 🛠 Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT
- **Validation**: Joi
- **Testing**: Jest
- **Language**: TypeScript

## ⚡ Quick Start

1. Clone the repository:
```bash
git clone https://github.com/intCount/Player-Referral-API-challenge.git
cd Player-Referral-API-challenge

npm install

cp .env.example .env
# Edit .env with your configuration

npm run build && npm start  # Production
npm run dev                # Development (hot reload)