import { useReducer, useState } from "react";
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
import { createLazyFileRoute } from "@tanstack/react-router";
import GoogleAuthBtn from "../components/GoogleAuthBtn";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "@tanstack/react-router";

import { auth, collectionsRefs } from "../firebase";
import useAuthStore from "../stores/auth.store";
import useGoogleSignIn from "../hooks/useGoogleSignIn";
import { addDoc } from "firebase/firestore";

export const Route = createLazyFileRoute("/signup")({
  component: SignupPage,
});

type SignupPageFormFieldsKeys =
  | "fullName"
  | "email"
  | "password"
  | "passwordConfirmation";

type SignupPageFormFields = Record<SignupPageFormFieldsKeys, string>;

type SignupPageFormFieldsErrors = Partial<SignupPageFormFields>;

const initialFormValues: SignupPageFormFields = {
  fullName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

export default function SignupPage() {
  const navigate = useNavigate();

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

  const [isSubmitting, setSubmitting] = useState(false);
  const [fieldsErrors, setFieldsErrors] = useState<SignupPageFormFieldsErrors>(
    {}
  );
  const areFieldsErrors = Object.keys(fieldsErrors).length > 0;
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const [fields, setFields] = useReducer(
    (state: SignupPageFormFields, newState: Partial<SignupPageFormFields>) => ({
      ...state,
      ...newState,
    }),
    initialFormValues
  );

  function handleFieldChange(field: SignupPageFormFieldsKeys) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      areFieldsErrors && setFieldsErrors({});
      setFields({ [field]: e.target.value });
    };
  }

  function validateFormFields(values: SignupPageFormFields): boolean {
    const errors: SignupPageFormFieldsErrors = {};
    if (!values.fullName) {
      errors.fullName = "You must provide your full name";
    }
    if (!values.email) {
      errors.email = "You must provide your e-mail address";
    }
    if (!values.password) {
      errors.password = "You must enter a password";
    }
    if (values.password) {
      if (!values.passwordConfirmation) {
        errors.passwordConfirmation = "You must confirm your password";
      } else if (values.password !== values.passwordConfirmation) {
        errors.passwordConfirmation = "Your password confirmation is wrong";
      }
    }
    setFieldsErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);
    // Validation
    if (!validateFormFields(fields)) return;
    // Data submission
    setSubmitting(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        fields.email,
        fields.password
      );
      setAuthenticated(true, fields.fullName);
      await addDoc(collectionsRefs.users, {
        fullName: fields.fullName,
        accountId: user.uid,
      });
      // To dashboard
      navigate({ to: "/dashboard" });
    } catch (error) {
      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        setFieldsErrors({ email: "The e-mail address is already taken" });
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
        Sign up
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
            <FormControl isInvalid={!!fieldsErrors.fullName}>
              <FormLabel>Full name</FormLabel>
              <Input
                value={fields.fullName}
                disabled={isSubmitting}
                onChange={handleFieldChange("fullName")}
              />
              {fieldsErrors.fullName && (
                <FormErrorMessage>{fieldsErrors.fullName}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!fieldsErrors.email}>
              <FormLabel>E-mail address</FormLabel>
              <Input
                type="email"
                value={fields.email}
                disabled={isSubmitting}
                onChange={handleFieldChange("email")}
              />
              {fieldsErrors.email && (
                <FormErrorMessage>{fieldsErrors.email}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!fieldsErrors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={fields.password}
                disabled={isSubmitting}
                onChange={handleFieldChange("password")}
              />
              {fieldsErrors.password && (
                <FormErrorMessage>{fieldsErrors.password}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!fieldsErrors.passwordConfirmation}>
              <FormLabel>Password confirmation</FormLabel>
              <Input
                type="password"
                value={fields.passwordConfirmation}
                disabled={isSubmitting}
                onChange={handleFieldChange("passwordConfirmation")}
              />
              {fieldsErrors.passwordConfirmation && (
                <FormErrorMessage>
                  {fieldsErrors.passwordConfirmation}
                </FormErrorMessage>
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
