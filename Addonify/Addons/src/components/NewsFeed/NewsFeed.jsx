import { useState, useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import {
  Flex,
  Box,
  Accordion,
  AccordionButton,
  AccordionItem,
  Button,
  Text,
  SimpleGrid,
  HStack,
  Image,
  Heading,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { getAddonData } from "../../services/addonServices";
import Following from "./Following";
import NoFollowersPage from './NoFollowersPage';
import { useUserContext } from '../../AppInitializers';
const NewsFeed = () => {
  const [followingAddonData, setAddonData] = useState([]);
const {userData} = useUserContext()
  useEffect(() => {
    getAddonData().then(setAddonData);
  }, []);

  return (
  <>
      {userData.following && userData.following.length > 0  && followingAddonData ? 
        <Flex
        flexDirection={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-around" }}
      >
       <SimpleGrid
        gap={{ base: 4, md: 8 }}
        justifyContent="center"
        width={{ base: "100%", md: "auto" }}
      >
        <Heading fontSize={{ base: "2xl", md: "3xl" }}>Activity:</Heading>
        <Accordion allowToggle>
          {followingAddonData.map((addon, index) => (
            <Box key={index} marginBottom={{ base: "20px", md: "50px" }}>
              <Box fontSize={{ base: "lg", md: "xl" }}>
                <Text>{addon.dateCreated}</Text>
                <Box _hover={{ textDecor: "underline" }}>
                  <NavLink
                    to={`view-user/${addon.authorUID}`}
                    state={addon.authorUID}
                  >
                    {addon.authorUsername} posted a new Add-on
                  </NavLink>
                </Box>
              </Box>
              <AccordionItem key={addon.key}>
                <AccordionButton
                  as={Flex}
                  flexDirection={{ base: "column", md: "row" }}
                  alignItems={{ base: "center", md: "flex-start" }}
                  justifyContent={{ base: "center", md: "space-between" }}
                  width="100%"
                >
                  <Flex gap={{ base: 4, md: 8 }} alignItems="center">
                    <Image
                      src={addon.avatar}
                      width={{ base: "70px", md: "120px" }}
                      height={{ base: "70px", md: "120px" }}
                    />
                    <Box textAlign="center">
                      <Heading as="h3" size="lg">
                        {addon.name}
                      </Heading>
                    </Box>
                  </Flex>
                  <HStack
                    flexDirection={{ base: "column", md: "row" }}
                    alignItems={{ base: "center", md: "flex-start" }}
                    justifyContent="center"
                  >
                    <Button
                      as={NavLink}
                      to={`/single-addon-view/${addon.key}`}
                      state={addon}
                      p={{ base: "10px", md: "20px" }}
                      fontSize={{ base: "sm", md: "md" }}
                      size={{ base: "md", md: "lg" }}
                      bgColor="unset"
                      _hover={{
                        transform: "scale(1.03)",
                        borderRadius: "5px",
                        padding: "10px",
                        bgColor: "purple.300",
                        _dark: { bgColor: "teal.400" },
                      }}
                      fontWeight="bold"
                    >
                      {<ViewIcon />} View Addon
                    </Button>
                    {!addon.isPaid ? (
                      <Flex
                        flexDirection="row"
                        display="flex"
                        alignSelf="center"
                      >
                        <Text
                          p="5px"
                          _hover={{
                            transform: "scale(1.03)",
                            _dark: { textColor: "gray.500" },
                            bgColor: "yellow.300",
                            borderRadius: "5px",
                            padding: "5px",
                          }}
                          fontWeight="bold"
                        >
                          <StarIcon alignSelf="center" mr="5px"></StarIcon>
                          Free
                        </Text>
                      </Flex>
                    ) : (
                      <Text
                        p="5px"
                        _hover={{
                          transform: "scale(1.03)",
                          _dark: { textColor: "gray.500" },
                          bgColor: "yellow.300",
                          borderRadius: "5px",
                          padding: "5px",
                        }}
                        fontWeight="bold"
                        alignSelf="center"
                      >
                        ${addon.productPrice}
                      </Text>
                    )}
                  </HStack>
                </AccordionButton>
              </AccordionItem>
            </Box>
          ))}
        </Accordion>
      </SimpleGrid>
          <Following />
          </Flex>
        : <NoFollowersPage></NoFollowersPage>}
      </>
  );
};
export default NewsFeed;
