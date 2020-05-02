import 'reflect-metadata';
import 'dotenv/config';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { buildSchemaSync } from 'type-graphql';
import express from 'express';
import { UserResolver } from './api/user/UserResolver';
import { Context, Payload } from './types/api';
import cookieParser from 'cookie-parser';
import { verify } from 'jsonwebtoken';
import { createRefreshToken, createAccessToken } from './auth';
import { User } from './entity/User';
import { sendRefreshToken } from './sendRefreshToken';

(async () => {
	const app = express();

	app.get('/', (_req, res) => res.send('hello'));
	// refreshToken을 새로 발급받기 (진행해야함).
	app.use('/refresh_token', cookieParser());
	app.get('/refresh_token', async (req, res) => {
		// refreshToken이 존재해야함.
		console.log('res.cookie: ', req.cookies.jid);
		const token: string | undefined = req.cookies.jid;
		if (token) {
			try {
				const payload: Payload | object = verify(
					token,
					process.env.JWT_REFRESH_SECRET || ''
				) as Payload | object;
				if (payload && 'userId' in payload && 'tokenVersion' in payload) {
					const user: User | undefined = await User.findOne({
						where: {
							id: payload.userId,
						},
					});
					if (user && payload.tokenVersion === user.tokenVersion) {
						/**
						 *  tokenVersion:
						 *  - 토큰의 버전관리.
						 *  - 로그아웃 시 tokenVersion 변경됨.
						 */
						const refreshToken = createRefreshToken(user);
						sendRefreshToken(res, refreshToken);
						const accessToken = createAccessToken(user);
						return res.send({
							ok: true,
							error: undefined,
							accessToken,
						});
					} else {
						return res.send({
							ok: false,
							error: 'No user OR Wrong tokenVersion',
							accessToken: undefined,
						});
					}
				} else {
					return res.send({
						ok: false,
						error: 'Wrong payload',
						accessToken: undefined,
					});
				}
			} catch (error) {
				return res.send({
					ok: false,
					error: error.message,
					accessToken: undefined,
				});
			}
		} else {
			return res.send({
				ok: false,
				error: 'No authenticated',
				accessToken: undefined,
			});
		}
	});

	const schema = buildSchemaSync({
		resolvers: [UserResolver],
		validate: true,
	});

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res, payload }: Context) => ({ req, res, payload }),
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
