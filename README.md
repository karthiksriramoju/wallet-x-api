# Solana Telegram Bot API

This is a **Node.js API** built with **TypeScript** that interacts with the **Solana Blockchain** to provide wallet creation, airdrops, transfers, balance checking, and transaction history retrieval. The API is connected to **MongoDB** for storing user details and operates as the backend for a Telegram bot.

## Features
- **Create Wallets** (`/signup`)
- **Switch Solana Network** (`/network/switch`)
- **Check Balance** (`/balance`)
- **Transfer SOL** (`/transfer`)
- **Request Airdrop (Devnet only)** (`/airdrop`)
- **Fetch Transaction History** (`/transactions`)

## Tech Stack
- **Node.js** with **TypeScript**
- **Express.js** for API Routing
- **Solana Web3.js** for blockchain interactions
- **MongoDB** for data storage

## Getting Started

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=16.x)
- **MongoDB** (local or cloud instance)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/karthiksriramoju/wallet-x-api.git
   cd wallet-x-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
API_TOKEN= your_key_to_authorize_requests_same_as_bot's_key
```

### Running the API
#### Development Mode
```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Middleware | Description |
|--------|---------|------------|-------------|
| POST | `/signup` | `access` | Create a new wallet |
| POST | `/network/switch` | `access, authenticate` | Switch Solana network |
| POST | `/balance` | `access, authenticate` | Get SOL balance |
| POST | `/transfer` | `access, authenticate` | Transfer SOL |
| POST | `/airdrop` | `access, authenticate` | Request airdrop (Devnet only) |
| POST | `/transactions` | `access, authenticate` | Fetch transaction history |

## Request Parameters & Response Types

### Signup
**Request:**
```json
{
    "name": "string",
    "password": "string",
    "API_TOKEN": "string"
}
```
**Response:**
```json
{
    "publicKey": "string",
    "mnemonic": "string",
    "privateKey": "string"
}
```

### Switch Network
**Request:**
```json
{
    "telegramId": "string",
    "password": "string",
    "network": "string",
    "rpcUrl": "string", // Optional if network is 'custom'
    "API_TOKEN": "string"
}
```
**Response:**
```json
{
    "message": "Network switched successfully"
}
```

### Check Balance
**Request:**
```json
{
    "telegramId": "string",
    "password": "string",
    "walletName": "string",
    "API_TOKEN": "string"
}
```
**Response:**
```json
{
    "balance": "number"
}
```

### Transfer SOL
**Request:**
```json
{
    "telegramId": "string",
    "password": "string",
    "to": "string",
    "amount": "number",
    "walletName": "string",
    "API_TOKEN": "string"
}
```
**Response:**
```json
{
    "signature": "string"
}
```

### Request Airdrop
**Request:**
```json
{
    "telegramId": "string",
    "password": "string",
    "walletName": "string",
    "amount": "number",
    "API_TOKEN": "string"
}
```
**Response:**
```json
{
    "publicKey": "string",
    "signature": "string"
}
```

### Fetch Transactions
**Request:**
```json
{
    "telegramId": "string",
    "password": "string",
    "walletName": "string",
    "API_TOKEN": "string"
}
```
**Response:**
```json
[
    {
        "blockTime": "number",
        "confirmationStatus": "string",
        "err": "null | string",
        "memo": "null | string",
        "signature": "string",
        "slot": "number"
    }
]
```

## License
This project is licensed under the **MIT License**.

---
Feel free to contribute or raise an issue if you encounter any problems! 🚀
