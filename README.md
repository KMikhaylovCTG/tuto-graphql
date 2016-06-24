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

## 3. Fragments
* Start with a simple fragment on People, apply it with PeopleList > PeoleItem and Starships > pilotsConnection
```
fragment PeopleFragment on People {
  url
  name
  gender
  mass
}
```
* Create another simple fragment on Starships, apply it on People > starshipsConnection
```
fragment StarshipsFragment on Starships {
  name
  manufacturer
  model
}
```
* Complete this fragment by including pilotsConnection field
```
fragment StarshipsFragment on Starships {
  name
  manufacturer
  model
  pilotsConnection {
    ...PeopleFragment
  }
}
```
* Just an example of named queries, or multiple request in one
```
query MaRequete {
    Luke: people(id: "1") {
        name
    },
    C3PO: people(id: "2") {
        name
    }
}

query MaRequete2 {
    people(id: "1") {
        name
    }
}
```

## 4. React & Relay
* Create `react/src/People.js`React class, expecting a people prop with all caracter data
```
var People = React.createClass({
   render: function () {
       var {people} = this.props;
       return (
           <li>
               <a href={people.url} target="_blank">
                   {people.name}
               </a>
               <ul>
                   <li>{people.gender}</li>
                   <li>{people.mass}</li>
               </ul>
           </li>
       );
   }
});
```
* In the same file, create the Relay container with a fragment containing the necessary People information
```
People = Relay.createContainer(People, {
   fragments: {
       people: () => Relay.QL`
         fragment on People {
             url
             name
             gender
             mass
         }
       `
   }
});
```
* Create the `react/src/Page.js` React class containing People list
```
var Page = React.createClass({
   render: function () {
       var people = this.props.people.peopleItem.map(
           (person, i) =>
           (<People people={person} key={'person' + i}/>)
       );
       return (
           <ul>
               {people}
           </ul>
       );
   }
});
```
* In the same file, create a Relay container with a PeopleList fragment
```
Page = Relay.createContainer(Page, {
   fragments: {
       people: () => Relay.QL`
           fragment on PeopleList {
               peopleItem {
                   ${People.getFragment('people')}
               }
           }
       `
   }
});
```
* Finally, Relay need a list of all queries
```
var pageRoute = {
   queries: {
       people: (Component) => Relay.QL`
           query PeopleQuery {
               peopleList {
                   ${Component.getFragment('people')}
               }
           }
       `
   },
   name: 'pageRoute',
   params: {}
};
```
*  gulp schema
* gulp lib
* Create `react/src/Starships.js` React class expecting a starships prop with all starship data
```
var Starships = React.createClass({
   render: function () {
       var {starships} = this.props;
       return(
           <li>
               <a href={starships.url}>
                   {starships.name}
               </a>
               <ul>
                   <li>{starships.model}</li>
                   <li>{starships.manufacturer}</li>
               </ul>
           </li>
       );
   }
});
```
* In the same file, create a Relay container with a fragment containing the necessary Starships information
```
Starships = Relay.createContainer(Starships, {
   fragments: {
       starships: () => Relay.QL`
           fragment on Starships {
             url
             name
             model
             manufacturer
           }
       `
   }
});
```
* In the People Relay container, add starphipsConnection fragment
```
starshipsConnection {
 ${Starships.getFragment('starships')}
}
```
* In the People React class, add starships
```
var starships = people.starshipsConnection.map(
   (starship, i) => 
      (<Starships starships={starship} key={'starship' + i}/>)
);

<ul>
   {starships}
</ul>
```
* Change pageRoute to add pageID variable
```
var pageRoute = {
   queries: {
       people: (Component) => Relay.QL`
           query PeopleQuery {
               peopleList(page: $pageID) {
                   ${Component.getFragment('people')}
               }
           }
       `
   },
   name: 'pageRoute',
   params: {
       pageID: 1
   }
};
```
* Have some fun, and add the homeworld (Planets) field in People Type
