const express          = require('express');
const bodyParser       = require('body-parser');
const app              = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT             = process.env.PORT || 80;
const MongoClient      = require('mongodb').MongoClient;
const uri              = "mongodb+srv://cmj:cmj123@cluster0.ksqhm.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client           = new MongoClient(uri, { useNewUrlParser: true });
var cors = require ('cors');

app.use(cors({
    origin:['http://chesnokov-lox.myinsales.ru','http://chesnokov-lox.myinsales.ru'],
    credentials:true
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://chesnokov-lox.myinsales.ru");
  res.header('Access-Control-Allow-Headers', true);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
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


