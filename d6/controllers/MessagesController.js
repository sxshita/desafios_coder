const fs = require('fs');
const {v4: uuidv4} = require('uuid');

class MessagesContainer {
    constructor(name){
      this.name = `${name}.txt`;
    };
  
    async save (message) {
      try {
        const messagesArray = await this.getAll();
        messagesArray.push(message);
  
        await fs.promises.writeFile(this.name, JSON.stringify(messagesArray));
      } 
      catch (err) {
        console.log('Error al escribir el archivo: ', err);
      };
    };
  
    async getAll(){
      try {
        await fileExist(this.name);
  
        let data = await fs.promises.readFile(this.name);
        data = JSON.parse(data);
        return data;
      }
      catch (err) {
        console.log('Error al obtener los mensajes: ', err);
        return [];
      };
        
    };
}

// -- Helpers -- //

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

module.exports = MessagesContainer;