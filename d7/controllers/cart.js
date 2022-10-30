const fs = require('fs');
const {v4: uuid} = require('uuid');

const fileExist = async (path) => {
    try {
        const stats = fs.existsSync(path);

        if (stats == false) {
            await fs.promises.writeFile(path, "[]");
        };
    }
    catch(err) {
        console.log(err);
    };
};

const getAllProducts = async () => {
    try{
        await fileExist('products.txt');

        let data = await fs.promises.readFile('products.txt');
        data = JSON.parse(data);
        return data;
    }
    catch(err) {
        console.log('Error al obtener todos los productos: ', err);
        return [];
    };
    
};

class ContainerCart {
    constructor(name){
        this.name = `${name}.txt`;
    };

    async getAll(){
        try{
            await fileExist(this.name);

            let data = await fs.promises.readFile(this.name, 'utf-8');
            data = JSON.parse(data);
            return data;
        }
        catch(err) {
            console.log('Error al obtener todos los carritos: ', err);
            return [];
        };
    };

    async createCart() {
        try{
            const cartArray = await this.getAll();
            const object = {id: uuid(), timestamp: Date.now(), products: []};
            const id = object.id;
            
            cartArray.push(object);

            await fs.promises.writeFile(this.name, JSON.stringify(cartArray));
            return id;
        }
        catch(err) {
            console.log('Se produjo un error: ', err);
        };
    };

    async deleteCartById(id) {
        try {
            const cartArray = await this.getAll();

            const newCartArray = cartArray.filter(cart => cart.id !== id);
            await fs.promises.writeFile(this.name, JSON.stringify(newCartArray));
        }
        catch(err) {
            console.log('Error al borrar el carrito: ', err);
        };
    };

    async getCartProducts(id) {
        const cartArray = await this.getAll();

        const cart = cartArray.find(cart => cart.id === id);

        return cart.products;
    };

    async saveProductById(cartId, prodId) {
        try{
            if(cartId && prodId){

                const allProductsFromBd = await getAllProducts();
                const cartsArray = await this.getAll();
    
                let cartMatched = cartsArray.find(cart => cart.id === cartId);
                const productMatched = allProductsFromBd.find(prod => prod.id === prodId);
    
                cartMatched.products.push(productMatched);
        
                await this.deleteCartById(cartId);

                let updatedCartsArray = await this.getAll();
                updatedCartsArray.push(cartMatched);
    
                await fs.promises.writeFile(this.name, JSON.stringify(updatedCartsArray));     
                
                return cartMatched;
            }
        }
        catch(err) {
            console.log('Error al agregar producto: ', err);
            return `el error: ${err}`;
        };
    }

    async deleteProductById(cartId, prodId){
        try{
          const cartArray = await this.getAll();
          const cartMatched = cartArray.find(cart => cart.id === cartId);

          const productsUpdated = cartMatched.products.filter(p => p.id !== prodId);

          cartMatched.products = productsUpdated;
          
          await this.deleteCartById(cartId);

          let cartArrayUpdated = await this.getAll();
          cartArrayUpdated.push(cartMatched);

          await fs.promises.writeFile(this.name, JSON.stringify(cartArrayUpdated)); 
        }
        catch(err){
            console.log('Error al eliminar producto: ', err);
        };
        
    };
};

module.exports = ContainerCart;