const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');

mongoose.connect(process.env.dbUrl || 'mongodb+srv://kaushikmdeo:kaushik123@frontm.zltir.mongodb.net/frontm?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: async ({ req, res }) => {
        req.queryStartTime = process.hrtime();
        const db = await mongoose.connection;
        return {
          db,
          req
        };
      },
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });