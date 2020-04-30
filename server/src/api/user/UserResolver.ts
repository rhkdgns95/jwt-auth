import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
import { hashSync } from 'bcryptjs';
import { EmailSignUpResponse } from './EmailSignUpResponse';
import { EmailSignInResponse } from './EmailSignInResponse';

@Resolver(User)
export class UserResolver {
	@Query(() => String)
	async sayHello() {
		return 'hi';
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
	async EmailSignIn(
		@Arg('email') email: string,
		@Arg('password') password: string
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
					return {
						ok: true,
						error: undefined,
						token: 'coming soon',
					};
				} else {
					return {
						ok: false,
						error: 'Wrong password',
						token: undefined,
					};
				}
			} else {
				return {
					ok: false,
					error: 'Not found email',
					token: undefined,
				};
			}
		} catch (error) {
			return {
				ok: false,
				error: error.message,
				token: undefined,
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
}
