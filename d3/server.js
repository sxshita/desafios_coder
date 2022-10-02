const express = require('express');
const app = express();

const port = 8080;
const Container = require('./Container');
const Apple = new Container('Apple');

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));

app.get('/', (req, res) => {
    res.send(`
        <h1> Bienvenido Terricola </h1>
        <a href='/productos'> Ir a productos </a>
        <br>
        <a href='/productoRandom'> Recibir producto random </a>
    `);
});

app.get('/productos', (req, res) => {
    Apple.getAll().then(products => res.send(products));
});

app.get('/productoRandom', (req, res) => {
    Apple.randomProduct().then(response => res.send(response));
});

const Mac = {
    title: 'Macbook Air M1', price: 140000, thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_679546-MLA47180498257_082021-O.webp'
}

const iPhone = {
    title: 'iPhone 13', price: 200000, thumbnail: 'https://m.media-amazon.com/images/I/61l9ppRIiqL.jpg'
}