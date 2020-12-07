var mongoose  =  require('mongoose');

var LoginSchema = new mongoose.Schema({
     "username": String,
     "password": String,
     "namecustomer": String,
     "phone": String
})

var Users = mongoose.model('Users',LoginSchema,'users');
module.exports = Users;