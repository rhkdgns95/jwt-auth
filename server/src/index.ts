import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchemaSync } from 'type-graphql';
import express from 'express';
import { UserResolver } from './api/user/UserResolver';
import { Context } from './types/api';

(async () => {
	const app = express();

	app.get('/', (_req, res) => res.send('hello'));
	
	const schema = buildSchemaSync({
		resolvers: [UserResolver],
		validate: true
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }: Context) => ({ req, res }),
	});

	apolloServer.applyMiddleware({ app });

	createConnection()
		.then(async () => {
			await app.listen(4000, () => {
				console.log('Server is running to : ', 4000);
			});
		})
		.catch((error) => {
			console.log('DB Connection error: ', error);
		});
})();

// createConnection()
// 	.then(async () => {
// 		console.log('Inserting a new user into the database...');
// 		const user = new User();
// 		user.firstName = 'Timber';
// 		user.lastName = 'Saw';
// 		user.age = 25;
// 		console.log('Saved a new user with id: ' + user.id);

// 		console.log('Loading users from the database...');
// 		console.log('Here you can setup and run express/koa/any other framework.');
// 	);
// 	.catch((error) => console.log(error));
