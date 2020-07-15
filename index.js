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
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const cors = require('cors');

var whitelist = ['http://www.cmjournal.ru', 'http://example2.com']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  }else{
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.listen(PORT, () => {
  console.log("started server");
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});
app.post("/", urlencodedParser, function(request, response) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  response.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  DataBaseUpload(request, response);
});
app.get("/", function(request, response) {
  response.send('')
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
      console.log('update')
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
}, 6000)