"use client";

import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { FC, useCallback } from "react";
import {
  END_GAME_SESSION_MUTATION,
  GET_SESSION_QUERY,
  TAKE_TURN_MUTATION,
} from "../../queries";
import { useUserId } from "../../hooks/user-id";
import { MemoTestGrid } from "../../components/memo-test-grid";
import { GetSessionResponse } from "../../responses/get-session.response";
import { EndGameSessionResponse } from "../../responses/end-game-session.response";
import { TestSession, TestSessionState } from "../../models/test-session";

// TODO: Refactor to separate screen or separate component
type EndGameComponentProps = {
  score: number;
};

const EndGameComponent: FC<EndGameComponentProps> = ({ score }) => {
  const router = useRouter();

  return (
    <Center bg="background" h="full">
      <VStack spacing={10}>
        <Text color="accent">Final score: {score}</Text>
        <Button
          bg="primary"
          color="background"
          onClick={() => router.push("/")}
        >
          Home
        </Button>
      </VStack>
    </Center>
  );
};

export default function Game() {
  const client = useApolloClient();

  const searchParams = useSearchParams();

  const sessionId = Number(searchParams.get("sessionId"));

  const userId = useUserId();
  const { data, loading, error } = useQuery<GetSessionResponse>(
    GET_SESSION_QUERY,
    {
      variables: {
        id: sessionId,
        userId,
      },
      skip: !userId || !sessionId,
    }
  );

  const [endGame, endGameResponse] = useMutation<EndGameSessionResponse>(
    END_GAME_SESSION_MUTATION
  );

  const [takeTurnMutation] = useMutation<{
    session: Pick<TestSession, "id">;
  }>(TAKE_TURN_MUTATION);

  const onGameOver = useCallback(async () => {
    endGame({ variables: { userId, id: data.session.id } }).then((response) => {
      client.writeQuery({
        query: GET_SESSION_QUERY,
        data: {
          session: {
            ...data?.session,
            __typename: "TestSession",
            id: data.session.id,
            state: TestSessionState.Completed,
            score: response?.data?.endSession?.score,
          },
        },
        variables: {
          userId,
          memoTestId: response?.data?.endSession?.memoTestId,
        },
      });
    });
  }, [client, data?.session, endGame, userId]);

  const takeTurn = useCallback(
    (matchedCardId?: number) => {
      takeTurnMutation({
        variables: { userId, memoTestId: data?.session.id, matchedCardId },
      });
    },
    [data?.session.id, takeTurnMutation, userId]
  );

  // User manually altering url
  if (!sessionId) return "Please provide a session id!";

  // User manually entered through url or refreshed the screen
  if (data?.session?.state === TestSessionState.Completed) {
    return <EndGameComponent score={data?.session?.score} />;
  }

  return loading ? (
    <Spinner />
  ) : error ? (
    // TODO: Refactor to proper error handling
    error.message
  ) : data ? (
    <Center h="full">
      {/* User completed the game */}
      {endGameResponse?.data?.endSession?.score && (
        <EndGameComponent score={endGameResponse?.data?.endSession.score} />
      )}
      <MemoTestGrid
        images={data?.session?.memoTest?.images.map((url) => {
          // Get id from URL
          // This should be provided from the backend. Bad db desing decision ):
          const imageId = Number(url.match(/\/id\/(\d+)\//)[1]);
          return {
            id: imageId,
            url,
            matched: data?.session?.cardsMatched.includes(imageId),
          };
        })}
        onGameOver={onGameOver}
        takeTurn={takeTurn}
      />
    </Center>
  ) : null;
}
