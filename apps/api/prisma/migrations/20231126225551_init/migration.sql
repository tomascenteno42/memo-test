-- CreateEnum
CREATE TYPE "TestSessionState" AS ENUM ('Started', 'Completed');

-- CreateTable
CREATE TABLE "MemoTest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MemoTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestSession" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "memoTestId" INTEGER NOT NULL,
    "retries" INTEGER NOT NULL,
    "numberOfPairs" INTEGER NOT NULL,
    "state" "TestSessionState" NOT NULL,
    "score" INTEGER NOT NULL,
    "cardsMatched" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "TestSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestSession" ADD CONSTRAINT "TestSession_memoTestId_fkey" FOREIGN KEY ("memoTestId") REFERENCES "MemoTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
