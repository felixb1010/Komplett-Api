const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const PORT = 8000

const App = express();
var items = []

function status(button, buyButton) {
  if (button.length > 0) {
    return 'Buy'
  } else if (buyButton.length > 0) {
    return 'Not Available'
  } else {
    return false;
  }
}

App.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  next()
}) 

App.get('/', (req, res) => {
  res.json(`success on Port ${PORT}`)
})

App.get('/api/:id', (req, res) => {
    axios.get(`https://www.komplett.no/product/${req.params.id}`)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      const title = $('.product-main-info-webtext1').text().trim()
      const price = $('.product-price-now').text()
      const button = $('.subscribe-button__element')
      const buyButton = $('.buy-button')

      const itemSatus = status(button, buyButton)

      items = []

      items.push({
        id: req.params.id,
        title: title,
        price: price,
        link: `https://www.komplett.no/product/${req.params.id}`,
        status: itemSatus,
      })
      res.json(items)
      console.log(items)
    }) 
    .catch((err) => {
      console.error(err)
      res.json(items)
      items.push({
        error: err.message,
      })
    })
})

App.listen(process.env.PORT || PORT, (err, res) => {
  console.log(`listening on Port ${PORT}`)
})