const express = require('express')
const app = express()

const PORT = process.env.PORT || 80

app.listen(PORT, () => {
	console.log('started server')
})

app.get('/', (req, res) => {
    res.send(`<h1>Замена статусов заказа инсейлс</h1>`);
});


