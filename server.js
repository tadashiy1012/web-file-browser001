const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const multer = require('multer');
const session = require('express-session');
const Nedb = require('nedb');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();

app.set('trust proxy', 1);
app.set('ejs', ejs.renderFile);
app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(session({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});

app.listen(3000, () => console.log('server start on 3000'));