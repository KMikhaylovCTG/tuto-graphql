# Tutoriel GraphQL

We use in this tutorial, the Star Wars API (http://swapi.co)

## 1. Install
* Clone https://github.com/sylvainmrs/tuto-graphql in the local server root
* In Bash, exec "npm install"
* Go to http://localhost/tuto-graphql

## 2. Types
* On the main page, add new type "people" and fill the fields in `server/types/People.js`
http://swapi.co/documentation#people
* For the mass or height fields, don't forget to require GraphQLInt
* Try the resolve function in the field mass
```
 mass: {
    type: GraphQLString,
    resolve: (people) => people.mass + 'kg'
 }
```
* Add the Starships type, and select a few fields like name or model
http://swapi.co/documentation#starships
* Add in the same file StarshipsListType
```
const StarshipsListType = new GraphQLObjectType({
   name: 'StarshipsList',
   fields: () => ({
       starshipsItem: {
           type: new GraphQLList(StarshipsType),
           resolve: (starships) =>
               starships.map(starship =>
                   fetchByUrl(starship.url)
               )
       }
   })
});
```
* Then, add the starshipsList query
```
starshipsList: {
   type: StarshipsListType,
   args: {
       page: {type: GraphQLInt}
   },
   resolve: (root, args) => fetchByPage(BASE_URL, args.page)
}
```
* In `types/People.js`, in the PeopleType, add a starshipsConnection field
```
fields: () => {
   const StarshipsType = require('./Starships').item;
   return {
       ...
       starshipsConnection: {
           type: new GraphQLList(StarshipsType),
           resolve: (people) =>
               people.starships.map(starshipUrl =>
                   fetchByUrl(starshipUrl)
               )
       }
   };
}
```
* In the same file, create the PeopleListType...
```
const PeopleListType = new GraphQLObjectType({
   name: 'PeopleList',
   description: '...',
   fields: () => ({
       peopleItem: {
           type: new GraphQLList(PeopleType),
           resolve: (people, args) =>
               people.map(person =>
                   fetchByUrl(person.url)
               )
       }
   })
});
```
* ... and peopleList query
```
peopleList: {
   type: PeopleListType,
   args: {
       page: {type: GraphQLInt},
   },
   resolve: (root, args) => fetchByPage(BASE_URL, args.page)
}
```
* To make things more fun, let's create a PilotsConnection field in StarshipsType
```
fields: () => {
   const PeopleType = require('./People').item;
   return {
       url: {type: GraphQLString},
       name: {type: GraphQLString},
       manufacturer: {type: GraphQLString},
       model: {type: GraphQLString},
       pilotsConnection: {
           type: new GraphQLList(PeopleType),
           resolve: (starships) =>
               starships.pilots.map(pilotUrl =>
                   fetchByUrl(pilotUrl)
               )
       }
   };
}
```
* Try this GraphQL request in GraphIQL IDE. Notice that we fetch multiple times some URLs
```
{
  peopleList {
	peopleItem {
      name
  	gender
  	mass
  	starshipsConnection {
        name
        manufacturer
        model
        pilotsConnection {
          name
          gender
          mass
        }
      }
    }
  }
}
```
* Add a dataloader to `types/Starships.js`
```
const DataLoader = require('dataloader');
loader: new DataLoader(
   keys => Promise.all(keys.map(fetchByUrl))
)
```
* In the item query, replace fetchByUrl by dataloader
```
starships: {
   type: StarshipsType,
   args: {
       id: {type: GraphQLString}
   },
   resolve: (root, args, {loaders}) =>
       loaders.starships.load(`${BASE_URL}/${args.id}/`)
}
```
* In the list query, change starshipsItem resolve functionDans with the dataloder
```
starshipsItem: {
   type: new GraphQLList(StarshipsType),
   resolve: (starships, args, {loaders}) =>
       loaders.starships.loadMany(
           starships.map(starship => starship.url)
       )
}
```
* In `types/People.js` change starshipsConnection resolve function with dataloder. Execute the previous complex query, and notice that starships are loaded just once
```
starshipsConnection: {
   type: new GraphQLList(StarshipsType),
   resolve: (people, args, {loaders}) =>
       loaders.starships.loadMany(people.starships)
}
```
* Do the same DataLoader things with People types. Execute the query again, and then notice that all elements are loaded once

**TO BE CONTINUED**

