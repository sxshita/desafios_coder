import FirebaseContainer from "../../containers/FirebaseContainer";

class FirebaseDAOCarts extends FirebaseContainer {
    constructor() {
        super('carts');
    }

    async create() {
        try{
            const cartFromScratch = {timestamp: Date.now(), products: []};
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

                const products = JSON.parse(cart.products);
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
                let cart = super.getById(cartId);

                const products = JSON.parse(cart.products);
                products.filter(prod => prod.id !== prodId);

                cart.products = products;

                super.updateById(cartId, cart);
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

export default FirebaseDAOCarts;