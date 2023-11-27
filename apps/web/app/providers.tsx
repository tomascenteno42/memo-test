"use client";

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";

const client = new ApolloClient({
  uri: "http://localhost:5002/graphql",
  cache: new InMemoryCache(),
});

const theme = extendTheme({
  colors: {
    primary: "#6C63FF", // Soft Purple
    secondary: "#F3EFEF", // Light Grey
    background: "#1A1A1A", // Dark Grey
    text: "#FFFFFF", // White
    accent: "#FFB400", // Gold/Yellow
  },
});

export default function Providers({ children }) {
  return (
    <ApolloProvider client={client}>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </ApolloProvider>
  );
}
