var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
     
     "userID" : String,
     'nameCus': String, 
     "products": [],
     'address': String,
     "phone": String,
     "status": String,
     "quantum": [],
     "dateOrder":Date,
     "dateShip":Date,
     "priceProduct": [],
     "total": [],
     "totalod": Number,
     "phivanchuyen": Number,
     "khuyenmai": Number,
     "ttal":Number
})
var Order = mongoose.model('Order', OrderSchema, 'order');
module.exports = Order;