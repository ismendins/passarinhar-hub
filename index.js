const express = require('express');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/userRoutes.js');
//const farmRouter = require('./routes/farmRoutes.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const port = process.env.PORT;

const app = express();

app.use("/users", userRouter);

app.listen(port, ()=>{
    console.log(`The server is running on http://localhost:${port}`);
});