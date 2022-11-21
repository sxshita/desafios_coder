import MongoDbContainer from "../../containers/MongoDbContainer";
import { v4 as uuidv4 } from 'uuid';

class MongoDBDAOCarts extends MongoDbContainer {
    constructor() {
        super('carts')
    }

    async create() {
        try{
            const cartFromScratch = {id: uuidv4(),timestamp: Date.now(), products: []};
            const res = await super.create(cartFromScratch);
            return res;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        }
    }

    async getProducts(id) {
        try {
            const cart = await super.getById(id);

            return cart.products;
        }
        catch(err){
            console.log(`ERROR: ${err}`);
        }
    }

    async saveProduct(cartId, product) {
        try {
            if(cartId && product){
                let cart = await super.getById(cartId);

                const products = cart.products;
                products.push(product);

                cart.products = products;

                await super.updateById(cartId, cart);
            }
            else {
                console.log('Producto o ID no ingresado');
            }
        }
        catch(err){
            console.log(`ERROR: ${err}`);
        }
    }

    async deleteProduct(cartId, prodId) {
        try {
            if(cartId && prodId){
                const cart = super.getById(cartId);

                const products = cart.products;
                products.filter(prod => prod.id !== prodId);

                super.updateById(cartId, {products: products});
            }
            else {
                console.log('ID no ingresado');
            }
        }
        catch(err){
            console.log(`ERROR: ${err}`);
        }
    }
}

export default MongoDBDAOCarts;