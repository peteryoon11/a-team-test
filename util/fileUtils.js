const fs = require('fs');

module.exports = {

  // store list
   getFile(){

     let data = fs.readFileSync('./store.json','utf8');
      return JSON.parse(data);
  }
}