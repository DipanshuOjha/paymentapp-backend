const express = require('express');
const router = express.Router();
const userRouter = require('../routes/user');
const accountRounter = require('../routes/account')
router.use('/user',userRouter)
router.use('/account',accountRounter);

module.exports =router;

