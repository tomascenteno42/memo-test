import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SessionPayload } from './session-payload.args';

@ArgsType()
export class TakeTurnPayload extends SessionPayload {
  @Field(() => Int, { nullable: true })
  matchedCardId?: number;
}
