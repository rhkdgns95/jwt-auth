import {
	Resolver,
	Query,
	Mutation,
	Arg,
	Ctx,
	UseMiddleware,
} from 'type-graphql';
import { User } from '../../entity/User';
import { hashSync } from 'bcryptjs';
import { EmailSignUpResponse } from './interface/EmailSignUpResponse';
import { EmailSignInResponse } from './interface/EmailSignInResponse';
import { createAccessToken, createRefreshToken } from '../../auth';
import { Context } from '../../types/api';
import { GetMyProfileResponse } from './interface/GetMyProfileResponse';
import { privateResolver } from '../../middlewares/privateResolver';
import { RevokeRefreshTokenForUsersResponse } from './interface/RevokeRefreshTokensForUserResponse';
import { getConnection } from 'typeorm';
import { sendRefreshToken } from '../../sendRefreshToken';

@Resolver(User)
export class UserResolver {
	@Query(() => String)
	async sayHello() {
		return 'hi';
	}

	@Query(() => GetMyProfileResponse)
	@UseMiddleware(privateResolver)
	async getMyProfile(
		@Ctx() { payload }: Context
	): Promise<GetMyProfileResponse> {
		try {
			const userId = payload!.userId;
			const user: User | undefined = await User.findOne({
				where: {
					id: userId,
				},
			});
			if (user) {
				return {
					ok: true,
					error: undefined,
					user,
				};
			} else {
				return {
					ok: false,
					error: 'Not found user',
					user: undefined,
				};
			}
		} catch (error) {
			return {
				ok: false,
				error: error.message,
				user: undefined,
			};
		}
	}

	@Query(() => [User])
	async users(): Promise<Array<User>> {
		try {
			const users = await User.find();
			return users;
		} catch (error) {
			console.log('Query users error: ', error.message);
			return [];
		}
	}

	@Mutation(() => EmailSignInResponse)
	async emailSignIn(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: Context
	): Promise<EmailSignInResponse> {
		try {
			const user: User | undefined = await User.findOne({
				where: {
					email,
				},
			});
			if (user) {
				const isValidPassword: boolean = user.comparePassword(password);
				if (isValidPassword) {
					// Login Success
					const refreshToken = createRefreshToken(user);
					const accessToken = createAccessToken(user);
					res.cookie('jid', refreshToken);
					return {
						ok: true,
						error: undefined,
						token: accessToken,
						user,
					};
				} else {
					return {
						ok: false,
						error: 'Wrong password',
						token: undefined,
						user: undefined,
					};
				}
			} else {
				return {
					ok: false,
					error: 'Not found email',
					token: undefined,
					user: undefined,
				};
			}
		} catch (error) {
			return {
				ok: false,
				error: error.message,
				token: undefined,
				user: undefined,
			};
		}
	}

	@Mutation(() => EmailSignUpResponse)
	async emailSignUp(
		@Arg('email', { validate: true }) email: string,
		@Arg('password') password: string
	): Promise<EmailSignUpResponse> {
		try {
			const hashPassword = hashSync(password, 10);
			const user = await User.create({
				email,
				password: hashPassword,
			}).save();

			return {
				ok: true,
				error: undefined,
				user,
			};
		} catch (error) {
			return {
				ok: false,
				error: error.message,
				user: undefined,
			};
		}
	}

	@Mutation(() => RevokeRefreshTokenForUsersResponse)
	@UseMiddleware(privateResolver)
	async revokeRefreshTokensForUser(
		@Ctx() { payload }: Context
	): Promise<RevokeRefreshTokenForUsersResponse> {
		try {
			await getConnection().getRepository(User).increment(
				{
					id: payload.userId,
				},
				'tokenVersion',
				1
			);
			return {
				ok: true,
				error: undefined,
			};
		} catch (error) {
			return {
				ok: false,
				error: error.message,
			};
		}
	}

	@Mutation(() => Boolean) 
	async logout(@Ctx() {res}: Context): Promise<boolean> {
		sendRefreshToken(res, '');
		return true;
	}
}
