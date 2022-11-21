import ArchiveContainer from "../../containers/ArchiveContainer";

class ArchiveDAOCarts extends ArchiveContainer {
    constructor(){
        super('carts');
    }

    async create(){
        try{
            const cartArray = await super.getAll();
            const object = {id: uuid(), timestamp: Date.now(), products: []};
            const id = object.id;
            
            cartArray.push(object);

            await fs.promises.writeFile(this.name, JSON.stringify(cartArray));
            return id;
        }
        catch(err) {
            console.log('ERR: ', err);
        };        
    }

    async getProducts(id) {
        const cartArray = await super.getAll();

        const cart = cartArray.find(cart => cart.id === id);

        return cart.products;
    };

    async saveProduct(cartId, product) {
        try{
            if(cartId && product){
                const cartsArray = await super.getAll();
    
                let cartMatched = cartsArray.find(cart => cart.id === cartId);
    
                cartMatched.products.push(product);
        
                await this.deleteCartById(cartId);

                let updatedCartsArray = await super.getAll();
                updatedCartsArray.push(cartMatched);
    
                await fs.promises.writeFile(this.name, JSON.stringify(updatedCartsArray));     
                
                return cartMatched;
            }
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    }

    async deleteProductById(cartId, prodId){
        try{
          const cartArray = await super.getAll();
          const cartMatched = cartArray.find(cart => cart.id === cartId);

          const productsUpdated = cartMatched.products.filter(p => p.id !== prodId);

          cartMatched.products = productsUpdated;
          
          await this.deleteCartById(cartId);

          let cartArrayUpdated = await super.getAll();
          cartArrayUpdated.push(cartMatched);

          await fs.promises.writeFile(this.name, JSON.stringify(cartArrayUpdated)); 
        }
        catch(err){
            console.log('ERROR: ', err);
        };
    }

    // HELPERS
    async deleteCartById(id) {
        try {
            const cartArray = await super.getAll();

            const newCartArray = cartArray.filter(cart => cart.id !== id);
            await fs.promises.writeFile(this.name, JSON.stringify(newCartArray));
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

}

export default ArchiveDAOCarts;