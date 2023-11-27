# Memo Test web app

### Technologies

- Next
- Apollo client
- Chakra UI


## Considerations
I believe I could improve the organization of the game by separating UI components from the main game logic. This would prevent the scattering of game logic throughout different parts of the application. Additionally, I should have separated the end game screen from the game screen.

Also, utilizing GraphQL codegen would have made the code more concise, improving the Developer Experience (DX) and making the web app type-safe. Integrating a database layer as a package could have been beneficial for the frontend, avoiding potential issues.

I didn't prioritize Server-Side Rendering (SSR), focusing on getting things to work initially.

No animations were added due to time constraints, but incorporating a card-flipping animation would have enhanced the user experience (UX).

Things could have been much more clear from the code perspective haha.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.