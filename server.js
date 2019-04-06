const express = require('express');
const morgan = require('morgan');
const ejs = require('ejs');
const multer = require('multer');
const session = require('express-session');
const webdav = require('webdav-server').v2;
const Nedb = require('nedb');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const server = new webdav.WebDAVServer({
    maxRequestDepth: Infinity
});
const app = express();

const rootDir = path.join(__dirname, 'storage');

server.setFileSystemSync('/', new webdav.PhysicalFileSystem(rootDir));

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
app.use(webdav.extensions.express('/webdav', server));

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});

app.listen(3000, () => console.log('server start on 3000'));