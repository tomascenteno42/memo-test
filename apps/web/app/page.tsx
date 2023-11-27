"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  HStack,
  Heading,
  Spinner,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import { INITIAL_QUERY, START_SESSION_MUTATION } from "../queries";
import { useUserId } from "../hooks/user-id";
import { TestSessionState } from "../models/test-session";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { InitialQueryResponse } from "../responses/initial-query.response";
import { StartSessionResponse } from "../responses/start-session.response";

export default function Page() {
  const client = useApolloClient();

  const router = useRouter();
  const userId = useUserId();

  const { loading, error, data } = useQuery<InitialQueryResponse>(
    INITIAL_QUERY,
    { variables: { userId }, skip: !userId }
  );

  const [startSessionMutation] = useMutation<StartSessionResponse>(
    START_SESSION_MUTATION
  );

  const getSessionsForMemoTest = useCallback(
    (id: number) => {
      const sessions = data?.userSessions.filter(
        ({ memoTestId }) => memoTestId === id
      );

      if (sessions.length === 0) return null;

      const startedSession = sessions.find(
        ({ state }) => state === TestSessionState.Started
      );
      const completedSession = sessions.find(
        ({ state }) => state === TestSessionState.Completed
      );

      return { startedSession, completedSession };
    },
    [data?.userSessions]
  );

  const startGame = useCallback(
    (memoTestId: number) => {
      startSessionMutation({ variables: { userId, memoTestId } }).then(
        (response) => {
          client.writeQuery({
            query: INITIAL_QUERY,
            data: {
              ...data,
              userSessions: [...data.userSessions, response.data.startSession],
            },
            variables: {
              userId,
            },
          });

          router.push(`/game?sessionId=${response.data.startSession.id}`);
        }
      );
    },
    [client, data, router, startSessionMutation, userId]
  );

  const continueGame = useCallback(
    (sessionId: number) => {
      router.push(`/game?sessionId=${sessionId}`);
    },
    [router]
  );

  if (loading)
    return (
      <Center bg={"background"} h="100%">
        <Spinner color="accent" />
      </Center>
    );
  if (error) return <p>Error : {error.message}</p>;
  if (!data) return null;

  return (
    <Center bg={"background"} h="100%">
      <VStack>
        <Card bg="primary" w="1000px">
          <CardHeader>
            <Heading size="md">Memo Test available games</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider borderColor={"black"} />} spacing="4">
              {data?.memoTests &&
                data?.memoTests.map(({ id, name }) => {
                  return (
                    <HStack justifyContent={"space-between"} key={id}>
                      <VStack>
                        <Heading size="xs" textTransform="uppercase">
                          {name}
                        </Heading>
                        {getSessionsForMemoTest(id)?.completedSession && (
                          <Text alignSelf={"start"}>
                            Highest score:{" "}
                            {getSessionsForMemoTest(id)?.completedSession.score}
                          </Text>
                        )}
                      </VStack>
                      {getSessionsForMemoTest(id)?.startedSession ? (
                        <Button
                          bg="background"
                          color="text"
                          onClick={() =>
                            continueGame(
                              getSessionsForMemoTest(id)?.startedSession.id
                            )
                          }
                        >
                          Continue game
                        </Button>
                      ) : (
                        <Button bg="accent" onClick={() => startGame(id)}>
                          Start game
                        </Button>
                      )}
                    </HStack>
                  );
                })}
            </Stack>
          </CardBody>
        </Card>
      </VStack>
    </Center>
  );
}
