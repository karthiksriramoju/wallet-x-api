import bcrypt from 'bcryptjs';
import User, { UserInterface } from '../models/userModel';
import { Request, Response } from 'express';
import { generateMnemonic, mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

const SECRET = process.env.JWT_SECRET || 'defaultsecret';

const generateSeed = () => {
    const HDMnemonic = generateMnemonic();
    const HDSeed = mnemonicToSeed(HDMnemonic);
    return {HDMnemonic, HDSeed};
};

const generateWallet = async (index: number) => {
    const { HDSeed: seed, HDMnemonic } = generateSeed();
    const mnemonic = HDMnemonic.split(" ")
    const solanaSeed = await seed.then(bytes => bytes.toString('hex'));
    const path = `m/44'/501'/${index == 0 ? 0 : index-1}'/0'`; 
    const derivedSeed = derivePath(path, solanaSeed).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const keypair = Keypair.fromSecretKey(secret)
    const publicKey = keypair.publicKey.toBase58()
    const privateKey = bs58.encode(keypair.secretKey)
    return {
        mnemonic,
        publicKey,
        privateKey
    };
}

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { telegramId, password, name } = req.body;
        console.log(password,name,telegramId);
        const hashedPassword = await bcrypt.hash(password, 10);
        const { mnemonic, publicKey, privateKey } = await generateWallet(0);
        const user = await User.findOne({ telegramId });
        console.log(user);
        if (!user) {
          // Create new user if not exists
          const newUser = new User({
            telegramId,
            password: hashedPassword,
            mnemonic,
            wallets: [{ Name: name, PublicKey: publicKey, PrivateKey: privateKey }],
            mainWallet: { Name: name, PublicKey: publicKey, PrivateKey: privateKey },
          });
        
          await newUser.save();
            res.status(201).json({
            message: "User created",
            mnemonic,
            publicKey,
            privateKey,
          });
          console.log("New user created")
        } else {
          // Add a new wallet to existing user
          user.wallets.push({ Name: name, PublicKey: publicKey, PrivateKey: privateKey });
        
          await user.save();
            res.status(200).json({
            message: "Wallet added successfully",
            publicKey,
            privateKey,
          });
          console.log("Wallet added")
        }
    } catch (error: any) {
        res.status(500).json({ error: 'Signup failed', details: error.message });
    }
};