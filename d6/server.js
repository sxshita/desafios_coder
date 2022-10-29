const express = require('express');
const { engine } = require("express-handlebars");
const app = express();
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('views','./public/views');
app.set('view engine','hbs');

// Inicializacion de Containers
const ProductsContainer = require('./controllers/ProductsController');
const productsCont = new ProductsContainer('products');

const MsgContainer = require('./controllers/MessagesController');
const msgCont = new MsgContainer('messages');

//Routing
app.get('/', async (_, res) => {
    const products = await productsCont.getAll();
    res.render('table', { products });
})

// ** [WEBSOCKETS] ** //
const httpServer = new HttpServer(app);
const socketServer = new SocketServer(httpServer);

socketServer.on('connection', async (socket) => {
  socket.emit('products', await productsCont.getAll());
  socket.emit('messages', await msgCont.getAll());

  socket.on('new_product', async (product) => {
    await productsCont.save(product);
    let products = await productsCont.getAll();
    socketServer.sockets.emit('products', products);
  });

  socket.on('new_message', async (message) => {
    try{
      await msgCont.save(message);
      let messages = await msgCont.getAll();
      socketServer.sockets.emit('messages', messages);
    }
    catch(err){
      console.log(`error: ${err}`);
    }
  });

});

httpServer.listen(8080, () => {
  console.log('Escuchando!');
});

