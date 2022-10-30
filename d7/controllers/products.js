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

class ContainerProd {
    constructor(name){
        this.name = `${name}.txt`;
    };

    async save(object){
        try {
            const productsArray = await this.getAll();
            let id;

            if(!object.id){
                id = uuid();
                object.id = id;
            }
            
            productsArray.push(object);

            await fs.promises.writeFile(this.name, JSON.stringify(productsArray));
            return id;
        } 
        catch(err) {
            console.log('Error al escribir el archivo: ', err);
        };
    };

    async getById(id){
        let found = await this.getAll();
        return found?.find(p => p.id === id) ?? null;
    };

    async getAll(){
        try{
            await fileExist(this.name);

            let data = await fs.promises.readFile(this.name);
            data = JSON.parse(data);
            return data;
        }
        catch(err) {
            console.log('Error al obtener todos los productos: ', err);
            return [];
        };
        
    };

    async deleteById(id){
        try {
            let data = await this.getAll();
            if(data?.length > 0){
                data = data.filter(product => product.id !== id);
                await fs.promises.writeFile(this.name, JSON.stringify(data));
                return 'Producto eliminado correctamente';
            } else {
                return 'No hay productos para borrar';
            };
        }
        catch(err) {
            console.log('Error al borrar el producto: ', err);
        };
    };

    async deleteAll() {
        try {
            await fs.promises.unlink(this.name);
            return 'Se borraron todos los productos correctamente.';
        }
        catch(err) {
            console.log('Error al borrar todos los productos: ', err);
        } ;
    };

    async updateById(id, newProduct) { 
        try{
            const products = await this.getAll();
            const index = products.findIndex(p => p.id === id);
            products.filter(p => p.id !== id);

            if(index !== -1){
                newProduct.id = id;
                products.push(newProduct);
                await fs.promises.writeFile(this.name, JSON.stringify(data));
                return "Se actualizo el producto";
            } else {
                return "Producto no existente";
            };
        }
        catch(err) {
            console.log('Se produjo un error: ', err);
        };
    };

    async randomProduct(){
        try {
            const productos = await this.getAll();
            const index = Math.floor(Math.random() * ((productos.length + 1) - 1) + 1);
            const producto = await this.getById(index);
            return producto;
        }
        catch(err) {
            console.log('Se produjo un error: ', err);
        };
    };

};


module.exports = ContainerProd;
