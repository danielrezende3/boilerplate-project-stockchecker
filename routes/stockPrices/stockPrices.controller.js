const stockService = require('./stockPrices.service');

// Rate limiting setup
const rateLimit = require('express-rate-limit');
const likeLimiter = rateLimit({
    windowMs: 5, // 1 minute 60 * 1000
    max: 1, // limit each IP to 1 like request per windowMs
    message: { "error": "Too many like requests from this IP, please try again later." }
});

class StockController {
    async getStock(req, res) {
        let { stock, like } = req.query;

        if (!stock) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }
        else if (Array.isArray(stock) && stock.length > 2) {
            return res.status(400).json({ error: 'Must have at most 2 stocks' })
        }
        stock = Array.isArray(stock) ? stock.map(s => s.toUpperCase()) : stock.toUpperCase();

        let stockData;
        like = like === 'true';
        if (Array.isArray(stock)) {
            stockData = await Promise.all(stock.map(async (symbol) => {
                if (like) {
                    return await likeLimiter(req, res, async () => {
                        return await stockService.likeStock(symbol);
                    });
                } else {
                    return await stockService.viewStock(symbol);
                }

            }));
            stockData[0].rel_likes = stockData[0].likes - stockData[1].likes
            stockData[1].rel_likes = stockData[1].likes - stockData[0].likes
            delete stockData[0].likes
            delete stockData[1].likes
        } else if (like) {
            stockData = await likeLimiter(req, res, async () => {
                return await stockService.likeStock(stock);
            });
        } else {
            stockData = await stockService.viewStock(stock);
        }

        // Update prices for all stocks fetched
        // await Promise.all(stock.map(async (symbol) => {
        //     await stockService.updateStockPrice(symbol);
        // }));

        res.json({ stockData });
    }
}

module.exports = new StockController();
