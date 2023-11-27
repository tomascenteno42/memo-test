import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MemoTest {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [String])
  images?: string[];
}
