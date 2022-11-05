const Knex = require('knex');

class Container {

    constructor(options, table) {
        this.knex = Knex(options);
        this.table = table;
    }

    async save(object){
        try {
            await this.knex(this.table).insert({object});
        }
        catch(err) {
            console.log(err);
        }
    }
    
    async getById(id) {
        try {
            const response = await this.knex.from(this.table).select("*").where({"id": id});
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async getAll() {
        try {
            const response = await this.knex.from(this.table).select("*");
            return response;
        }
        catch(err) {
            console.log(err);
        }
    }

    async deleteById(id) {
        try {
            await knex(this.table).where({ "id": id }).del();
            return "Producto eliminado correctamente."
        }
        catch(err) {
            console.log(err);
        }
    }

    async deleteAll() {
        try {
            await knex(this.table).del();
            return "Todos los productos fueron eliminados."
        }
        catch(err) {
            console.log(err);
        }
    }

    async updateById(id, product) {
        try {
            await knex(this.table).where({ "id": id }).update({ product });
            return "Producto actualizado correctamente."
        }
        catch(err) {
            console.log(err);
        }
    }
}

module.exports = Container;