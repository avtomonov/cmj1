const express = require('express')
const request = require('request')
const app = express()

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
	console.log('started server')
})

app.get('/', (req, res) => {
    res.send(`<h1>Замена статусов заказа инсейлс</h1>`);
});

const id = 'e430f992ca01bc61286b1e50bf58c57c'
const key = '17b8a11d15946f5aaaf39aaa4278aa9b'


request(`https://${id}:${key}@chesnokov-lox.myinsales.ru/admin/orders.xml`, (err, response, body) => {
    if(err){
		return res.status(500).send({message: err});
    }
    else{
    	return res.send(body);
    }  
});


