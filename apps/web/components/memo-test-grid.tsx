import { FC, useCallback, useState } from "react";
import { MemoTestCard } from "./memo-test-card";
import { Center, SimpleGrid } from "@chakra-ui/react";

const MATCH_INTERACTION_DELAY_MS = 300;

export enum MemoTestCardState {
  Hidden,
  Selected,
  Matched,
}

type MemoTestGridProps = {
  images: { id: number; url: string; matched: boolean }[];
  onGameOver: () => void;
  takeTurn: (matchedCardId?: number) => void;
};

function generateInitialState(
  images: MemoTestGridProps["images"]
): Record<number, MemoTestCardState> {
  return images
    .map(({ matched }, idx) => [
      idx,
      matched ? MemoTestCardState.Matched : MemoTestCardState.Hidden,
    ])
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key as unknown as string]: value }),
      {} as Record<number, MemoTestCardState>
    );
}

export const MemoTestGrid: FC<MemoTestGridProps> = ({
  images,
  onGameOver,
  takeTurn,
}) => {
  const [cards, setCards] = useState<Record<number, MemoTestCardState>>(
    generateInitialState(images)
  );

  // Hides the card after MATCH_INTERACTION_DELAY_MS
  const resetMismatchedCards = useCallback(
    (firstIndex: number, secondIndex: number) => {
      const timeout = setTimeout(() => {
        cards[firstIndex] = MemoTestCardState.Hidden;
        cards[secondIndex] = MemoTestCardState.Hidden;
        setCards(cards);
      }, MATCH_INTERACTION_DELAY_MS);

      return () => clearTimeout(timeout);
    },
    [cards]
  );

  // Main game logic
  const onCardClick = useCallback(
    (idx: number) => {
      const amountOfSelectedCards = Object.values(cards).filter(
        (state) => state === MemoTestCardState.Selected
      ).length;

      // User is trying to select more than 2 cards
      if (amountOfSelectedCards >= 2) return;

      let newCards = { ...cards, [idx]: MemoTestCardState.Selected };

      // User is selecting the first card
      if (amountOfSelectedCards === 0) {
        setCards(newCards);
      } else {
        // User is selecting the second card
        const selectedCardsIdxs = Object.entries(newCards)
          .filter(([_key, state]) => state === MemoTestCardState.Selected)
          .map(([key]) => Number(key));

        const [firstImageIdx, secondImageIdx] = selectedCardsIdxs;
        const [firstImageId, secondImageId] = selectedCardsIdxs.map(
          (selectedIdx) => images[selectedIdx].id
        );

        // MATCH!
        const itsAMatch = firstImageId === secondImageId;

        newCards[firstImageIdx] = newCards[secondImageIdx] =
          MemoTestCardState.Selected;

        if (itsAMatch) {
          newCards[firstImageIdx] = newCards[secondImageIdx] =
            MemoTestCardState.Matched;
          setCards(newCards);
        } else {
          setCards(newCards);
          // If not a match, update the state and schedule a delayed update
          resetMismatchedCards(firstImageIdx, secondImageIdx);
        }

        // Save retry and save the matched card id if its a match
        takeTurn(itsAMatch ? firstImageId : undefined);

        // Check for game completion
        const matchedCount = Object.values(newCards).filter(
          (state) => state === MemoTestCardState.Matched
        ).length;

        // Last 2 cards have been selected
        if (itsAMatch && matchedCount === images.length) {
          onGameOver();
        }
      }
    },
    [cards, takeTurn, images, resetMismatchedCards, onGameOver]
  );

  return (
    <Center w="full" h="full" bg="background">
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 6 }}
        spacing={4}
        justifyItems="center"
        justifyContent="center"
      >
        {images?.map(({ url, matched }, idx) => (
          <MemoTestCard
            key={idx}
            url={url}
            idx={idx}
            // Has been matched already
            state={matched ? MemoTestCardState.Matched : cards[idx]}
            onClick={() => onCardClick(idx)}
          />
        ))}
      </SimpleGrid>
    </Center>
  );
};
