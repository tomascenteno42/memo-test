import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

type Image = {
  download_url: string;
};

function shuffleArray(array: string[]): string[] {
  // Clone the array to avoid modifying the original array
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

async function getCoolImages(): Promise<string[]> {
  const randomPage = faker.number.int({ min: 1, max: 10 });

  const imageApiURI = `https://picsum.photos/v2/list?page=${randomPage}&limit=30`;

  const amountOfImages = faker.number.int({ min: 8, max: 9 });

  const imagesRawResponse = await fetch(imageApiURI);
  const images: Image[] = await imagesRawResponse.json();

  const selectedImages = images.slice(0, amountOfImages);

  return selectedImages.map(({ download_url }) => download_url);
}

function generateCoolName(): string {
  const noun = faker.hacker.noun();
  const adjective = faker.hacker.adjective();
  const verb = faker.hacker.ingverb();

  const coolName = `${noun} ${adjective} ${verb}`;

  return coolName;
}

async function seed(numOfEntries: number) {
  const memoTestData = Array.from({ length: numOfEntries }, async () => {
    const images = await getCoolImages();
    return {
      name: generateCoolName(),
      // paired images
      images: shuffleArray([...images, ...images]),
    };
  });

  const data = await Promise.all(memoTestData);

  await prisma.memoTest.createMany({
    data,
  });
}

seed(5)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
