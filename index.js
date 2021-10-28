const express = require('express');
const axios = require('axios')
const cheerio = require('cheerio');
const PORT = 8000
const validator = require('validator')
const bodyParser = require('body-parser');

const App = express();
var items = []
var storage = [
  {
    id: '1189592'
  },
  {
    id: '1187631'
  },
]

const remove = (item, array) => {
  
}

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

App.use(bodyParser.urlencoded({ extended: true }));

App.route('/items')
  .get((req, res) => {
    if (items.length === 0){
      res.status(400).json('No items')
    } else {
      res.json(items)
    }
    
  })
  .post((req, res) => {
    const store = req.query.store;
    const id = req.query.id;
    console.log('Adding ' + id, store)

    switch (store) {
      case 'Komplett':
        valid(1, 10)
        break;
      case 'Elkjøp':
        valid(1, 8)
        break;
      case 'Dustin':
        valid(1, 6)
        break;
    }

    function valid(low, high) {
      if(id.length > low && id.length < high){
        axios.get(`https://www.komplett.no/product/${id}`)
        .then((response) => {
          const html = response.data
          const $ = cheerio.load(html)
    
          const title = $('.product-main-info-webtext1').text().trim()
          const price = $('.product-price-now').text()
          const button = $('.subscribe-button__element')
          const buyButton = $('.buy-button')
          const itemSatus = status(button, buyButton)
          if(price.length > 0) {
            items.push({
              id: id,
              title: title,
              price: price,
              link: `https://www.komplett.no/product/${id}`,
              status: itemSatus,
            })
            res.status(200).json('200 OK')
          } else {
            res.status(400).json('400 BAD')
          }
          }) 
        .catch((err) => {
          console.error(err.message)
          res.status(400).json('Error Connecting to Store')
        })
      } else {
        res.json('400 Not Valid id')
      }
    }
    
    
  })
  .delete((req, res) => {
    const id = req.query.id
    var index = items.findIndex(item => item.id === id);
    if(index !== -1) {
      items.splice(index, 1)
      res.json('Delete Success')
    } else {
      res.status(400).json('Delete Failed')
    }
    
  })

App.get('/items/update', (req, res) => {
  res.status(200)
})




App.get('/', (req, res) => {
  res.json(`success on Port ${PORT}`)
})

App.listen(process.env.PORT || PORT, (err, res) => {
  console.log(`listening on Port ${PORT}`)
})