import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  SimpleGrid,
  Text,
  Heading,
  HStack,
  Divider,
  Image,
} from "@chakra-ui/react";
import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPendingAddons } from "../../services/addonServices";

const AdminRequests = () => {
  const [pendingAddons, setPendingAddons] = useState([]);

  useEffect(() => {
    getPendingAddons().then(setPendingAddons);
  }, []);

  return (
    <SimpleGrid spacing={10} minChildWidth="250px">
      {pendingAddons &&
        pendingAddons.map((addon) => (
          <Card
            key={addon.key}
            borderTop="8px"
            bgColor="purple.300"
            bg="gray.50"
            borderTopColor="purple.400"
            _dark={{
              bgColor: "teal.400",
              bg: "gray.500",
              borderTopColor: "teal.400",
            }}
          >
            <CardHeader>
              <Flex gap={5} alignItems="center" justifyContent="center">
                <Image src={addon.avatar} boxSize="150px" />
              </Flex>
            </CardHeader>

            <CardBody>
              <Flex gap={5} justifyContent="center" alignItems="center">
                <Box textAlign="center">
                  <Heading as="h3" size="sm">
                    {addon.name}
                  </Heading>
                  <Text>by {addon.authorUsername}</Text>
                </Box>
              </Flex>
            </CardBody>
            <Divider borderColor="gray.200" />
            <CardFooter>
              <HStack justifyContent="space-between" width="100%">
                <NavLink to={`/single-addon-view/${addon.key}`} state={addon}>
                  <Text
                    p="5px"
                    _hover={{
                      transform: "scale(1.03)",
                      bgColor: "purple.300",
                      borderRadius: "5px",
                      padding: "5px",
                      _dark: { bgColor: "teal.400" },
                    }}
                    fontWeight="bold"
                  >
                    {<ViewIcon />} View Addon
                  </Text>
                </NavLink>

                <Text
                  p="5px"
                  _hover={{
                    transform: "scale(1.03)",
                    bgColor: "yellow.300",
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                  fontWeight="bold"
                >
                  {<StarIcon />} Rating
                </Text>
              </HStack>
            </CardFooter>
          </Card>
        ))}
    </SimpleGrid>
  );
};

export default AdminRequests;
