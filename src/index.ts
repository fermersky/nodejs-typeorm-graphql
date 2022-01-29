import 'reflect-metadata';
import 'graphql-import-node';
import express from 'express';
import { createConnection } from 'typeorm';
import Author from './entity/author.entity';
import Book from './entity/book.entity';
import resolvers from './resolvers';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import typeDefs from './graphql';
import Address from './entity/address.entity';
import log from './util/logger';
import http from 'http';
import ESClient from './es/es-client';
require('dotenv/config');

(async () => {
  await ESClient.init({});

  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    { server: httpServer, path: '/graphql' }
  );

  const apolloServer = new ApolloServer({
    schema,
    context: (httpContext) => httpContext, // if you want ot use request and response objects in resolver functions
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      } as any,
    ],
  });

  app.use(express.json());
  apolloServer.applyMiddleware({ app });

  app.get('/', (req, res) => {
    res.end('test');
  });

  createConnection().then(async (result) => {
    if (result.isConnected) {
      console.log('📃 typeorm connection successfull');

      // const book = Book.create({title: 'War and Peace', rating: 5, publisher: 'Kniga i Pechat', pagesCount: 1200})
      // await Book.save(book)

      // const address = Address.create({country: 'Ukraine', city: 'Kyiv', street: 'Artema', house: '2'})
      // await Address.save(address)

      // const lev = Author.create({firstName: 'Lev', lastName: 'Tolstoi', books: [book], address})
      // await Author.save(lev)
    }
  });

  httpServer.listen(5812, () => console.log('🚀 server is running on port 5812'));

  process.on('uncaughtException', (err) => {
    log.fatal('Uncaught exception: ', err);
  });
})();
