const express = require('express');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const userRouter = express.Router();
const {User,Accounts} = require('../db');
const authMiddleware = require('../middleware');

const UserSignup = zod.object({
      username:zod.string(),
      password:zod.string(),
      firstName:zod.string(),
      lastName:zod.string()
})

const UserSignin = zod.object({
    username:zod.string(),
    password:zod.string()
})

const UserUpdate = zod.object({
      password:zod.string().optional(),
      firstName:zod.string().optional(),
      lastName:zod.string().optional()
})

userRouter.post('/signup',async (req,res)=>{
           const {username,password,firstName,lastName} = req.body;
           const data = UserSignup.safeParse({username,password,firstName,lastName});
           if(!data.success){
              return res.status(411).json({
                 msge:"all enteries should be string.......!!!"
              })

           }

           const userFound = await User.findOne({username})
           if(userFound){
              return res.status(411).json({
                 msge:"Email already taken / Incorrect inputs"
              })
           }
           else{
              const dbUser = await User.create({username,password,firstName,lastName})
              const token = jwt.sign({userId:dbUser._id},JWT_SECRET);
              const userId = dbUser._id;

              await Accounts.create({userId:userId,balance:1 + Math.random()*10000})

             return res.json({
                msge:"User added successfully",
                token:token,
                firstName:firstName
              })
           }

})

userRouter.post('/signin',async (req,res)=>{
           const body = req.body;
           const data = UserSignin.safeParse(body);
           if(!data.success){
              res.status(411).json({
                   msge: "Error while logging in"
              })
           }

           const userFound = await User.findOne({ username:body.username,password:body.password});

           if(userFound){
              const token = jwt.sign({userId:userFound._id},JWT_SECRET)
              const user = await User.findOne({ username:body.username,password:body.password})
              res.json({
                 token:token,
                 firstName:user.firstName
              })
           }
           else{
             res.status(411).json({
                 msge:"User not found"
             })
           }
})

userRouter.post('/',authMiddleware,async (req,res)=>{
         const data = UserUpdate.safeParse(req.body);
         if(!data.success){
            res.status(411).json({
                msge:"Enteries should be in sting"
            })
         }


         try{
             await User.updateOne({_id:req.userId},req.body);
             res.json({
               msge:"Updated successfully"
             })
         }
         catch(e){
             res.json({
               msge:"unable to update the document"
            })
         }


})

userRouter.get('/bulk',async (req,res)=>{
          const filter = req.query.filter || ""

          const data = await User.find({
             $or : [
               {
                 firstName:{
                     $regex:filter,
                     $options:'i'
                 }},
                 {lastName:{
                     $regex:filter,
                     $options:'i'
                 }
             }]
          })
          console.log(data)

          res.json({
             user:data
          })
})

module.exports = userRouter;