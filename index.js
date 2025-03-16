const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");
const router = require('./routes/index1');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

app.use('/api/v1',router);
app.listen(port,()=>{
       console.log("Your server is live...."+port);
})
