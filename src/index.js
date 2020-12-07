const express = require('express');
const app = express();
const port = 216;
const cors = require('cors');
const bodyParser = require('body-parser');
const md5 = require('md5');

app.use(cors());

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hdshop-database')
// mongoose.connect('mongodb://localhost/test')
.then(()=> console.log("Connnectttt")) 
.catch(err => console.log("err"+err));

const Product = require('./models/product.model');
const Login = require('./models/login.model');
const Users = require('./models/login.model');
const Cart = require('./models/giohang.model');
const Order = require('./models/donhang.model');

app.use(bodyParser.json());
app.use(express.static('src/public'));

//Trả về sản phẩm
app.get('/data', function(req, res){
    Product.find({}).then(function(data) {
         res.json(data);
    })
});
//Trả về sản phẩm theo phân loại
app.get('/data/type=:type', function(req, res){
     const type = req.params.type;
     Product.find({'type-product': type}).then(function(data) {
          res.json(data);
     })
 });
//  Chi tiết sản phẩm theo id
app.get('/data/id=:id', function(req, res){
     const id = req.params.id;  
     // console.log(id);
     Product.find({_id: id}).then(function(data) {
          res.json(data);
     })
});
//Đăng nhập
app.post('/login',function(req, res){
     const username = req.body.username;
     const password = md5(req.body.password);
     // console.log('alo alo: '+username);
     // console.log('alo alo: '+password);
     Users.findOne({username: username}).then(data =>{
          // console.log('asdasd'+data.password);
          if (password === data.password && password !==''){
               res.status(200).send({
                    id: data._id,
                    name: data.username
               })
          }else{
               res.status(200).send('Sai')
          }
     })
     .catch(error => {
          res.status(200).send('Khong ton tai')
     })

})
//Đăng ký
app.post('/sigin',function(req, res){
     const username = req.body.username;
     const password = md5(req.body.password);
     const phone = req.body.phone;
     const namecus = req.body.namecus;
     // console.log(username +'  '+ password+'  '+ phone +'  '+ namecus);
     Users.create({
          username: username,
          password: password,
          namecustomer: namecus,
          phone: phone
     })    
})
app.get('/search/key=:key', function(req,res){
     const key = req.params.key;
     // console.log('sadasdas '+ key);
     // Product.find({name: { $regex: '.*' +key+ '.*' }}).then(data=>{
     //      res.json(data); 
     // })
     Product.find({name: { $regex: new RegExp("^" + ".*" + key.toLowerCase()+ '*.', "i")}}).then(data=>{
          res.json(data); 
     })
})
//Thêm vào giỏ hàng
app.post('/addcart', function(req, res){
     const productID = req.body.productID;
     const userID = req.body.userID;
     const productName = req.body.nameProduct;
     const productImage = req.body.imageProduct;
     const quantumProduct =  req.body.quantumProduct;
     const priceProduct = req.body.priceProduct;

     // console.log(productID +" "+userID +" "+productName+" "+productImage +" "+quantumProduct+" "+priceProduct);
     Cart.find({productID: productID, userID: userID}).then(data =>{
          if (!data[0]){
               Cart.create({
                    userID: userID,
                    productID: productID,
                    nameProduct: productName,
                    imageProduct: productImage,
                    quantumProduct: quantumProduct,
                    priceProduct: priceProduct,
                    total: quantumProduct * parseInt(priceProduct)
               }) 
               res.status(200).send({
                    add : true
               })              
          }else{
               if ((data[0].quantumProduct + quantumProduct)  >= 8){
                   res.status(200).send({
                        add : false
                   })
               }else{
                    const condition = {productID: productID, userID: userID};
                    const process = {
                         quantumProduct: data[0].quantumProduct + quantumProduct,
                         total: (data[0].quantumProduct + quantumProduct) * parseInt(data[0].priceProduct)
                    }
                    Cart.updateOne(condition, process).then((res)=>{
                         
                    })
                         res.status(200).send({
                              add: true
                         })
                  
               }
               
          }
     })    
})
//them san pham
app.post('/addproduct', function(req, res){
     const nameproduct = req.body.nameproduct;
     const imageproduct ='/IMG1/' + req.body.imageproduct;
     const typeproduct = req.body.typeproduct;
     const price = req.body.price;
     const description = req.body.description;
     // console.log(nameproduct, imageproduct, typeproduct, price, description);
     Product.find({name: nameproduct}).then(data => {
          if (!data[0]){
              Product.create({
                   name: nameproduct,
                   'type-product': typeproduct,
                   price: price,
                   image: imageproduct,
                   diciption: description
              })
              res.status(200).send({
                   addpr: true
              })
          }else{
               res.status(200).send({
                    addpr:false
               })
          }
     })

})
//update số lượng
app.post('/cartupdate',function(req,res){
     const cartID = req.body.id;
     const quantum = req.body.num;
     // console.log(cartID);
     Cart.findOne({ _id: cartID }).then(data =>{
               const condition = { _id: cartID };
               const process = {
                    quantumProduct : data.quantumProduct + quantum,
                    total: (data.quantumProduct + quantum) * parseInt(data.priceProduct)
               }
               
          Cart.updateOne(condition, process).then(() => {
               res.send(200)
          })
     })
    
})
//Lấy dữ liệu từ giỏ hàng ra 
app.get('/cart/id=:id', function(req,res){
     const id = req.params.id;
     // console.log(id);
     Cart.find({userID: id}).then(data => {
          res.json(data);
     })
})
//Xóa sản phẩm giỏ hàng
app.post('/dcart/id=:id',function(req, res){
     const id = req.params.id;
     // console.log(id);
     Cart.deleteOne({_id: id}).then(result =>{
          res.send(200)
     }).catch(error =>{

     })
})
// Chi tiết User
app.get('/user/id=:id', function(req, res){
     const id = req.params.id;  
     // console.log(id);
     Users.find({_id: id}).then(function(data) {
          res.json(data);
     })
});
//thêm hóa đơn
app.post('/addorder',function(req,res){
     const userID = req.body.userID;
     const nameCus = req.body.nameCus;
     const phone = req.body.phone;
     const address = req.body.address;
     const status = 'Chờ xác nhận';
     const ttal = req.body.ttal;
     // console.log(ttal);
     
     // const today = new Date();
     
     // console.log(formatted);
     const today = new Date();
     const dateorder = today.toISOString().replace(/T/, ' ').replace(/\..+/, '')
     // console.log(dateorder);
     // const dateorder= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() +'  '+ today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
     const dateship =  today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()+20) ;
     const km = 0;
     const pship = 30000;
     Cart.find({ userID: userID }).then( function(data){
          

          const product = data.map(pr=>{
               return pr.nameProduct
          })
          const price = data.map(pr =>{
               return pr.priceProduct
          })
          const quantum = data.map(pr => { 
               return pr.quantumProduct
          })
          const total =  data.map(pr =>{
               return parseInt(pr.priceProduct)* parseInt(pr.quantumProduct)
          })   
          
         let totalod = 0;
         for (let i of data){
              totalod = totalod + i.total; 
         }
         const pvc = pship;
         const tt = totalod;
         const ttal = tt - (tt*km)+pvc
          Order.create({
               userID: userID,
               nameCus: nameCus,
               products: product,
               address: address,
               status: status,
               quantum:  quantum,
               phone: phone,
               dateOrder:dateorder,
               dateShip:dateship,
               priceProduct: price, 
               total: total,
               totalod: tt,
               phivanchuyen: pvc,
               khuyenmai: km,
               ttal: ttal
          }).then(result =>{
               Cart.deleteMany({userID : userID}).then(result => {
                    res.send(200)
                   

               }).catch(error =>{
               })
          }).catch(error =>{
          })
     }).catch(function (error){

     })
    
})
//Xem hoa don
app.get('/order/id=:id',function(req,res){
     const id = req.params.id;
     Order.find({userID: id}).then(data =>{
          res.json(data);
     }).catch(error=>{

     })
})
//xoa san pham
app.get('/dproduct/id=:id', function(req,res){
     const id = req.params.id;
     console.log(id);
     Product.deleteOne({_id : id }).then(res =>{
          res.status(200).send({
               del: true
          })
     }).catch(error =>{
          res.status(200).send({
               del: false
          })
     })
})
app.post('/updatepd', function(req,res){
     const id = req.body.id;
     const nameproduct = req.body.nameproduct;
     const imageproduct ='/IMG1/' + req.body.imageproduct;
     const typeproduct = req.body.typeproduct;
     const price = req.body.price;
     const description = req.body.description;
     console.log(id);
     // console.log(nameproduct, imageproduct, typeproduct, price, description);
     Product.findOne({_id: id}).then(data =>{
          const condition = { _id: id};
          const process = {
               name : nameproduct,
               type : typeproduct,
               "type-product" : typeproduct,
               quantum : 8,
               price : price,
               image : imageproduct,
               dicription : description
          }
          Product.updateOne(condition, process).then(()=>{
               res.status(200).send({
                    update: true
               })
          })
     })

})
app.get('/order', function(req,res){
     Order.find().then(data =>{
          res.json(data);
     }).catch(error =>{

     })
})
app.post('/adupdatecart',function(req,res){
     const id = req.body.id;
     const status = req.body.status;
   
     // console.log(id, status);
     Order.findOne({_id: id}).then(data =>{
          const condition = {_id: id};
          const process = {
              
               status : status
          }
          Order.updateOne(condition, process).then(()=>{
               res.status(200).send({
                    updatee:true
               })
          })
     })

})
app.get('/dorder/id=:id',function(req,res){
     const id = req.params.id;
     // console.log(id);
     Order.deleteOne({_id: id}).then(result =>{
          res.send(200)
     }).catch(error=>{

     })
})
app.post('/kmorder', function(req,res){
     const id = req.body.id;
     const km=req.body.km/100;
     console.log(id,km);
     Order.findOne({_id: id}).then(data =>{
          const condition = {_id: id};
          const process = {
               khuyenmai: km,
               ttal: data.totalod - (data.totalod*km)+data.phivanchuyen
          }
          Order.updateOne(condition, process).then(()=>{
               res.status(200).send({
                    kmai:true
               })
          })
     })
     
})

app.get('/hellow', (req, res) => {
     res.json({sayHi:'Hello World Dann!!!'})
})
   

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})