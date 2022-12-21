const { fork } = require('child_process');
const connectMongo = require('../util/mongo/mongoInit');
const uploadProducts = require("../util/faker/uploadProducts");

const getIndex = async (req, res) => {
    const {products} = await connectMongo();
    const prods = await products.getAll();
    res.render('table', { prods, user: req.session.passport.user });
};

const getLogin = (_, res) => {
    res.render('login');
};

const getLoginFail = (_, res) => {
    res.render('login', {error: true});
};

const postLogin = (_, res) => {
    res.redirect('/')
};

const getRegister = (_, res) => {
    res.render('register');
};

const getRegisterFail = (_, res) => {
    res.render('register', {error: true});
}

const postRegister = async (_, res) => {
    res.redirect('/login');
}

const getLogout = (req, res) => {
    const username = req.session.passport.user;
    if (req.session.passport.user){
      req.logout(function(err) {
        if (err) { return next(err); }
        res.render('logout', { user: username });
      });
    }; 
};

const getApiRandoms = (req, res) => {
    var cant = 1000000;
    if(req.query.cant){
      cant = req.query.cant
    };

    const forked = fork('./apiRandoms.js');
    forked.send({start: true, cant});
    forked.on('message', (msg) => {
        if(msg){
            res.send(msg);
        }
    });
}

const getFakerProducts = async (_, res) => {
    const prods = await uploadProducts();
    res.render('table-test', { prods });
};

const getInfo = (_, res) => {
    res.send(
        {
            argv, 
            OS: process.platform, 
            nodeVersion: process.version, 
            rss: process.memoryUsage.rss(), 
            pid: process.ppid, 
            execPath: process.execPath, 
            dir: process.argv[1],
            currentProcessors: require('os').cpus().length
        }
    );
};

module.exports = {
    getIndex,
    getLogin,
    getLoginFail,
    postLogin,
    getRegister,
    getRegisterFail,
    postRegister,
    getLogout,
    getApiRandoms,
    getFakerProducts,
    getInfo,
}