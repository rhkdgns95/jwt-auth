import { Resolver, Query } from 'type-graphql';
import { User } from '../../entity/User';

@Resolver(User)
export class UserResolver {
	@Query(() => String)
	async sayHello(): Promise<string> {
		return 'hello';
	}
}
