import { access } from "../middleware/access";
import { authenticate } from "../middleware/auth";
import { switchNetwork, getBalance, transfer, requestAirdrop, getTransactionHistory} from "../controllers/tokenController";
import {signup} from "../controllers/userController";
import { Router } from "express";


const router = Router();

router.post('/signup',access, signup);
router.post('/network/switch', access, authenticate, switchNetwork);
router.post('/balance', access, authenticate, getBalance);
router.post('/transfer', access, authenticate, transfer);
router.post('/airdrop', access, authenticate, requestAirdrop);

router.post('/transactions', access, authenticate, getTransactionHistory);

export default router;