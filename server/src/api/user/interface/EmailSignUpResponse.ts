import { ObjectType, Field } from 'type-graphql';
import { User } from '../../../entity/User';

@ObjectType()
export class EmailSignUpResponse{
	@Field(() => Boolean)
	ok: boolean;

	@Field(() => String, { nullable: true })
	error?: string;

  @Field(() => User, { nullable: true })
	user?: User;
}
