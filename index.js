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

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

app.post('/url', function(req, res) {
    const url = req.body.url;
    res.send(321);
});


// const client = new MongoClient(uri, { useNewUrlParser: true });

// client.connect(err => {
// 	const collection = client.db("test").collection("devices");
//  	collection.insertOne(
//      {id: 2, login: 'login2', name: 'name1', gender: 'male'},
//      (err, result) => {
//        if(err){
//          console.log('Unable insert user: ', err);
//          throw err;
//        }
//      }
//     );
//   // perform actions on the collection object
//   client.close();




// });

// console.log(client)































app.get('/', (req, res) => {
    

	// request(`https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders.json`, (err, response, body) => {
	//    let send = JSON.stringify(response)	
	//    res.send(`
	//    	<h1>Замена статусов заказа инсейлс</h1>
	// 	<div>${send}</div>
	//    	`);	
	//    console.log(err, response, body)
	// });


	// request(`https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders/21197247.json`, (err, response, body) => {
	//     let send = JSON.stringify(response)	
	// 	res.send(`
	// 	   	<h1>Замена статусов заказа инсейлс</h1>
	// 		<div>${send}</div>
	// 	`);	
	// });



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


// request({ url: `https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders/21197247.json`,headers: {'content-type' : 'application/json'}, method: 'PUT', form: status}, (err, response, body) =>{
// 	let send = JSON.stringify(response)	
// 	res.send(`
// 	   	<h1>Замена статусов заказа инсейлс</h1>
// 		<div>${send}</div>
// 	`);	
// })

	// request.put({
 //     url: `https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders/21197247.json`,
 //     data: status
 //    }, (err, response, body) => {
 //     if(err)
 //       return res.status(500).send({message: err});
    
 //     console.log(err, response, body);
    
 //    });


});





