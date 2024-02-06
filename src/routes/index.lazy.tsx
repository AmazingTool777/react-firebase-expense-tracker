import React, { useState } from "react";
import {
  Button,
  Card,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
} from "@chakra-ui/react";
import { createLazyFileRoute } from "@tanstack/react-router";

import GoogleAuthBtn from "../components/GoogleAuthBtn";

export const Route = createLazyFileRoute("/")({
  component: SignInPage,
});

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) {
    setter(e.target.value);
  }

  return (
    <div>
      <Heading as="h1" size="xl" mb="1.5rem">
        Sign in
      </Heading>
      <form>
        <Card py="1rem" px="1rem">
          <Flex direction="column" rowGap="1rem">
            <FormControl>
              <FormLabel>E-mail address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e, setEmail)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => handleInputChange(e, setPassword)}
              />
            </FormControl>
            <Grid mt="0.5rem">
              <Button type="submit" colorScheme="teal">
                Submit
              </Button>
            </Grid>
          </Flex>
        </Card>
        <Flex justifyContent="center" my="1rem">
          OR
        </Flex>
        <Flex justifyContent="center">
          <GoogleAuthBtn />
        </Flex>
      </form>
    </div>
  );
}
