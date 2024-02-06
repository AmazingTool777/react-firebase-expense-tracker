import { Button, Flex, Image } from "@chakra-ui/react";

import googleLogo from "../assets/symbole-google.png";

export type GoogleAuthBtnProps = {
  onClick?(): void;
};

export default function GoogleAuthBtn({ onClick }: GoogleAuthBtnProps) {
  return (
    <Button colorScheme="red" px="1.5rem" onClick={onClick}>
      <Flex alignItems="center" columnGap="0.7rem">
        <Image src={googleLogo} alt="Google" w="1.5rem" />
        <span>Continue with Google</span>
      </Flex>
    </Button>
  );
}
