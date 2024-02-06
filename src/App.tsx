import { type PropsWithChildren } from "react";

import AppBar from "./components/AppBar";
import { Box, Container } from "@chakra-ui/react";

function App({ children }: PropsWithChildren) {
  return (
    <Box bgColor="gray.200" minH="100vh">
      <AppBar />
      <Container mt="1.5rem">{children}</Container>
    </Box>
  );
}

export default App;
