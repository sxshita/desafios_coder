const fs = require('fs');
const {v4: uuid} = require('uuid'); 

class ArchiveContainer {
    constructor(name){
        this.name = `${name}.txt`
    }

    async create(object){
        try {
            const data = await this.getAll();
            let id;

            if(!object.id){
                id = uuid();
                object.id = id;
            }
            
            data.push(object);

            await fs.promises.writeFile(this.name, JSON.stringify(data));
            return id;
        } 
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async getAll(){
        try{
            await this.fileExist(this.name);

            let data = await fs.promises.readFile(this.name, 'utf-8');
            data = JSON.parse(data);
            return data;
        }
        catch(err) {
            console.log('ERROR: ', err);
            return [];
        };
    };

    async getById(id){
        try{
            let found = await this.getAll();
            return found?.find(item => item.id === id) ?? null;
        }
        catch(err) {
            console.log('ERROR: ', err);
            return null;
        };
    };

    async updateById(id, newItem) {
        try{
            const data = await this.getAll();
            const index = data.findIndex(item => item.id === id);
            data.filter(item => item.id !== id);

            if(index !== -1){
                newItem.id = id;
                data.push(newItem);
                await fs.promises.writeFile(this.name, JSON.stringify(data));
                return "Actualizado.";
            };
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async deleteById(id){
        try {
            let data = await this.getAll();
            if(data?.length > 0){
                data = data.filter(item => item.id !== id);
                await fs.promises.writeFile(this.name, JSON.stringify(data));
                return 'Eliminado correctamente.';
            };
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async deleteAll() {
        try {
            await fs.promises.unlink(this.name);
            return 'Eliminado correctamente.';
        }
        catch(err) {
            console.log('ERROR: ', err);
        } ;
    };

    //HELPERS
    async fileExist(path){
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
}

export default ArchiveContainer;