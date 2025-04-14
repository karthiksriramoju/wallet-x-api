"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./db/db"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', userRouter_1.default);
const PORT = parseInt(process.env.PORT || '3000') || 3000;
// Connect to MongoDB
(0, db_1.default)();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
