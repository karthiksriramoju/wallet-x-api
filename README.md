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

### Running the API
#### Development Mode
```bash
npm run dev
```
#### Production Mode
```bash
npm run build && npm start
```

## Exposing the Server Using ngrok
To make your local server accessible over the internet, use **ngrok**:

1. Install **ngrok** (if not installed):
   ```bash
   npm install -g ngrok
   ```

2. Start your local server:
   ```bash
   npm run dev
   ```

3. Run **ngrok** to expose your server:
   ```bash
   ngrok http http://localhost:3000
   ```

4. Copy the generated **public URL** from ngrok and use it to interact with your API over the internet.

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
