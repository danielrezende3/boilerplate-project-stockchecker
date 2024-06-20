const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
    this.timeout(5000); // Increase timeout if requests take longer

    // Viewing one stock
    // test('GET request to /api/stock-prices/ with single stock', function (done) {
    //     chai.request(server)
    //         .get('/api/stock-prices/')
    //         .query({ stock: 'goog' })
    //         .end(function (err, res) {
    //             assert.equal(res.status, 200);
    //             assert.property(res.body, 'stockData');
    //             assert.equal(res.body.stockData.stock, 'GOOG');
    //             done();
    //         });
    // });

    // Viewing one stock and liking it
    // test('GET request to /api/stock-prices/ with single stock and like', function (done) {
    //     chai.request(server)
    //         .get('/api/stock-prices/')
    //         .query({ stock: 'goog', like: true })
    //         .end(function (err, res) {
    //             assert.equal(res.status, 200);
    //             assert.property(res.body, 'stockData');
    //             assert.equal(res.body.stockData.stock, 'GOOG');
    //             assert.isAtLeast(res.body.stockData.likes, 1);
    //             done();
    //         });
    // });

    // Viewing the same stock and liking it again
    // test('GET request to /api/stock-prices/ with single stock and like again', function (done) {
    //     chai.request(server)
    //         .get('/api/stock-prices/')
    //         .query({ stock: 'goog', like: true })
    //         .end(function (err, res) {
    //             assert.equal(res.status, 429);
    //             assert.property(res.body, 'error');
    //             assert.equal(res.body.error, "Too many like requests from this IP, please try again later.");
    //             done();
    //         });
    // });

    // Viewing two stocks
    // test('GET request to /api/stock-prices/ with two stocks', function (done) {
    //     chai.request(server)
    //         .get('/api/stock-prices/')
    //         .query({ stock: ['goog', 'msft'] })
    //         .end(function (err, res) {
    //             assert.equal(res.status, 200);
    //             assert.isArray(res.body.stockData);
    //             assert.equal(res.body.stockData.length, 2);
    //             done();
    //         });
    // });

    // Viewing two stocks and liking them
    // test('GET request to /api/stock-prices/ with two stocks and like', function (done) {
    //     chai.request(server)
    //         .get('/api/stock-prices/')
    //         .query({ stock: ['goog', 'msft'], like: true })
    //         .end(function (err, res) {
    //             assert.equal(res.status, 200);
    //             assert.isArray(res.body.stockData);
    //             assert.equal(res.body.stockData.length, 2);
    //             // Check if both stocks have at least 1 like
    //             assert.isAtLeast(res.body.stockData[0].likes, 1);
    //             assert.isAtLeast(res.body.stockData[1].likes, 1);
    //             done();
    //         });
    // });
});
