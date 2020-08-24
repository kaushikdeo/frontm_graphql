const Food = require('../models/Food.js');
const Order = require('../models/Order');
const mongoose = require('mongoose');

module.exports = {
  Query: {
    // ---------------PROTECTED QUERY---------------
    greetings: async (parent, {}, {db}) => {
      return "Hello World";
    },
    fetchFoods: async (parent, {page, limit, sortBy, orderBy, costMin, costMax, filterString}, {db, req}) => {
        const pageNumber = Number(page) || 1;
        const queryLimit = Number(limit) || 5;
        const startIndex = (pageNumber - 1) * queryLimit;
        const endIndex = pageNumber * queryLimit;
        const sortType = sortBy ? sortBy.toString() : 'cusineType' ;
        const orderSequence = Number(orderBy) === 1 ? 1 : -1;
        const minCost = Number(costMin);
        const maxCost = Number(costMax);
        const filter = filterString ? filterString.toString() : '';
        const sortQuery = {
            [sortType]: orderSequence,
        };
        let filterQuery = {};
        if (maxCost && minCost) {
            filterQuery = {
                itemName: new RegExp(filter, 'i'),
                cost: { $gte:minCost, $lte: maxCost }
            }
        } else {
            filterQuery = {
                itemName: new RegExp(filter, 'i')
            }
        }
        const results = {error: false};
        const foodsLength = await Food.countDocuments(filter);
        if (((pageNumber * queryLimit) > foodsLength) && (pageNumber * queryLimit) - foodsLength > queryLimit) {
            // TODO:
            results.error = true; 
            results.message ='Invalid page';
        }
        if (endIndex < foodsLength) {
            results.next = {
                page: pageNumber+1,
                queryLimit,
            }
        }
        if (startIndex > 0) {
            results.previous = {
                page: pageNumber-1,
                queryLimit,
            }
        }
        const allFoods = await Food.find(filterQuery).limit(limit).skip(startIndex).sort(sortQuery);
        results.foods = allFoods;
        const totalTime = process.hrtime(req.queryStartTime);
        results.totalExecutionTime = `${totalTime[0]} s ${totalTime[1]/1000000} ms`;
        return results;
    }
  },

  Mutation: {
    placeFoodOrder: async (parent, {data}, {db, req}) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const isValid = await Promise.all((data.map(async (foodItem) => {
                const isFoodQuantity = await Food.findOne({
                    _id: foodItem.foodItem,
                    inventory: {$gte: foodItem.itemCount}
                });
                if (!isFoodQuantity) throw new Error('one of the food item out of stock');
                await Food.findOneAndUpdate({
                    _id: foodItem.foodItem,
                    inventory: {$gte: foodItem.itemCount}
                }, {
                    $inc: {
                        inventory: -foodItem.itemCount,
                    }
                })
            })))
            if (isValid) {
                const order = new Order({
                    orderItems: data,
                }, {_id: true, session});
                const savedOrder = await order.save();
                await session.commitTransaction();
                const totalTime = process.hrtime(req.queryStartTime);
                const totalExecutionTime = `${totalTime[0]} s ${totalTime[1]/1000000} ms`;
                console.log('totalExecutionTime', totalExecutionTime);
                return {error: false, message: 'Order saved successfully', savedOrder: savedOrder.orderItems, totalExecutionTime};
            }
        } catch (error) {
            await session.abortTransaction();
            const totalTime = process.hrtime(req.queryStartTime);
            const totalExecutionTime = `${totalTime[0]} s ${totalTime[1]/1000000} ms`;
            console.log('error', error);
            return {error: true, message: 'Error occured while saving new food item', totalExecutionTime};
        } finally {
            session.endSession();
        }
    },
  },

  Order: {
    foodItem: async (parent, {}, {}) => {
        const foodItem = await Food.findById(parent.foodItem);
        return foodItem;
    }
  }
};