export enum TestSessionState {
  Started = "Started",
  Completed = "Completed",
}

export class TestSession {
  id: number;

  memoTestId: number;

  retries: number;

  numberOfPairs: number;

  state: TestSessionState;

  score: number;

  cardsMatched?: number[];
}
