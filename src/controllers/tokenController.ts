import { Request, Response } from "express";
import bs58 from "bs58";
import {
    Connection,
    Keypair,
    clusterApiUrl,
    PublicKey,
    Transaction,
    SystemProgram,
    LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

const SECRET = process.env.JWT_SECRET || "defaultsecret";

export const switchNetwork = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: 'User not authenticated' });
            return; 
        }
        const { network, rpcUrl } = req.body;
        const validNetworks = ['mainnet-beta', 'testnet', 'devnet', 'custom'];
        if (!validNetworks.includes(network)) {
            res.status(400).json({ error: 'Invalid network type' });
            return; 
        }
        else if (validNetworks.includes(network)) {
            if (network === 'custom' && !rpcUrl) {
                res.status(400).json({ error: 'RPC URL required for custom network' });  
                return; 
            }
            else if (network === 'custom') {
                req.user.currentNetwork = rpcUrl;
            }
            else {
                req.user.currentNetwork = clusterApiUrl(network);
            }
        }
        await req.user.save();
        res.status(200).json({ message: 'Network switched successfully' });
        return; 
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to switch network', details: error.message });
        return; 
    }
};

export const getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }
        const { walletName } = req.body;
        const connection = new Connection(req.user.currentNetwork, "confirmed");
        const publicKey = new PublicKey(req.user.wallets.find((w:any) => w.Name === walletName)?.PublicKey || req.user.wallets[0].PublicKey);
        const balance = await connection.getBalance(publicKey);
        const balanceInSol = balance / LAMPORTS_PER_SOL
        
        res.status(200).json({ balanceInSol });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch balance", details: error.message });
    }
};

export const transfer = async (req: Request, res: Response): Promise<void> => {
  try {
      if (!req.user) {
          res.status(400).json({ error: 'User not authenticated' });
          return;
      }
      const { to, amount, walletName } = req.body;
      const connection = new Connection(req.user.currentNetwork, 'confirmed');
      const privateKeyArray = bs58.decode(req.user.wallets.find((w:any) => w.Name === walletName)?.PrivateKey || req.user.wallets[0].PrivateKey);
      const keypair = Keypair.fromSecretKey(privateKeyArray);
      const accountInfo = await connection.getAccountInfo(keypair.publicKey);
      if (!accountInfo) {
          res.status(400).json({ error: 'Account not found' });
          return;
      }
      if (accountInfo?.lamports < amount * LAMPORTS_PER_SOL) {
          res.status(400).json({ error: 'Insufficient balance' });
          return;
      }
      const transaction = new Transaction().add(
          SystemProgram.transfer({
              fromPubkey: keypair.publicKey,
              toPubkey: new PublicKey(to),
              lamports: amount * LAMPORTS_PER_SOL,
          })
      );
      transaction.recentBlockhash = (await connection.getLatestBlockhash('max')).blockhash;
      transaction.feePayer = keypair.publicKey;
      transaction.sign(keypair);
      const signature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: false, preflightCommitment: 'confirmed' });
      res.status(200).json({ signature });
  } catch (error: any) {
      res.status(500).json({ error: 'Transfer failed', details: error.message });
  }
};

export const requestAirdrop = async (req: Request, res: Response): Promise<void> => {
    try {   
        if (!req.user) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }
        const { amount, name } = req.body;
        const connection = new Connection(req.user.currentNetwork, "confirmed");
        
        // Find the wallet by name
        const wallet = req.user.wallets.find((wallet) => wallet.Name === name);
        
        if (!wallet) {
            res.status(404).json({ message: "Wallet not found" });
            return
        }
        
        const publicKey = new PublicKey(wallet.PublicKey);
        
        try {
          // Airdrop SOL (amount in lamports)
          const airdropSignature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL );
          await connection.confirmTransaction(airdropSignature, "confirmed");
        
          res.status(200).json({
            message: "Airdrop successful",
            publicKey: publicKey.toBase58(),
            amount,
          });
          console.log("Airdrop successful ")
          console.log("Amount", amount)
          console.log(LAMPORTS_PER_SOL)
        } catch (error:any) {
          res.status(500).json({ message: "Airdrop failed", error: error.message });
        }
    } catch (error: any) {
        console.log(error)
    }
};

export const getTransactionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }
        const connection = new Connection(req.user.currentNetwork, "confirmed");
        const publicKey = new PublicKey(req.user.wallets[0].PublicKey);
        const transactions = await connection.getSignaturesForAddress(publicKey);
        res.status(200).json({ transactions });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch transaction history", details: error.message });
    }
};

export const createToken = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }
        const { tokenName, symbol, decimals, supply } = req.body;
        // Mock token creation logic as a placeholder
        res.status(200).json({ message: "Token created successfully", tokenName, symbol, decimals, supply });
    } catch (error: any) {
        res.status(500).json({ error: "Token creation failed", details: error.message });
    }
};

export const swapTokens = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(400).json({ error: "User not authenticated" });
            return;
        }
        const { fromToken, toToken, amount } = req.body;
        // Mock token swap logic as a placeholder
        res.status(200).json({ message: "Swap successful", fromToken, toToken, amount });
    } catch (error: any) {
        res.status(500).json({ error: "Swap failed", details: error.message });
    }
};
