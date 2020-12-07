var mongoose = require('mongoose');

var CartSchema = new mongoose.Schema({
     
     "userID" : String,
     "productID":  String,
     "nameProduct": String,
     "imageProduct":  String,
     "quantumProduct": Number,
     "priceProduct": Number,
     "total": Number,
     
})
var Cart = mongoose.model('Cart', CartSchema, 'cart');
module.exports = Cart;