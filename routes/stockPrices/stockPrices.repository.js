const Stock = require('./stockPrices.model');

class StockRepository {
    async findBySymbol(symbol) {
        return await Stock.findOne({ stock:symbol });
    }

    async save(stock) {
        return await stock.save();
    }

    async incrementLikes(symbol) {
        return await Stock.findOneAndUpdate({ stock:symbol }, { $inc: { likes: 1 } }, { new: true });
    }
}

module.exports = new StockRepository();
