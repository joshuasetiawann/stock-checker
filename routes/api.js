const express = require('express');
const fetch = require('node-fetch');
let db = [];

function hashIp(ip) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(ip, 'utf8').digest('hex');
}

const router = express.Router();

router.get('/stock-prices', async (req, res) => {
  const { stock, like } = req.query;
  const clientIp = req.ip || req.connection.remoteAddress;
  const anonIp = hashIp(clientIp);

  let stockArray = Array.isArray(stock) ? stock : [stock];
  stockArray = stockArray.map(s => s.toUpperCase());

  try {
    const stockDataPromises = stockArray.map(async (symbol) => {
      const response = await fetch(
        `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
      );

      const data = await response.json();

      let likes = 0;
      let userLiked = false;

      const recordIndex = db.findIndex(r => r.stock === symbol && r.ip === anonIp);
      if (like && recordIndex === -1) {
        db.push({ stock: symbol, ip: anonIp });
      }

      const allLikes = db.filter(r => r.stock === symbol);
      likes = allLikes.length;
      userLiked = recordIndex !== -1;

      return {
        stock: symbol,
        price: data.latestPrice || data.previousClose,
      };
    });

    const results = await Promise.all(stockDataPromises);

    let stockData;
    if (results.length === 1) {
      stockData = results[0];
    } else {
      const rel_likes = results[0].likes - results[1].likes;
      stockData = [
        { ...results[0], rel_likes },
        { ...results[1], rel_likes: -rel_likes }
      ];
    }

    res.json({ stockData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

module.exports = router;
