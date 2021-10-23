# Words Web API with GraphQL

A Web API for the words project built with `node`, `express`, `graphql-js` and `mongodb`.

## Example queries:

Query for a paginated list:

```graphql
{
  words(page:1, itemsPerPage: 20, tags: ["swedish"]) {
    total
    items {
      id
      value
      createdDate
      updatedDate
      tags
    }
  }
}

```graphql

Query for a single word:

```graphql
{
  word(key:"5c82fee9062cd50f5615736b") {
    value
    translations
  }
}
```

Adding a new word:

```
mutation {
  SaveWord(input: { value: "hej", translations: ["hello"], tags: ["swedish"]}) {
    id
    value
    createdDate
  }
}
```

Updating an existing word:

```graphql
mutation {
  SaveWord(input: { id: "5c8307150f2cac142a3901bb", value: "hej hej", translations: ["Hello hello"], tags: ["swedish"]}) {
    id
    value
    createdDate
    updatedDate
  }
}
```

Grab all words:
```graphql
{
  words(page: 0, itemsPerPage: 1000){
    total
    items {
      id
      value
      createdDate
      updatedDate
      translations
      explanations
      usages
      tags
    }
  }
}
```