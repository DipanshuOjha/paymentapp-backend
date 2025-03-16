const JWT_SECRET = require('./config');
const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers["authorization"]
      console.log(req.headers)
      if(!authHeader || !authHeader.startsWith('Bearer ')){
        console.log(authHeader)
       return res.status(403).json({
             msge:"Not a valid token"
        })
      }
       
      const token = authHeader.split(' ')[1];
       
      try{
        const decode = jwt.verify(token,JWT_SECRET);
        req.userId = decode.userId;
        next();
      }
      catch(e){
         res.status(403).json({
             msge:"Error white decode"
         })
      }
      
}

module.exports = authMiddleware;

