class MongoDbContainer {
    constructor(model){
        this.model = model;
    }

    async create(object) {
        try{
            const myModel = this.model;
            const saveModel = new model.myModel(object);
            const objectSave = await saveModel.save();
            return objectSave;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        }
        
    }

    async getAll() {
        try{
            const myModel = this.model;
            const all = await model.myModel.find({});
            return all;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async getById(id) {
        try{
            const myModel = this.model;
            const object = await model.myModel.find({id: id});
            return object;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async updateById(id, object) {
        try{
            const myModel = this.model;
            const objectUpdate = await model.myModel.updateOne({id: id}, {
                $set: {object}
            });
            return objectUpdate;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async deleteById(id) {
        try{
            const myModel = this.model;
            const objectDelete = await model.myModel.deleteOne({id: id});
            return objectDelete;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }

    async deleteAll() {
        try{
            const myModel = this.model;
            const objectsDelete = await model.myModel.delete({});
            return objectsDelete;
        }
        catch(err) {
            console.log(`ERROR: ${err}`);
        } 
    }
}

export default MongoDbContainer;