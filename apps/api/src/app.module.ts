import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchemaForEnv } from './config/environment-variables';
import { PersistenceModule } from './persistence/persistence.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TestSessionResolver } from './resolvers/memo-test-session.resolver';
import { MemoTestResolver } from './resolvers/memo-test.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchemaForEnv,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Schema generated on the fly (code-first approach)
      autoSchemaFile: true,
    }),
    PersistenceModule,
  ],
  controllers: [],
  providers: [TestSessionResolver, MemoTestResolver],
})
export class AppModule {}
