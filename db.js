const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://dipanshuojha12:Ojha7777%40@cluster0.h6n76j3.mongodb.net/userTable');

const mongoose = require('mongoose');

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("✅ Database connected successfully!");
    } catch (e) {
        console.error("❌ Failed to connect to database:", e.message);
    }
};


connectdb();

const UserSchema = new mongoose.Schema({
      username:String,
      password:String,
      firstName:String,
      lastName:String
      
})

const AccountSchema = new mongoose.Schema({
        userId:{
             type:mongoose.Schema.Types.ObjectId,
             required:true,
             ref:"User"
        },
        balance:{
            type:Number,
            required:true,
            min:0
        }
})

const User = mongoose.model('User',UserSchema);
const Accounts = mongoose.model('Account',AccountSchema);

module.exports = {User,Accounts};