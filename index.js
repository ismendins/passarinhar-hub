const express = require('express');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/userRoutes.js');
const farmRouter = require('./routes/farmRoutes.js');
const cors = require('cors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const port = process.env.PORT;

const app = express();
app.use(cors());
app.set('view engine', 'ejs');

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Bem vindo ao Passarinhar Hub!');
  });
app.use("/users", userRouter);
app.use("/farms", farmRouter);

app.listen(port, ()=>{
    console.log(`The server is running on http://localhost:${port}`);
});