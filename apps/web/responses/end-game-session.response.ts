import { TestSession } from "../models/test-session";

export type EndGameSessionResponse = {
  endSession: Pick<TestSession, "id" | "score" | "memoTestId">;
};
