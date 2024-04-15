import React, { useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import GoogleAuthBtn from "../components/GoogleAuthBtn";
import { auth } from "../firebase";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import useAuthStore from "../stores/auth.store";

type FieldsErrors = Record<"email" | "password", string | null>;

export default function SignInPage() {
  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setSubmitting] = useState(false);
  const [fieldsErrors, setFieldsErrors] = useState<FieldsErrors>({
    email: null,
    password: null,
  });
  const [errorMessage, setErrorMessage] = useState("");

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) {
    setter(e.target.value);
    setFieldsErrors({ email: null, password: null });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    // Validation
    if (!email || !password) {
      const errors: FieldsErrors = {
        email: null,
        password: null,
      };
      if (!email) {
        errors.email = "The e-mail address is required";
      }
      if (!password) {
        errors.password = "The password is required";
      }
      setFieldsErrors(errors);
      return;
    }
    // Data submission
    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, email, password);
      setAuthenticated(true);
      navigate({ to: "/dashboard" });
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        [
          "auth/invalid-credential",
          "auth/user-not-found",
          "auth/wrong-password",
        ].includes(error.code)
      ) {
        setFieldsErrors({ email: "", password: "" });
        setErrorMessage("Wrong credentials. Try again.");
      } else {
        setErrorMessage("An unexpected error happened. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const { handleGoogleSignIn } = useGoogleSignIn();

  return (
    <div>
      <Heading as="h1" size="xl" mb="1.5rem">
        Sign in
      </Heading>
      <form onSubmit={handleSubmit}>
        <Card py="1rem" px="1rem">
          {errorMessage && (
            <Alert status="error" mb="1.5rem">
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <Flex direction="column" rowGap="1rem">
            <FormControl isInvalid={fieldsErrors.email !== null}>
              <FormLabel>E-mail address</FormLabel>
              <Input
                type="email"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange(e, setEmail)}
              />
              {fieldsErrors.email && (
                <FormErrorMessage>{fieldsErrors.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={fieldsErrors.password !== null}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                disabled={isSubmitting}
                onChange={(e) => handleInputChange(e, setPassword)}
              />
              {fieldsErrors.password && (
                <FormErrorMessage>{fieldsErrors.password}</FormErrorMessage>
              )}
            </FormControl>
            <Grid mt="0.5rem">
              <Button
                isLoading={isSubmitting}
                loadingText="Submitting"
                disabled={isSubmitting}
                type="submit"
                colorScheme="teal"
              >
                Submit
              </Button>
            </Grid>
          </Flex>
        </Card>
        <Flex justifyContent="center" my="1rem">
          OR
        </Flex>
        <Flex justifyContent="center">
          <GoogleAuthBtn disabled={isSubmitting} onClick={handleGoogleSignIn} />
        </Flex>
      </form>
    </div>
  );
}
