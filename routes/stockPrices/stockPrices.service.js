const stockRepository = require('./stockPrices.repository');
const Stock = require("./stockPrices.model")
const axios = require('axios');

class StockService {
    async viewStock(symbol) {
        let stock = await stockRepository.findBySymbol(symbol);
        if (!stock) {
            stock = await stockRepository.save(new Stock({ stock: symbol }));
        }
        return this.transformStockData(stock);
    }

    async likeStock(symbol) {
        let stock = await stockRepository.findBySymbol(symbol);
        if (!stock) {
            stock = await stockRepository.save(new Stock({ stock: symbol }));
        }
        stock = await stockRepository.incrementLikes(symbol);
        return this.transformStockData(stock);
    }

    async getStockPrice(symbol) {
        const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${process.env.POLYGON_API_KEY}`;

        try {
            const response = await axios.get(apiUrl);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch stock data for ${symbol}`);
        }
    }

    async updateStockPrice(symbol) {
        const possbile_data = await this.getStockPrice(symbol);
        if (possbile_data.results[0].c) {
            let stock = await stockRepository.findBySymbol(symbol);
            if (stock) {
                stock.price = possbile_data.results[0].c;
                await stockRepository.save(stock);
            }
        }
    }

    transformStockData(stock) {
        return {
            price: stock.price,
            stock: stock.stock,
            likes: stock.likes
        };
    }
}

module.exports = new StockService();
