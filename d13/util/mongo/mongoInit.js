const dotenv = require('dotenv').config()
const MongoDbContainer = require('../../container');
const {MongoClient} = require('mongodb');

async function connectMongo() {
    try {
      const mongo = new MongoClient(process.env.DB_URL);
      const products = new MongoDbContainer(mongo, 'ecommerce', 'products');
      const messages = new MongoDbContainer(mongo, 'chat', 'messages');
      const users =  new MongoDbContainer(mongo, 'userList', 'users');
      await mongo.connect();
      return { products, messages, users};
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

module.exports = connectMongo;