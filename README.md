# Tutoriel GraphQL

We use in this tutorial, the Star Wars API (http://swapi.co)

## 1. Install
1. Clone https://github.com/sylvainmrs/tuto-graphql in the local server root
2. In Bash, exec "npm install"
2. Go to http://localhost/tuto-graphql

## 2. Types
1. On the main page, add new type "people" and fill the fields in `server/types/People.js`
http://swapi.co/documentation#people
2. For the mass or height fields, don't forget to require GraphQLInt
3. Try the resolve function in the field mass
```
mass: {
   type: GraphQLString,
   resolve: (people) => people.mass + 'kg'
}
```

**TO BE CONTINUED**
