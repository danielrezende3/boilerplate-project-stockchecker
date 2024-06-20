const stockRepository = require('./stockPrices.repository');
const Stock = require("./stockPrices.model")
const axios = require('axios');
class StockService {
    async viewStock(symbol) {
        let stock = await stockRepository.findBySymbol(symbol);
        if (!stock) {
            stock = await stockRepository.save(new Stock({ stock: symbol }));
        }
        return stock;
    }

    async likeStock(symbol) {
        let stock = await stockRepository.findBySymbol(symbol);
        if (!stock) {
            stock = await stockRepository.save(new Stock({ stock: symbol }));
        }
        stock = await stockRepository.incrementLikes(symbol);
        return stock;
    }

    async getStockPrice(symbol) {
        const apiUrl = `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`;

        try {
            const response = await axios.get(apiUrl);
            // Parse the response and return relevant data
            return response.data.previousClose; // Adjust this based on the API response structure
        } catch (error) {
            throw new Error(`Failed to fetch stock data for ${symbol}`);
        }
    }
    async updateStockPrice(symbol) {
        const price = await this.getStockPrice(symbol);
        let stock = await stockRepository.findBySymbol(symbol);
        if (stock) {
            stock.price = price;
            stock = await stockRepository.save(stock);
        }
        return stock;
    }
}

module.exports = new StockService();
