const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server'); // Import your server file

chai.use(chaiHttp);

let likesBefore = 0
let stockAlikeDifference = 0
let stockBlikeDifference = 0

describe('Functional Tests', () => {
    // Viewing one stock
    it('should return data for one stock', (done) => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                assert.property(res.body.stockData, 'stock', "stock property should exist")
                assert.strictEqual(res.body.stockData.stock, "GOOG", "stock property should be GOOG")
                assert.strictEqual(typeof res.body.stockData.stock, 'string');

                assert.property(res.body.stockData, 'price', "price property should exist")
                assert.strictEqual(typeof res.body.stockData.price, 'number');

                // Add more assertions as needed
                done();
            });
    });

    // Viewing one stock and liking it
    it('should return data for one stock and increment likes', (done) => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                assert.property(res.body.stockData, 'stock', "stock property should exist")
                assert.strictEqual(res.body.stockData.stock, "GOOG", "stock property should be GOOG")
                assert.strictEqual(typeof res.body.stockData.stock, 'string');

                assert.property(res.body.stockData, 'price', "price property should exist")
                assert.strictEqual(typeof res.body.stockData.price, 'number');

                assert.property(res.body.stockData, 'likes', "likes property should exist")
                assert.strictEqual(typeof res.body.stockData.likes, 'number');
                // Add more assertions as needed
                likesBefore = res.body.stockData.likes

                done();
            });
    });

    // Viewing the same stock and liking it again
    it('should return data for one stock and update likes', (done) => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&like=true')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                assert.property(res.body.stockData, 'stock', "stock property should exist")
                assert.strictEqual(res.body.stockData.stock, "GOOG", "stock property should be GOOG")
                assert.strictEqual(typeof res.body.stockData.stock, 'string');

                assert.property(res.body.stockData, 'price', "price property should exist")
                assert.strictEqual(typeof res.body.stockData.price, 'number');

                assert.property(res.body.stockData, 'likes', "likes property should exist")
                assert.strictEqual(typeof res.body.stockData.likes, 'number');
                const likesAfter = likesBefore + 1
                assert.strictEqual(res.body.stockData.likes, likesAfter, "Likes must be exactly 1 more than before");


                // Add more assertions as needed
                done();
            });
    });


    // Viewing two stocks
    it('should return data for two stocks', (done) => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                
                assert.property(res.body, "stockData", "should exist")
                assert.property(res.body.stockData[0], "stock", "should exist")
                assert.property(res.body.stockData[1], "stock", "should exist")
                assert.property(res.body.stockData[0], "price", "should exist")
                assert.property(res.body.stockData[1], "price", "should exist")
                assert.property(res.body.stockData[0], "rel_likes", "should exist")
                assert.property(res.body.stockData[1], "rel_likes", "should exist")

                assert.strictEqual(typeof res.body.stockData[0].stock, 'string');
                assert.strictEqual(typeof res.body.stockData[1].stock, 'string');
                assert.strictEqual(typeof res.body.stockData[0].price, 'number');
                assert.strictEqual(typeof res.body.stockData[1].price, 'number');
                assert.strictEqual(typeof res.body.stockData[0].rel_likes, 'number');
                assert.strictEqual(typeof res.body.stockData[1].rel_likes, 'number');

                stockAlikeDifference = res.body.stockData[0].rel_likes
                stockBlikeDifference = res.body.stockData[1].rel_likes

                done();
            });
    });

    // Viewing two stocks and liking them
    it('should return data for two stocks and update likes', (done) => {
        chai.request(server)
            .get('/api/stock-prices?stock=GOOG&stock=MSFT&like=true')
            .end((err, res) => {
                assert.strictEqual(res.status, 200);
                assert.strictEqual(typeof res.body, 'object');
                
                assert.property(res.body, "stockData", "should exist")
                assert.property(res.body.stockData[0], "stock", "should exist")
                assert.property(res.body.stockData[1], "stock", "should exist")
                assert.property(res.body.stockData[0], "price", "should exist")
                assert.property(res.body.stockData[1], "price", "should exist")
                assert.property(res.body.stockData[0], "rel_likes", "should exist")
                assert.property(res.body.stockData[1], "rel_likes", "should exist")

                assert.strictEqual(typeof res.body.stockData[0].stock, 'string');
                assert.strictEqual(typeof res.body.stockData[1].stock, 'string');
                assert.strictEqual(typeof res.body.stockData[0].price, 'number');
                assert.strictEqual(typeof res.body.stockData[1].price, 'number');
                assert.strictEqual(typeof res.body.stockData[0].rel_likes, 'number');
                assert.strictEqual(typeof res.body.stockData[1].rel_likes, 'number');

                assert.strictEqual(res.body.stockData[0].rel_likes, stockAlikeDifference); 
                assert.strictEqual(res.body.stockData[1].rel_likes, stockBlikeDifference);

                done();
            });
    });



});
