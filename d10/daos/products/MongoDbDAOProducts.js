import MongoDbContainer from "../../containers/MongoDbContainer";

class MongoDbDAOProducts extends MongoDbContainer {
    constructor(){
        super('products')
    }
}

export default MongoDbDAOProducts;