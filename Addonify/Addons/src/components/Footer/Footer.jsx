import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaGitlab } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      as="footer"
      bg={useColorModeValue("gray.50", "gray.700")}
      color={useColorModeValue("gray.900", "gray.200")}
    >
      <Container
        as={Stack}
        maxW={"xl"}
        ml="38%"
        direction={{ base: "column", md: "row" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © 2023 Addonify. Elevate Your Experience. All rights reserved.
        </Text>
        <Link
          href="https://gitlab.com/Krasen_Filipov_Telerik/team-12-final-project-addonis"
          isExternal
        >
          <Button variant="ghost" colorScheme="orange">
            <FaGitlab />
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
