const fs = require('fs');
const {v4: uuidv4} = require('uuid');

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

class Container {
    constructor(fileName) {
        this.file = `${fileName}.txt`;
    }

    async save(object) {
        try {
            if(object){
                const productsArray = await this.getAll();
                
                var id = uuidv4();
                object.id = id;

                productsArray.push(object);

                await fs.promises.writeFile(this.file, JSON.stringify(productsArray));

                return id;
            }   
        }
        catch (err) {
            console.log('Error al escribir el archivo: ', err);
        }
    }

    async getById(id){
        let content = await this.getAll();
        return content?.find(p => p.id === id) ?? null;
    };

    async getAll(){
        try{
            await fileExist(this.file);

            let data = await fs.promises.readFile(this.file);
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
                await fs.promises.writeFile(this.file, JSON.stringify(data));
                return 'Producto eliminado correctamente';
            } else {
                return 'No hay productos para borrar;'
            };   
        }
        catch(err) {
            console.log('Error al borrar el producto: ', err);
        };
    };

    async deleteAll() {
        try {
            await fs.promises.unlink(this.file);
            return 'Se borraron todos los productos correctamente.';
        }
        catch(err) {
            console.log('Error al borrar todos los productos: ', err);
        } ;
    };

    async randomProduct(){
        try {
            const products = await this.getAll();
            const index = Math.floor(Math.random() * ((products.length + 1) - 1) + 1);
            const product = products[index];
            return product;
        }
        catch(err) {
            console.log('Se produjo un error: ', err);
        };
    };
}

module.exports = Container;