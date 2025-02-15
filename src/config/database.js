const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const routes = require('./routes');
const sequelize = require('./config/database');

const app = express();

// Configuração do Handlebars
app.engine('handlebars', engine({
    helpers: {
        formatDate: (date) => {
            return new Date(date).toLocaleDateString('pt-BR');
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Middleware para variáveis globais
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    next();
});

// Rotas
app.use(routes);

// Sincronização do banco de dados e início do servidor
const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Unable to sync database:', error);
});