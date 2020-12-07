var Product = require('../models/product.model.js');

module.exports.index = function(req,res){
     Product.find().then(function(product){
          res.render('products/index', {
               product: products
          });
     });
};