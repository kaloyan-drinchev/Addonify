import {
  Flex,
  Image,
  Stack,
  useColorModeValue,
  List,
  ListIcon,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import {
  EmailIcon,
  InfoIcon,
  PhoneIcon,
  StarIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import { useUserContext } from "../AppInitializers";
import EditProfile from "../components/User/EditProfile";
import UserAddons from "../components/User/UserAddons";
import Verification from "../components/Verification/Verification";
import Statistics from "../components/Statistics/Statistics";

export default function Profile() {
  const { userData } = useUserContext();

  return (
    <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
      <TabList>
        <Tab
          _selected={{
            color: "white",
            bg: useColorModeValue("purple.400", "teal"),
          }}
        >
          Account Info
        </Tab>
        <Tab
          _selected={{
            color: "white",
            bg: useColorModeValue("purple.400", "teal"),
          }}
        >
          Get Verified
        </Tab>
        <Tab
          _selected={{
            color: "white",
            bg: useColorModeValue("purple.400", "teal"),
          }}
        >
          My Addons
        </Tab>
        <Tab
          _selected={{
            color: "white",
            bg: useColorModeValue("purple.400", "teal"),
          }}
        >
          Statistics
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Stack
            borderWidth="1px"
            borderRadius="lg"
            w={{ sm: "100%", md: "700px" }}
            height={{ sm: "476px", md: "30rem" }}
            ml="-1.6%"
            direction={{ base: "column", md: "row" }}
            bg={useColorModeValue("white", "gray.900")}
            boxShadow={"2xl"}
            padding={4}
          >
            <EditProfile user={userData} />
            <Flex flex={1}>
              <Image
                objectFit="cover"
                boxSize="70%"
                src={userData.avatar}
                alt="#"
                width="80%"
                height="70%"
                mt="20%"
                ml="10%"
              />
            </Flex>

            <Stack
              flex={1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              p={1}
              pt={2}
            >
              <List spacing={4}>
                <ListItem>
                  <ListIcon as={StarIcon} /> Username: {userData.userName}
                </ListItem>
                <ListItem>
                  <ListIcon as={InfoIcon} /> Name: {userData.firstName}{" "}
                  {userData.lastName}
                </ListItem>
                <ListItem>
                  <ListIcon as={EmailIcon} /> Email: {userData.email}
                </ListItem>
                <ListItem>
                  <ListIcon as={PhoneIcon} /> Phone number: {userData.phone}
                </ListItem>
                <ListItem>
                  <ListIcon as={CalendarIcon} /> Created on: {" "}
                  {userData.creationDate}
                </ListItem>
              </List>
            </Stack>
          </Stack>
        </TabPanel>
        <TabPanel>
          <Verification />
        </TabPanel>
        <TabPanel>
          <UserAddons />
        </TabPanel>
        <TabPanel>
          <Statistics />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
