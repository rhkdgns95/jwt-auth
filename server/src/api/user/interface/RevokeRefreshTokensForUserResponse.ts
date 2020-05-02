import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class RevokeRefreshTokenForUsersResponse {
  
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  error?: string;
}