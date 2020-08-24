# frontm Graphql API Nodejs
## Steps to run the server
```
npm i
npm start
```

on the browser open http://localhost:4000/

You will see a graphql playground where you can simulate the graphql queries mutation and subscriptions

## Query request to obtain list of products
Paste the following on the left pane and then press Cmd + Enter
```
{
  fetchFoods(page: 2 
    limit: 10 
    sortBy: "itemName" 
    orderBy: 1 
    costMin: 100 
    costMax: 1000 
    filterString: "1"
  ){
    error
    message
    totalExecutionTime
    next {
      page
      queryLimit
    }
    previous{
      page
      queryLimit
    }
    foods {
     	itemName
    	cusineType
    	foodType
    	cost
    	inventory 
    }
  }
}

```

## Mutation request to place a order
Paste the following on the left pane and then press Cmd + Enter
```
mutation {
  placeFoodOrder(data: [
    {
      foodItem:"5f408862a0f70d1c21585db7"
      itemCount:1
    },
    {
      foodItem:"5f408862a0f70d1c21585db8"
      itemCount:1
    },
  ]) {
    error
    message
    totalExecutionTime
    savedOrder {
      foodItem {
        itemName
        cusineType
        foodType
        cost
        inventory
      }
      itemCount
    }
  }
}
```