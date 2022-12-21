const dotenv = require('dotenv').config();
const argv = require('./util/yargs/yargs');
const express = require('express');
const cluster = require('cluster');
const http = require('http');
const { engine } = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const session = require('express-session');
const passport = require('./util/passport/passport');
const MongoStore = require('connect-mongo');
const connectMongo = require('./util/mongo/mongoInit');
const routes = require("./routes/routes");
const checkAuth = require("./middlewares/checkAuth");

const numCPUs = require('os').cpus().length;
const isMaster = cluster.isMaster;
  
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({
  store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  cookie: {
    maxAge: 60000
  },
  saveUninitialized: true,
  rolling: true
}));
app.use(passport.initialize())
app.use(passport.session())

app.set('views','./public/views');
app.set('view engine','hbs');

app.engine(
  'hbs',
  engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
  })
);

// ** [INDEX] ** //

app.get('/', checkAuth, routes.getIndex);

// ** [LOGIN] ** //
app.get('/login', routes.getLogin);
app.get('/login/failure', routes.getLoginFail);
app.post('/login', passport.authenticate('auth', {failureRedirect: '/login/failure'}), routes.postLogin);

// ** [REGISTER] ** //
app.get('/register', routes.getRegister);
app.get('/register/failure', routes.getRegisterFail)
app.post('/register', passport.authenticate('register', {failureRedirect: '/register/failure', failureMessage: true} ), routes.postRegister);

// ** [LOGOUT] ** //
app.get('/logout', routes.getLogout)

// ** [FAKER PRODUCTS] ** //
app.get('/api/productos-test', routes.getFakerProducts);

// ** [INFO ARGUMENTOS] ** //
app.get('/info', routes.getInfo);

// ** [API RANDOMS] ** //
app.get('/api/randoms', routes.getApiRandoms);

// ** [WEBSOCKETS] ** //
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
  const {products, messages} = await connectMongo();
  const myMessages = await messages.getById(333);
 
  socket.emit('products', await products.getAll());
  if(myMessages) socket.emit('messages', myMessages.messages);

  socket.on('new_product', async (product) => {
    try {
      await products.save(product);
      let prods = await products.getAll();
      socketServer.sockets.emit('products', prods);
    }
    catch(err) {
      console.log(err);
    }
    
  });

  socket.on('new_message', async (message) => {
    try {
      const arrayMessagesId = 333;
      await messages.saveMessage(arrayMessagesId, message);
      let arrayMessages = await messages.getById(arrayMessagesId);
      socketServer.sockets.emit('messages', arrayMessages.messages);
    }
    catch(err){
      console.log(`error: ${err}`);
     }
  });

});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
})

if(argv.mod === 'CLUSTER' && isMaster) {

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  };

  cluster.on('exit', (worker) => {
    console.log(`Worker with PID ${worker.process.pid} exited`);
  });
} else {
  httpServer.listen(argv.p, () => {
    console.log(`Servidor corriendo en puerto ${argv.p}`);
  });
}

