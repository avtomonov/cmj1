const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});
const PORT = process.env.PORT || 80;
const uri = "mongodb+srv://cmj:cmj123@cluster0.ksqhm.mongodb.net/<dbname>?retryWrites=true&w=majority";
const mongoose = require('mongoose');
const ORDER = mongoose.model('ORDER', {
  order_id: String,
  products: String
});
const db = mongoose.connection;
const id = 'e430f992ca01bc61286b1e50bf58c57c';
const key = '17b8a11d15946f5aaaf39aaa4278aa9b';
const Request = require('request')
const cors = require('cors')




mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.listen(PORT, () => {
  console.log("started server");
});
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
//   next();
// });




app.post("/",cors(), urlencodedParser, function(request, response) {
  DataBaseUpload(request, response)
  response.send('post')
});
app.get("/", function(request, response) {
  response.send('get')
});

function DataBaseUpload(request, response) {
  let req_body = JSON.parse(JSON.stringify(request.body));
  order = new ORDER(req_body);
  order.save().then(() => console.log('upload'));
}

function DataBaseUpDate(order_id, product_id) {
  ORDER.find({
    order_id: order_id
  }, function(err, orders) {
    if(err) return console.error(err);

    if(orders[0].products == ','){
      ORDER.deleteOne({order_id: orders[0].order_id}, function(err, orders) {});
      console.log('remove')
    }else{
      var arr = orders[0].products.split(',')
      arr = arr.filter(element => element !== '');
      var new_arr = [];
      arr.forEach(function(item, index, array) {
        if (item != product_id) {
          new_arr.push(item)
        }
      });
      var string = new_arr.join() + ',';
      ORDER.updateOne({order_id: orders[0].order_id}, {products: string}, function(err, result){
        // mongoose.disconnect();
        if(err) return console.log(err);
      });
    }
  })
}

function SetStatus(order_id, product_id) {
  var status = {
    "order": {
      "custom_status_permalink": "approved"
    }
  }
  var headersOpt = {
    "Content-Type": "application/json",
  };
  var url = `https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders/${order_id}.json`;
  Request({
    method: 'put',
    url: url,
    body: status,
    headers: headersOpt,
    json: true,
  }, function(error, response, body) {
    DataBaseUpDate(order_id, product_id)
  });
}

function InsalesProductAvailable(orders) {
  for(let i = 0; i < orders.length; i++) {
    var order_id = orders[i].order_id;
    Request(`https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/products.json?from_id=${orders[i].products}`, (err, response, body) => {
      var productsResponce = JSON.parse(response.body)
      for(var key in productsResponce) {
        var properties = productsResponce[key].properties;
        var product_id = productsResponce[key].id;
        for(var prop in properties) {
          if(properties[prop].permalink == 'dostupnost') {
            SetStatus(order_id, product_id)
          }
        }
      }
    });
  }
}

var interval = setInterval(function() {
  ORDER.find({}, function(err, orders) {
    if(err) return console.error(err);
    InsalesProductAvailable(orders);
  })
}, 60000)