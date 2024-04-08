import { type PropsWithChildren } from "react";

import Providers from "./Providers";
import { RootLayout } from "./routes/__root";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppWithoutRouter({ children }: PropsWithChildren) {
  return (
    <Providers>
      <RootLayout>{children}</RootLayout>
    </Providers>
  );
}

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
