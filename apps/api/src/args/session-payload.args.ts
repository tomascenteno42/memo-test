import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SessionPayload {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  userId: string;
}
