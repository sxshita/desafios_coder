const express = require('express');
const bodyParser = require('body-parser');
const routerProducts = express.Router();
const routerCart = express.Router();

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//--------------------- MIDLEWARES -----------------------
const middlewareAuthentication = (req, res, next) => {
    req.user = {
        fullName: "Sasha Racagni",
        isAdmin: true
    };
    next();
};

const middlewareAuthorization = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("No estas autorizado");
    }
};
//---------------- END MIDLEWARES ------------------------

const ContainerProd = require('./controllers/products.js');
const ContainerCart = require('./controllers/cart.js');
const products = new ContainerProd('products');
const cart = new ContainerCart('cart');

// -------------------------------------- ENDPOINTS PRODUCTOS ----------------------------------------
//GET: '/:id?' - Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores) b

routerProducts.get('/:id?', middlewareAuthentication, (req, res) => {
    
    if(req.params.id){
        products.getById(req.params.id).then(response => res.send({response}));
    }
    else {
        products.getAll().then(response => res.send({response}));
    }

});

//POST: '/' - Para incorporar productos al listado (disponible para administradores)

routerProducts.post('/', middlewareAuthentication, middlewareAuthorization, async (req, res) => {
    try {
        req.body.timestap = Date.now();
        const id = await products.save(req.body);
        if(id) res.send({status: 'added', id});
        else res.send({status: 'not added', id});
    }
    catch(err) {
        console.log('error en el servidor');
    }
});

//PUT: '/:id' - Actualiza un producto por su id (disponible para administradores)

routerProducts.put('/:id', middlewareAuthentication, middlewareAuthorization, async (req, res) => {
    try {
        const id = req.params.id;
        await products.updateById(id, req.body);
        res.send({status: 'updated', id});
    }
    catch(err) {
        console.log('error en el servidor');
    }
});


//DELETE: '/:id' - Borra un producto por su id (disponible para administradores)

routerProducts.delete('/:id', middlewareAuthentication, middlewareAuthorization, async (req, res) => {
    try {
        const id = req.params.id;
        await products.deleteById(id, req.body);
        res.send({status: 'deleted', id});
    }
    catch(err) {
        console.log('error en el servidor');
    }
});

// -------------------------------------- ENDPOINTS CARRITO ----------------------------------------

//POST: '/' - Crea un carrito y devuelve su id. b

routerCart.post('/', async (req, res) => {
    try {
        const id = await cart.createCart();
        res.send({status: 'created', id});
    }
    catch {
        console.log('error en el servidor');
    }
});

//DELETE: '/:id' - Vacía un carrito y lo elimina. b

routerCart.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if(id){
            await cart.deleteCartById(id);
            res.send({status: 'deleted', id});
        }
        res.send({status: 'id not found', id});
    }
    catch {
        console.log('error en el servidor');
    }
});

//GET: '/:id/productos' - Me permite listar todos los productos guardados en el carrito. b
    routerCart.get('/:id/productos', async (req, res) => {
        try {
            const id = req.params.id;
            const products = cart.getCartProducts(id);
            if(products) res.send({ products });
            else res.send({products: []});
        }
        catch {
            console.log('error en el servidor');
        }
    });

//POST: '/:id/productos' - Para incorporar productos al carrito por su id de producto. b
    routerCart.post('/:id/productos', async (req, res) => {
        try {
            const cartId = req.params.id;
            const prodId  = req.body.prodId;
            await cart.saveProductById(cartId, prodId);
            res.send({ status: 'added'});
        }
        catch {
            console.log('error en el servidor');
        }
    });


//DELETE: '/:id/productos/:id_prod' - Eliminar un producto del carrito por su id de carrito y de producto. b
routerCart.delete('/:id/productos/:id_prod', async (req, res) => {
    try {
        const idCart = req.params.id;
        const idProd = req.params.id_prod;
       
        await cart.deleteProductById(idCart, idProd);
        res.send({status: 'deleted'});
    }
    catch {
        console.log('error en el servidor');
    }
});

app.use('/api/productos', routerProducts);
app.use('/api/carrito', routerCart);

app.use((req, res) => {
    res.status(404).send("La ruta no existe");
});

app.listen(8080, (req, res) => {
    console.log('Escuchando');
});