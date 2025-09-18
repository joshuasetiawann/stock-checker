const chai = require('chai');
const assert = chai.assert;

suite('Functional Tests', () => {
  const TEST_SERVER = 'http://localhost:3000'; // Ganti jika deploy

  test('Viewing one stock: GET /api/stock-prices', done => {
    chai.request(TEST_SERVER)
      .get('/api/stock-prices')
      .query({ stock: 'goog' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.property(res.body.stockData, 'price');
        assert.isNumber(res.body.stockData.price);
        assert.property(res.body.stockData, 'likes');
        assert.isAtLeast(res.body.stockData.likes, 0);
        done();
      });
  });

  test('Viewing one stock and liking it: GET /api/stock-prices', done => {
    chai.request(TEST_SERVER)
      .get('/api/stock-prices')
      .query({ stock: 'msft', like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.equal(res.body.stockData.stock, 'MSFT');
        assert.isAtLeast(res.body.stockData.likes, 1);
        done();
      });
  });

  test('Viewing same stock and liking again: GET /api/stock-prices', done => {
    chai.request(TEST_SERVER)
      .get('/api/stock-prices')
      .query({ stock: 'msft', like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.equal(res.body.stockData.stock, 'MSFT');
        assert.equal(res.body.stockData.likes, 1);
        done();
      });
  });

  test('Viewing two stocks: GET /api/stock-prices', done => {
    chai.request(TEST_SERVER)
      .get('/api/stock-prices')
      .query({ stock: ['aapl', 'goog'] })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[0], 'price');
        assert.property(res.body.stockData[0], 'rel_likes');
        done();
      });
  });

  test('Viewing two stocks and liking them: GET /api/stock-prices', done => {
    chai.request(TEST_SERVER)
      .get('/api/stock-prices')
      .query({ stock: ['aapl', 'goog'], like: true })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.stockData);
        assert.equal(res.body.stockData.length, 2);
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.notEqual(res.body.stockData[0].rel_likes, undefined);
        done();
      });
  });
});
