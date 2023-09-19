import { Button, HStack, useColorModeValue } from "@chakra-ui/react";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

const NoUserNavbar = () => {
  return (
    <Fragment>
      <HStack gap={3}>
        <Button
          as={NavLink}
          to="/login"
          color="white"
          bgColor={useColorModeValue("purple.400", "teal.500")}
          _hover={{
            bgColor: useColorModeValue("purple.300", "teal.400"),
          }}
        >
          Login
        </Button>
        <Button
          as={NavLink}
          to="/signup"
          color="white"
          bgColor={useColorModeValue("purple.400", "teal.500")}
          _hover={{
            bgColor: useColorModeValue("purple.300", "teal.400"),
          }}
        >
          Sign Up
        </Button>
      </HStack>
    </Fragment>
  );
};
export default NoUserNavbar;
