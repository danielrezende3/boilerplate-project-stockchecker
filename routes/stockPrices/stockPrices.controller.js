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
        like = like === 'true';

        let stockData;
        if (Array.isArray(stock)) {
            if (like) {
                await Promise.all(stock.map(async (symbol) => {

                    await new Promise((resolve, reject) => {
                        likeLimiter(req, res, async (err) => {
                            if (err) return reject(err instanceof Error ? err : new Error(err));
                            try {
                                await stockService.likeStock(symbol)
                                resolve()
                            } catch (e) {
                                reject(e instanceof Error ? e : new Error(e));
                            }
                        })
                    });
                }));
            }
            stockData = await Promise.all(stock.map(async (symbol) => {
                return await stockService.viewStock(symbol);
            }));

            stockData[0].rel_likes = stockData[0].likes - stockData[1].likes
            stockData[1].rel_likes = stockData[1].likes - stockData[0].likes
            delete stockData[0].likes
            delete stockData[1].likes
        } else if (like) {
            await new Promise((resolve, reject) => {
                likeLimiter(req, res, async (err) => {
                    if (err) return reject(err instanceof Error ? err : new Error(err));
                    try {
                        await stockService.likeStock(stock)
                        resolve()
                    } catch (e) {
                        reject(e instanceof Error ? e : new Error(e));
                    }
                })
            });
            stockData = await stockService.viewStock(stock);
        } else {
            stockData = await stockService.viewStock(stock);
        }

        res.json({ stockData });
    }
}

module.exports = new StockController();
