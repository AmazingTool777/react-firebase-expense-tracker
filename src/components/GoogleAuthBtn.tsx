import { Button, Flex, Image } from "@chakra-ui/react";

import googleLogo from "../assets/symbole-google.png";

export type GoogleAuthBtnProps = {
  disabled?: boolean;
  onClick?(): void;
};

export default function GoogleAuthBtn({
  disabled,
  onClick,
}: GoogleAuthBtnProps) {
  return (
    <Button disabled={disabled} colorScheme="red" px="1.5rem" onClick={onClick}>
      <Flex alignItems="center" columnGap="0.7rem">
        <Image src={googleLogo} alt="Google" w="1.5rem" />
        <span>Continue with Google</span>
      </Flex>
    </Button>
  );
}
