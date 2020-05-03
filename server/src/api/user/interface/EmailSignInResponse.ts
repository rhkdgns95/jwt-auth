import { Field, ObjectType } from "type-graphql";
import { User } from "../../../entity/User";

@ObjectType()
export class EmailSignInResponse {

  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;

  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}