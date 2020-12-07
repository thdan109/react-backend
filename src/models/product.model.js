var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({    
     // "_id": String,
     "name": String,
     "type": String,
     "type-product": String,
     "quantum": String,
     "price": String,
     "image": String,
     "dicription": String
});

var Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;