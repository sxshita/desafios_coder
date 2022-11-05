const express = require('express');
const { engine } = require("express-handlebars");
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const Container = require('./container')

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('views','./public/views');
app.set('view engine','hbs');

const optionsSqlite3 = {
    client: 'sqlite3',
    connection: {
      filename: './db/ecommerce.db'
    }
};

const optionsMySql = {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'root',
      password : 'root',
      database : 'ecommerce'
    }
};

const products = new Container(optionsMySql, 'products');
const msg = new Container(optionsSqlite3, 'messages');

app.get('/', (req, res) => {
  const products = products.getAll();
  res.render('table', { products });
});

// ** [WEBSOCKETS] ** //
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
  socket.emit('products', products.getAll());
  socket.emit('messages', await msg.getAll());

  socket.on('new_product', (product) => {
    products.save(product);
    let products = products.getAll();
    socketServer.sockets.emit('products', products);
  });

  socket.on('new_message', async (message) => {
    try{
      await msgCont.save(message);
      let messages = await msg.getAll();
      socketServer.sockets.emit('messages', messages);
    }
    catch(err){
      console.log(`error: ${err}`);
    }
  });

});

httpServer.listen(8080, () => {
  console.log('Servidor corriendo en puerto 8080');
})