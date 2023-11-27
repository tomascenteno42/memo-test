import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { MemoTest } from 'src/models/MemoTest.model';
import { PrismaService } from 'src/persistence/prisma/prisma.service';

@Resolver(() => MemoTest)
export class MemoTestResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query(() => [MemoTest])
  async memoTest(@Args('id', { type: () => Int }) id: number) {
    return this.prismaService.memoTest.findUnique({ where: { id } });
  }

  @Query(() => [MemoTest], { description: 'Seeded memo tests' })
  async memoTests() {
    return this.prismaService.memoTest.findMany({});
  }
}
