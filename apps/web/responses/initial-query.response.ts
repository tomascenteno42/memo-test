import { MemoTest } from "../models/memo-test";
import { TestSession } from "../models/test-session";

export type InitialQueryResponse = {
  memoTests: MemoTest[];
  userSessions: TestSession[];
};
