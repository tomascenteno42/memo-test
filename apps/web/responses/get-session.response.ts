import { MemoTest } from "../models/memo-test";
import { TestSession, TestSessionState } from "../models/test-session";

export type GetSessionResponse = {
  session?: Pick<TestSession, "id" | "score" | "state" | "cardsMatched"> & {
    memoTest: MemoTest;
  };
};
