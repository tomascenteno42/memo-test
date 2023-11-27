import { Card, CardBody, Center, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import { MemoTestCardState } from "./memo-test-grid";

type MemoTestCardProps = {
  idx: number;
  url: string;
  onClick: (idx: number) => void;
  state: MemoTestCardState;
};

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 250;

export const MemoTestCard: FC<MemoTestCardProps> = ({
  idx,
  url,
  onClick,
  state,
}) => {
  const isHidden = state === MemoTestCardState.Hidden;

  const imageDisplay = isHidden ? "none" : undefined;

  return (
    <Card
      w={IMAGE_WIDTH}
      h={IMAGE_HEIGHT}
      _hover={
        isHidden && {
          opacity: 0.8,
          cursor: "pointer",
        }
      }
      onClick={() => isHidden && onClick(idx)}
    >
      <CardBody p={1} bg="accent">
        <Image
          w={IMAGE_WIDTH}
          h={IMAGE_HEIGHT}
          src={url}
          alt="alt for url"
          borderRadius="lg"
          draggable={false}
          display={imageDisplay}
        />
        {isHidden && (
          <Center h={"full"}>
            <Text fontWeight={"bold"}>{idx + 1}</Text>
          </Center>
        )}
      </CardBody>
    </Card>
  );
};
