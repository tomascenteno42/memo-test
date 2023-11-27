# Memo Test Api

### Technologies

- Nest JS
- Prisma
- PostgreSQL
- GraphQL

## Considerations

Memo test creation has been simplified. The application will only work with seeded memo tests. And sessions will be created on-demand. A user can have upto 2 session, a started session (in-progress game) and a completed session (completed game with score). This is to avoid creating a form in the front end which i think doesn't provide much benefit to the end user. So with this being said. Addition or removal of images inside a memo test will not exist aswell as the deletion of a MemoTest.

Im treating memo tests as the game itself, and sessions as the user progress over the game.

I'm well aware that there could be improvements regardin performance, there are some n+1 cases that could be fixed with a data-loader but for simplicity are being excluded. Also images could be an entity that can have the url inside as well as an id (currently the id is being taken from the url in the frontend). I could have used services to simplify resolvers.

Another thing that could also be very useful, is to move the data layer to a turborepo package, to share models, responses, args/input types across frontends and backends. But i couldn't get prisma to work as a package.

I had to make a workaround to get the seeder going because it was having issues with the tsconfig. I'm well awared its not optimal too, because it's not running on prisma migration internally and this is a very good feature im not taking advantage.


No unitary tests have been made over the resolvers due to lack of time ):


## How to get things going


### Sync prisma schema with the database
```
npm run db:push
```

### Generate prisma client
```
npm run db:generate
```

### Seed the database
```
npm run db:seed
```

### Run the api

```
npm run dev
```

Open [http://localhost:5002/graphql](http://localhost:5002/graphql) with your browser to see the playground.

### Run prisma studio

```
npx prisma studio
```

