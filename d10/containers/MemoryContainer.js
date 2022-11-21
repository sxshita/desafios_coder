const {v4: uuid} = require('uuid'); 

class MemoryContainer {
    constructor(){
        this.array = [];
    }

    async create(object){
        try {
            let id;

            if(!object.id){
                id = uuid();
                object.id = id;
            }
            
            this.array.push(object);

            return object.id;
        } 
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async getAll(){
        try{
           return this.array;
        }
        catch(err) {
            console.log('ERROR: ', err);
            return [];
        };
    };

    async getById(id){
        try{
            let found = this.array.find(item => item.id === id);
            return found;
        }
        catch(err) {
            console.log('ERROR: ', err);
            return null;
        };
    };

    async updateById(id, newItem) {
        try{
            const index = this.array.findIndex(item => item.id === id);
            const updatedArray = this.array.filter(item => item.id !== id);

            if(index !== -1){
                newItem.id = id;
                updatedArray.push(newItem);
                this.array = updatedArray;
                return "Actualizado.";
            };
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async deleteById(id){
        try {
            let data = this.array;
            if(data?.length > 0){
                data = data.filter(item => item.id !== id);
                this.array = data;
                return 'Eliminado correctamente.';
            };
        }
        catch(err) {
            console.log('ERROR: ', err);
        };
    };

    async deleteAll() {
        try {
            this.array = [];
            return 'Eliminado correctamente.';
        }
        catch(err) {
            console.log('ERROR: ', err);
        } ;
    };
}

export default MemoryContainer;