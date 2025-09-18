function getSingleStock() {
  const stock = document.getElementById('stockInput').value.trim();
  if (!stock) return alert('Please enter a stock symbol');

  fetch('https://stock-checker.onrender.com/api/stock-prices?stock=' + stock)
    .then(res => res.json())
    .then(data => {
      const result = document.getElementById('singleResult');
      result.innerHTML = `
        ${data.stockData.stock}: $${data.stockData.price.toFixed(2)} 
        (Likes: ${data.stockData.likes})
      `;
    })
    .catch(err => console.error(err));
}

function compareStocks() {
  const stock1 = document.getElementById('stock1').value.trim();
  const stock2 = document.getElementById('stock2').value.trim();
  if (!stock1 || !stock2) return alert('Please enter both stock symbols');

  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}`)
    .then(res => res.json())
    .then(data => {
      const result = document.getElementById('compareResult');
      const [s1, s2] = data.stockData;
      result.innerHTML = `
        ${s1.stock}: $${s1.price.toFixed(2)} (Rel Likes: ${s1.rel_likes})<br>
        ${s2.stock}: $${s2.price.toFixed(2)} (Rel Likes: ${s2.rel_likes})
      `;
    })
    .catch(err => console.error(err));
}

function likeStock() {
  const input = document.getElementById('stockInput').value.trim();
  const stock1 = document.getElementById('stock1').value.trim();
  const stock2 = document.getElementById('stock2').value.trim();

  let url = '/api/stock-prices?';
  if (input) {
    url += `stock=${input}&like=true`;
  } else if (stock1 && stock2) {
    url += `stock=${stock1}&stock=${stock2}&like=true`;
  } else {
    return alert('Please check a stock first');
  }

  fetch(url)
    .then(res => res.json())
    .then(() => {
      alert('Thank you for liking!');
      if (document.getElementById('stockInput').value) getSingleStock();
      if (document.getElementById('stock1').value && document.getElementById('stock2').value) compareStocks();
    });
}