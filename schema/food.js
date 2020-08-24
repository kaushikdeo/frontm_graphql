const { gql } = require('apollo-server');

module.exports = gql`
  extend type Query {
    greetings: String!
    fetchFoods(page: Int, limit: Int, sortBy: String, orderBy: Int, costMin: Int, costMax: Int, filterString: String): FoodResult!
  },

  extend type Mutation {
      greetingMutation: String!
      placeFoodOrder(data: [OrderInput]!): SavedOrder!
  }

  type SavedOrder {
      error: Boolean
      message: String
      totalExecutionTime: String!
      savedOrder: [Order]
  }

  input OrderInput {
    foodItem: ID!
    itemCount: Int!
  }

  type Order {
    foodItem: Food!
    itemCount: Int!
  }

  type FoodResult {
    error: Boolean!
    message: String
    next: Page
    previous: Page
    foods: [Food]!
    totalExecutionTime: String!
  }

  type Page {
    page: Int
    queryLimit: Int
  }

  type Food {
      itemName: String!
      cusineType: String!
      foodType: String!
      cost: Int!
      inventory: Int!
  }
`;