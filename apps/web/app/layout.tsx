"use client";

import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ height: "100vh", width: "100%" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
