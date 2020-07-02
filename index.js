const express = require('express')
const request = require('request')
const MongoClient = require('mongodb').MongoClient;
const app = express()

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
	console.log('started server')
})

const id = 'e430f992ca01bc61286b1e50bf58c57c'
const key = '17b8a11d15946f5aaaf39aaa4278aa9b'


const uri = "mongodb+srv://andrevv:qwe321@cluster0.qc9y5.mongodb.net/<dbname>?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });


var orderCreate = (order) =>{
	
}

client.connect(err => {
	const collection = client.db("test").collection("devices");
 	collection.insertOne(
     {id: 2, login: 'login2', name: 'name1', gender: 'male'},
     (err, result) => {
       if(err){
         console.log('Unable insert user: ', err);
         throw err;
       }
     }
    );
  // perform actions on the collection object
  client.close();
});




app.post('/database', (req, res) => {
	console.log(req, res);
})

app.get('/', (req, res) => {
	let status = {
	  "order": {
	    "custom_status": "accepted"
	  }
	}

	//Custom Header pass
	var headersOpt = {  
	    "Content-Type": "application/json",
	};

	request(
	        {
	        method:'put',
	        url:`https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders/21197247.json`, 
	        body: status, 
	        headers: headersOpt,
	        json: true,
	    }, function (error, response, body) {  
	        //Print the Response
	        let send = JSON.stringify(response)	
			res.send(`
			   	<h1>Замена статусов заказа инсейлс</h1>
				<div>${send}</div>
			`);	
	}); 
});





