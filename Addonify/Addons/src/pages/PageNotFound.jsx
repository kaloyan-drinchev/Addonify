import { Text, Box, Button } from "@chakra-ui/react";
// import cosmonaut from "../assets/cosmonaut.jpg";
import { NavLink } from "react-router-dom";

export default function PageNotFound() {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        mt="80px"
        fontSize="8xl"
        fontWeight="bold"
      >
        <Text>404</Text>
      </Box>
      <Box display="flex" justifyContent="center">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          _dark={{ color: "teal.400" }}
          _light={{ color: "purple.400" }}
        >
          Oops... You have been lost in space
        </Text>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          as={NavLink}
          to="/"
          my={10}
          p={7}
          _dark={{ bgColor: "teal" }}
          _light={{ bgColor: "purple.400", color: "white" }}
          _hover={{
            _dark: { bgColor: "teal.400" },
            _light: { bgColor: "purple.300", color: "white" },
          }}
        >
          GO TO HOME PAGE
        </Button>
      </Box>
    </>
  );
}
