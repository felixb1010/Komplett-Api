function getItem(id){
   axios.get(`https://www.komplett.no/product/${id}`)
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)

      const title = $('.product-main-info-webtext1').text().trim()
      const price = $('.product-price-now').text()
      const button = $('.subscribe-button__element')
      const buyButton = $('.buy-button')

      const itemSatus = status(button, buyButton)

      items.push({
        id: id,
        title: title,
        price: price,
        link: `https://www.komplett.no/product/${id}`,
        status: itemSatus,
      })
    }) 
    .catch((err) => {
      console.error(err)
      items.push({
        error: err.message,
      })
      res.json(items)
    })
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



