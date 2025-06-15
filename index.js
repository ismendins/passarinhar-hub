const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');
const session = require('express-session');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const farmRouter = require('./routes/farmRoutes');
const mapRouter = require('./routes/mapRoutes');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middlewares

app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

// Páginas do views

app.get('/users/login', (req, res) => {
    console.log('Sessão do usuário:', req.session.user);
    res.render('userLogin');
});

app.get('/users/register', (req, res) => {
    res.render('userRegister');
});

app.post('/register', authRouter);

app.get('/homepage', (req, res) => {
    res.render('farmSearch');
});

app.get('/cadastro-fazenda', (req, res) => {
    res.render('farmForm');
});

app.get('/farms/success', (req, res) => {
    res.render('farmSuccess');
});

// Rotas

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/farms", farmRouter);
app.use("/map", mapRouter);

app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});