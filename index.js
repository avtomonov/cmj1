const express          = require('express');
const bodyParser       = require('body-parser');
const app              = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT             = process.env.PORT || 80;
const MongoClient      = require('mongodb').MongoClient;
const uri              = "mongodb+srv://cmj:cmj123@cluster0.ksqhm.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client           = new MongoClient(uri, { useNewUrlParser: true });

app.use(function (req, res, next) {
    var origins = [
        'http://chesnokov-lox.myinsales.ru',
        'http://www.example.com'
    ];

    for(var i = 0; i < origins.length; i++){
        var origin = origins[i];
        console.log(req)

        // if(req.headers.origin.indexOf(origin) > -1){
        //     res.header('Access-Control-Allow-Origin', req.headers.origin);
        // }
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT, () => {
    console.log("started server");
});

app.post("/", urlencodedParser, function (request, response) {
    DataBase(request, response)
});

app.get("/", function (request, response) {
    response.send("Главная страница");
});

function DataBase(request, response) {
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    collection.insertOne({ id: 1, login: 'login1', name: 'name1', gender: 'male' }, (err, result) => {
      if (err) {
        throw err
      }else{
        response.send("Добавлено в базу");
      }
    })
    client.close();
  });
}


