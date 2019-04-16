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

const db = {};
db.datas = new Nedb({filename: 'usersfile'});
db.datas.loadDatabase();
const findDb = (query) => {
    return new Promise((resolve, reject) => {
        db.datas.find(query, (err, docs) => {
            if (err) reject(err);
            else  resolve(docs);
        });
    });
};
const putDb = (newDoc) => {
    return new Promise((resolve, reject) => {
        db.datas.insert(newDoc, (err) => {
            if (err) reject(err);
            else resolve(true);
        });
    });
};

const loadUsers = async (userMng, privilegeMng) => {
    const resp = await findDb({});
    console.log(resp);
    resp.forEach(e => {
        const user = userMng.addUser(e.name, e.password, false);
        privilegeMng.setRights(user, '/', ['all']);
    });
};

const userManager = new webdav.SimpleUserManager();
const privilegeManager = new webdav.SimplePathPrivilegeManager();
const adminUsr = userManager.addUser('admin', 'admin', true);
privilegeManager.setRights(adminUsr, '/', ['all']);
const server = new webdav.WebDAVServer({
    httpAuthentication: new webdav.HTTPBasicAuthentication(userManager, 'Default realm'),
    privilegeManager,
    maxRequestDepth: Infinity
});
loadUsers(userManager, privilegeManager);

const rootDir = path.join(__dirname, 'storage');

server.setFileSystemSync('/', new webdav.PhysicalFileSystem(rootDir));

const upload = multer();

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
app.use(webdav.extensions.express('/webdav', server));

app.get('/', (req, res) => {
    res.render('index.ejs', {});
});

app.post('/login', upload.none(), (req, res) => {
    const name = req.body.name;
    const pass = req.body.password;
    req.session.name = name;
    req.session.pass = pass;
    res.send('ok');
});

app.get('/logged', (req, res) => {
    res.send({
        name: req.session.name, 
        pass: req.session.pass
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('ok');
});

app.listen(3000, () => console.log('server start on 3000'));