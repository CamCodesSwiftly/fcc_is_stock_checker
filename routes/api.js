'use strict';
const axios = require('axios');

let stockLikes = {};

module.exports = function (app) {
  // Define a GET route for /api/stock-prices
  app.get('/api/stock-prices', async (req, res) => {
    try {
      let stockSymbol1 = '';
      let stockSymbol2 = '';

      if (Array.isArray(req.query.stock)) {
        stockSymbol1 = req.query.stock[0];
        stockSymbol2 = req.query.stock[1];
      } else {
        stockSymbol1 = req.query.stock;
      }

      const response1 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol1}/quote`);
      const data1 = response1.data;

      // Make a request for the second stock only if req.query.stock is an array
      let data2;
      if (Array.isArray(req.query.stock)) {
        const response2 = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol2}/quote`);
        data2 = response2.data;
      }

      if (!stockLikes[stockSymbol1]) {
        stockLikes[stockSymbol1] = {
          stock: stockSymbol1,
          price: data1.latestPrice,
          likes: 0
        };
      }

      if (req.query.like) {
        stockLikes[stockSymbol1].likes += 1;
      }

      // Update stockLikes for the second stock only if req.query.stock is an array
      if (Array.isArray(req.query.stock) && !stockLikes[stockSymbol2]) {
        stockLikes[stockSymbol2] = {
          stock: stockSymbol2,
          price: data2.latestPrice,
          likes: 0
        };
      }

      if (Array.isArray(req.query.stock) && req.query.like) {
        stockLikes[stockSymbol2].likes += 1;
      }

      let returnObject;
      if (Array.isArray(req.query.stock)) {
        const relLikes1 = stockLikes[stockSymbol1].likes - stockLikes[stockSymbol2].likes;
        const relLikes2 = stockLikes[stockSymbol2].likes - stockLikes[stockSymbol1].likes;

        returnObject = {
          stockData: [
            {
              stock: stockSymbol1,
              price: data1.latestPrice,
              rel_likes: relLikes1
            },
            {
              stock: stockSymbol2,
              price: data2.latestPrice,
              rel_likes: relLikes2
            }
          ]
        };
      } else {
        returnObject = {
          stockData: {
            stock: stockSymbol1,
            price: data1.latestPrice,
            likes: stockLikes[stockSymbol1].likes
          }
        }
      }

      res.json(returnObject);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching data from the external API' });
    }
  });
};
