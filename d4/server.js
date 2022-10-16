const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const routerProducts = express.Router();

const port = 8080;
const Container = require('./Container');
const Apple = new Container('Apple');

const uploader = multer();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));

// ---------- endpoints

routerProducts.get('/', async (req, res) => {
    const products = await Apple.getAll();
    if(!products) res.send({ error: 'No hay productos cargados'});
    else if(products) res.send({ products });
})

routerProducts.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const product = Apple.getById(id);
    if(!product) res.send({ error: 'Producto no encontrado' });
    else if(product) res.send({ product });
})

routerProducts.post('/', uploader.none(), (req, res) => {
    if (!req.body) return res.sendStatus(400);
   const id = Apple.save(req.body);
   const product = Apple.getProductById(id);
   res.send({product});
})

routerProducts.put('/:id', (req, res) => {
    const response = Apple.updateProductById(parseInt(req.params.id), req.body);
    res.send({response});
})

routerProducts.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const response = Apple.deleteById(id);
    res.send({response});
});

// ----------

app.use('/api/productos', routerProducts);

const Mac = {
    title: 'Macbook Air M1', price: 140000, thumbnail: 'https://http2.mlstatic.com/D_NQ_NP_679546-MLA47180498257_082021-O.webp'
}

const iPhone = {
    title: 'iPhone 13', price: 200000, thumbnail: 'https://m.media-amazon.com/images/I/61l9ppRIiqL.jpg'
}

async function main() {
    await Apple.save(Mac);
    await Apple.save(iPhone);
}
