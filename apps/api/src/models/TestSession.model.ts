import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TestSessionState } from '@prisma/client';

@ObjectType()
export class TestSession {
  @Field(() => Int)
  id: number;

  @Field()
  memoTestId: number;

  @Field()
  retries: number;

  @Field()
  numberOfPairs: number;

  @Field(() => TestSessionState)
  state: TestSessionState;

  @Field(() => Int)
  score: number;

  @Field(() => [Int], { description: 'Cards that user matched (ids)' })
  cardsMatched: number[];
}

registerEnumType(TestSessionState, { name: 'TestSessionState' });
