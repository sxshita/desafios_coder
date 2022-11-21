let CartContainerImport;
let CartContainerToImport;
let ProductContainerImport;
let ProductContainerToImport;
let connectDBToImport;

//------ SCHEMA -----------
const ProductSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true},
    title: {type: String, require: true, max: 100},
    code: {type: Number, require: true},
    thumbnail: {type: String, require: true},
    price: {type: Number, require: true},
    stock: {type: Number, require: true},
});
const Products = mongoose.model('product', ProductSchema);

const CartSchema = new mongoose.Schema({
    id: {type: String, require: true, unique: true},
    timestamp: {type: Date, require: true},
    products: {type: Array}
});
const Carts = mongoose.model('cart', CartSchema);
//------ END SCHEMA -----------

//----- CONEXION MONGODB / FIREBASE -----
async function connectMongo() {
    try {
        const mongoose = require('mongoose');
        const URI = 'mongodb+srv://sasha:coder.sasha@cluster0.ezluz.mongodb.net/?retryWrites=true&w=majority';
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

async function connectFirebase() {
    try {
        const admin = require("firebase-admin");
        const serviceAccount = require("./coderback-701cd-firebase-adminsdk-54y73-c26932406a.json")

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://coderback-701cd.firebaseio.com"
        })
    }
    catch(err) {
        console.log(`ERROR: ${err}`);
    }
}

async function connectDefault() {
    console.log('Connected by default')
}
//----- END CONEXION MONGODB / FIREBASE -----

switch (process.env.BD) {
    case 'mongodb':
      CartContainerImport = await import("./carts/MongoDbDAOCarts.js");
      ProductContainerImport = await import("./products/MongoDbDAOProducts");

      CartContainerToImport = new CartContainerImport(Carts);
      ProductContainerImport = new ProductContainerToImport(Products)

      connectDBToImport = connectMongo;
    break;
    case 'firebase':
        CartContainerImport = await import("./carts/FirebaseDAOCarts.js");
        ProductContainerImport = await import("./products/FirebaseDAOProducts");

        CartContainerToImport = new CartContainerImport('carts');
        ProductContainerImport = new ProductContainerToImport('products');

        connectDBToImport = connectFirebase;
    break;
    case 'archive':
        CartContainerImport = await import("./carts/ArchiveDAOCarts.js");
        ProductContainerImport = await import("./products/ArchiveDAOProducts");

        CartContainerToImport = new CartContainerImport('carts');
        ProductContainerImport = new ProductContainerToImport('products');

        connectDBToImport = connectDefault;
    break;
    case 'memory':
        CartContainerImport = await import("./carts/MemoryDAOCarts.js");
        ProductContainerImport = await import("./products/MemoryDAOProducts");

        CartContainerToImport = new CartContainerImport();
        ProductContainerImport = new ProductContainerToImport();

        connectDBToImport = connectDefault;
    break;  
}

export const CartContainer = CartContainerToImport;
export const ProductContainer = ProductContainerToImport;
export const connectDB = connectDBToImport;