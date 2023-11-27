import { gql } from "@apollo/client";

export const INITIAL_QUERY = gql`
  query GetUserSessions($userId: String!) {
    userSessions(userId: $userId) {
      id
      memoTestId
      score
      state
    }
    memoTests {
      id
      name
      images
    }
  }
`;

export const START_SESSION_MUTATION = gql`
  mutation StartSession($userId: String!, $memoTestId: Int!) {
    startSession(userId: $userId, memoTestId: $memoTestId) {
      id
      memoTestId
      state
      score
      memoTest {
        id
        images
      }
    }
  }
`;

export const GET_SESSION_QUERY = gql`
  query Session($userId: String!, $id: Int!) {
    session(userId: $userId, id: $id) {
      id
      state
      score
      cardsMatched
      memoTest {
        id
        name
        images
      }
    }
  }
`;

export const END_GAME_SESSION_MUTATION = gql`
  mutation EndGameSession($userId: String!, $id: Int!) {
    endSession(userId: $userId, id: $id) {
      id
      score
      memoTestId
    }
  }
`;

export const TAKE_TURN_MUTATION = gql`
  mutation TakeTurn($userId: String!, $memoTestId: Int!, $matchedCardId: Int) {
    takeTurn(userId: $userId, id: $memoTestId, matchedCardId: $matchedCardId) {
      id
    }
  }
`;
