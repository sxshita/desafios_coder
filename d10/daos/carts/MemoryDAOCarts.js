import MemoryContainer from "../../containers/MemoryContainer";

class MemoryDAOCarts extends MemoryContainer {
    constructor(){
        super();
    }

    async create() {
        try{
            const cartFromScratch = {id: uuidv4(),timestamp: Date.now(), products: []};
            super.array = await super.create(cartFromScratch);
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

                cart = cart.products.push(product);

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

                const products = cart.products;
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

export default MemoryDAOCarts;