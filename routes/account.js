const express = require('express');
const authMiddleware = require('../middleware');
const { User, Accounts } = require('../db');
const { default: mongoose } = require('mongoose');
const account = express.Router();

account.get('/balance',authMiddleware,async (req,res)=>{
        const account = await Accounts.findOne({ userId:req.userId});
        res.json({
            balance:account.balance
        })
}) 

account.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { to, amount } = req.body;

        const account = await Accounts.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: `Insufficient balance - ${account?.balance || 0}` });
        }

        const toAccount = await Accounts.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid account" });
        }

        await Accounts.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Accounts.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        return res.json({ msg: `Transferred successfully. Amount deducted: ${amount}` });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ msg: "Transaction failed", error: error.message });

    } finally {
        session.endSession(); 
    }
});




module.exports = account;


