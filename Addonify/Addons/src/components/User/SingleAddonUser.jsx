import { StarIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { object } from "prop-types";
import { NavLink } from "react-router-dom";

export default function SingleAddonUser({ addon }) {
  return (
    <Card
      m={2}
      width={{ base: "100%", sm: "250px" }}
      maxWidth={"250px"}
      maxHeight={"400px"}
      key={addon.key}
      borderTop="8px"
      backgroundColor="purple.300"
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
          <Image src={addon.avatar} boxSize="100px" />
        </Flex>
      </CardHeader>
      <CardBody>
        <Flex
          gap={5}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          textAlign="center"
        >
          <Box textAlign="center">
            <Heading as="h3" size="sm" wordBreak="break-word">
              {addon.name}
            </Heading>
            <Box>
              <Text state={addon}>by {addon.authorUsername}</Text>
            </Box>
          </Box>
        </Flex>
      </CardBody>
      <Divider borderColor="gray.200" />
      <CardFooter display='flex' justifyContent='space-around' alignItems='center'>
        <Button
          as={NavLink}
          to={`/single-addon-view/${addon.key}`}
          state={addon}
          p="5px"
          bgColor="unset"
          _hover={{
            transform: "scale(1.03)",
            borderRadius: "5px",
            padding: "5px",
            bgColor: "purple.300",
            _dark: { bgColor: "teal.400" },
          }}
          fontWeight="bold"
        >
          {<ViewIcon />} View Addon
        </Button>

        {!addon.isPaid ? <Flex flexDirection="row" display="flex">
                    <Text
                      p="5px"
                      _hover={{
                        transform: "scale(1.03)",
                        _dark:{textColor:'gray.500'},
                        bgColor: "yellow.300",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                      fontWeight="bold"
          >
            <StarIcon alignSelf="center" mr='5px'></StarIcon>
                      Free
                    </Text>
                  </Flex> : <Text p="5px"
                      _hover={{
                        transform: "scale(1.03)",
                        _dark:{textColor:'gray.500'},
                        bgColor: "yellow.300",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                      fontWeight="bold"
          >${addon.productPrice}</Text>}
      </CardFooter>
    </Card>
  );
}

SingleAddonUser.propTypes = {
  addon: object,
};
