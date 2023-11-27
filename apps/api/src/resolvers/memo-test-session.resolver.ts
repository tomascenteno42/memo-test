import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TestSessionState } from '@prisma/client';
import { SessionPayload } from 'src/args/session-payload.args';
import { TakeTurnPayload } from 'src/args/take-turn-payload.args';
import { MemoTest } from 'src/models/MemoTest.model';
import { TestSession } from 'src/models/TestSession.model';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

// For simplicity im not creating individual services for each resolver.
@Resolver(() => TestSession)
export class TestSessionResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => TestSession)
  async session(@Args() { userId, id }: SessionPayload) {
    return this.prismaService.testSession.findFirstOrThrow({
      where: { userId, id },
    });
  }

  @Query(() => [TestSession])
  async userSessions(@Args('userId', { type: () => String }) userId: string) {
    return this.prismaService.testSession.findMany({ where: { userId } });
  }

  @Mutation(() => TestSession)
  async startSession(
    @Args('userId', { type: () => String }) userId: string,
    @Args('memoTestId', { type: () => Int }) memoTestId: number,
  ) {
    const memoTest = await this.prismaService.memoTest.findFirstOrThrow({
      where: { id: memoTestId },
    });

    const startedSession = await this.prismaService.testSession.findFirst({
      where: { memoTestId, userId, state: 'Started' },
    });

    // User has already started session with that test.
    if (startedSession) throw new Error('User has already started a session');

    return this.prismaService.testSession.create({
      data: {
        userId,
        state: TestSessionState.Started,
        retries: 0,
        numberOfPairs: memoTest.images.length,
        memoTestId: memoTest.id,
        score: 0,
      },
    });
  }

  @Mutation(() => TestSession)
  async endSession(@Args() { userId, id }: SessionPayload) {
    const session = await this.prismaService.testSession.findFirst({
      where: { id, userId, state: TestSessionState.Started },
    });

    if (!session) throw new Error("Session can't be finished");

    const score = (session.numberOfPairs / session.retries) * 100;

    const updatedSession = await this.prismaService.testSession.update({
      where: { id },
      data: {
        state: TestSessionState.Completed,
        finishedAt: new Date(),
        score,
      },
    });

    // Eliminate all other sessions that has a lower score than the current one.
    // Only one completed session can exist
    await this.prismaService.testSession.deleteMany({
      where: {
        id: { not: id },
        userId,
        state: TestSessionState.Completed,
        score: { lte: score },
      },
    });

    return updatedSession;
  }

  @Mutation(() => TestSession)
  async takeTurn(@Args() { userId, id, matchedCardId }: TakeTurnPayload) {
    // TODO: FIX TYPE
    const toUpdate: Record<string, unknown> = { retries: { increment: 1 } };

    if (matchedCardId) {
      toUpdate.cardsMatched = { push: matchedCardId };
    }

    return this.prismaService.testSession.update({
      where: { id, userId },
      data: toUpdate,
    });
  }

  // TODO: optimize plss
  // Im not using a data loader. So n+1
  @ResolveField(() => MemoTest)
  async memoTest(@Parent() session: TestSession) {
    return this.prismaService.memoTest.findUnique({
      where: { id: session.memoTestId },
    });
  }
}
