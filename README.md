# Node.Js GraphQL API

#### Implemented some basic query operations of entities (Book has one Author and Author has one Address)

<br>

#### Querying of child entites implemented with a help of nested resolvers and DataLoaders.

```js
Query {
    authors: () => {
        ...
        // returns list of authors
    }

    Author: {
        // this is how we tell how to get books written by author
        books: () => {
            ...
        },

        // and get the address of queried author
        address: () => {
            ...
        }
    }
}

```

#### Query example

```graphql
query {
  authors(page: 1) {
    id
    firstName
    lastName
    books {
      id
      title
    }
    address {
      country
      city
      street
      house
    }
  }
}
```

#### Since nested resolvers produce N+1 problem, we are using dataloader to collect keys during the event loop tick and then shoot db once instead of N times

<br>

#### Limitation of dataloaders is amount of data it can handle. If the number of items about 100, it's ok, api response is fine. But for large amount of data (>1k items) response time is very slow.
