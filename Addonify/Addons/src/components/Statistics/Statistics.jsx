import { useState, useEffect, Fragment } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Heading,
  Text,
  Image,
  Card,
  CardBody,
  Stat,
  StatLabel,
  CardHeader,
  useColorModeValue,
  GridItem,
  ListItem,
  List,
  Stack,
} from "@chakra-ui/react";
import {
  CheckIcon,
  NotAllowedIcon,
  QuestionOutlineIcon,
  DownloadIcon,
  ChatIcon,
  StarIcon,
  HamburgerIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { getStatisticsData } from "../../services/statisticsServices";
import SingleStatisticsItem from "./SingleStatisticsItem";
const Statistics = () => {
  const [userApprovedAddons, setUserApprovedAddons] = useState([]);
  const [userPendingAddons, setUserPendingAddons] = useState([]);
  const [userRejectedAddons, setUserRejectedAddons] = useState([]);
  const [totalDownloads, setDownloadsCount] = useState(0);
  const [totalRates, setRatesCount] = useState(0);
  const [addonsRateData, setAddonRateData] = useState([]);
  const [averageRateValue, setAverageRateValue] = useState(0);

  useEffect(() => {
    getStatisticsData(
      setDownloadsCount,
      setUserApprovedAddons,
      setUserPendingAddons,
      setUserRejectedAddons,
      setRatesCount,
      setAddonRateData,
      setAverageRateValue
    );
  }, []);
  return (
    <Fragment>
      <SimpleGrid padding="10px" gap="10px" flexShrink={0}>
        <GridItem gridColumn="1/ span1" gridRow="1">
          <Card
            maxWidth="350px"
            minHeight="180px"
            minWidth="250px"
            maxHeight="300px"
            mb="1"
            mt={5}
            borderRadius="xl"
            bg={useColorModeValue("gray.150", "gray.600")}
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <CardHeader fontSize={"xl"} color="blue.500">
              <HamburgerIcon />
            </CardHeader>

            <CardBody mb="2" py="0" direction={"column"} textAlign={"center"}>
              <Stat>
                <StatLabel fontWeight="bold" fontSize="lg">
                  Total Add-ons:{" "}
                  {userApprovedAddons.length +
                    userPendingAddons.length +
                    userRejectedAddons.length}
                </StatLabel>
              </Stat>
              <Flex
                flexDirection="row"
                justifyContent="space-around"
                fontSize="2xl"
                mt="30px"
              ></Flex>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem gridColumn="2" gridRow="1">
          <Card
            maxWidth="350px"
            minWidth="250px"
            minHeight="180px"
            maxHeight="300px"
            mb="1"
            mt={5}
            borderRadius="xl"
            bg={useColorModeValue("gray.150", "gray.600")}
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <CardHeader fontSize={"xl"} color="green">
              <CheckIcon />
            </CardHeader>

            <CardBody mb="2" py="0" direction={"column"} textAlign={"center"}>
              <Stat>
                <StatLabel fontWeight="bold" fontSize="lg">
                  Approved: {userApprovedAddons.length}
                </StatLabel>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem gridColumn="1" gridRow="2">
          <Card
            maxWidth="350px"
            minWidth="250px"
            minHeight="180px"
            maxHeight="300px"
            mb="1"
            mt={-195}
            borderRadius="xl"
            bg={useColorModeValue("gray.150", "gray.600")}
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <CardHeader fontSize={"xl"}>
              <NotAllowedIcon color="red" />

              <Stat>
                <StatLabel
                  fontWeight="bold"
                  fontSize="xl"
                  textAlign="center"
                  mt="-7"
                >
                  Rejected: {userRejectedAddons.length}
                </StatLabel>
              </Stat>
              {userRejectedAddons.length ? (
                <List>
                  {userRejectedAddons.map((addon, index) => {
                    return (
                      <SingleStatisticsItem
                        key={index}
                        addon={addon}
                        index={index}
                      />
                    );
                  })}
                </List>
              ) : (
                <Box mt="20px" textAlign="center">
                  <Text fontSize="lg">You do not have rejected Add-ons.</Text>
                </Box>
              )}
            </CardHeader>
          </Card>
        </GridItem>

        <GridItem gridColumn="2" gridRow="2">
          <Card
            maxWidth="350px"
            minWidth="250px"
            minHeight="180px"
            maxHeight="300px"
            mb="1"
            mt={-195}
            borderRadius="xl"
            bg={useColorModeValue("gray.150", "gray.600")}
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <CardHeader>
              <QuestionOutlineIcon fontSize={"xl"} color="orange.500" />
              <Stat>
                <StatLabel
                  fontWeight="bold"
                  fontSize="xl"
                  textAlign="center"
                  mt="-7"
                >
                  Pending: {userPendingAddons.length}
                </StatLabel>
              </Stat>
              {userPendingAddons.length ? (
                <List>
                  {userPendingAddons.map((addon, index) => {
                    return (
                      <SingleStatisticsItem
                        key={index}
                        addon={addon}
                        index={index}
                      />
                    );
                  })}
                </List>
              ) : (
                <Box mt="20px" textAlign="center">
                  <Text fontSize="lg">You have no pending Add-ons</Text>
                </Box>
              )}
            </CardHeader>
          </Card>
        </GridItem>
        <GridItem gridColumn="3" gridRow="1/span2">
          <Card
            w="500px"
            minH="400px"
            maxH="700px"
            mb="1"
            mt={5}
            borderRadius="xl"
            bg={useColorModeValue("gray.150", "gray.600")}
            color={useColorModeValue("gray.900", "gray.100")}
          >
            <CardHeader>
              <TimeIcon fontSize={"xl"} color="yellow.400" />
              <Stat>
                <StatLabel
                  fontWeight="bold"
                  fontSize="2xl"
                  textAlign="center"
                  mt="-7"
                >
                  Overall Performance:
                </StatLabel>
              </Stat>
              <List>
                <ListItem>
                  <Text fontSize="lg" textAlign="center" mt="2%">
                    <DownloadIcon /> Total downloads: {totalDownloads}
                  </Text>
                </ListItem>
              </List>

              <List>
                <ListItem>
                  <Text fontSize="lg" textAlign="center" mt="2%">
                    <ChatIcon /> Your Add-ons were reviewed: {totalRates} times
                  </Text>
                </ListItem>
              </List>
              <Stack spacing={7}>
                <List>
                  <ListItem>
                    <Text fontSize="lg" textAlign="center" mt="2%">
                      <StarIcon /> Average rating:{" "}
                      {averageRateValue > 0 ? averageRateValue : 0}
                    </Text>
                  </ListItem>
                </List>

                <List>
                  <ListItem>
                    <Heading fontSize="2xl" textAlign="center" mt="2%">
                      Top Downloaded Add-ons:
                    </Heading>
                    {userApprovedAddons.length ? (
                      userApprovedAddons.map((addon, index) => {
                        return (
                          <Box
                            key={addon.key}
                            display="flex"
                            mt="0.5"
                            justifyContent="center"
                            gap="5px"
                          >
                            <Text fontSize="lg" alignSelf="center">
                              {index + 1}.
                            </Text>
                            <Image
                              src={addon.avatar}
                              width="30px"
                              height="25px"
                              alignSelf="center"
                            ></Image>
                            <Box fontSize="lg">{addon.name}</Box>
                            <Flex
                              alignItems="center"
                              alignSelf="end"
                              wordBreak="break-word"
                            >
                              <DownloadIcon />
                              <Text>{addon.downloads}</Text>
                            </Flex>
                          </Box>
                        );
                      })
                    ) : (
                      <Text fontSize="lg" textAlign="center">
                        Your Add-ons are not downloaded so far.
                      </Text>
                    )}
                  </ListItem>
                </List>

                <List>
                  <ListItem>
                    <Heading fontSize="2xl" textAlign="center" mt="2%">
                      Top Rated Add-ons:
                    </Heading>

                    {addonsRateData.length ? (
                      addonsRateData?.map((addon, index) => {
                        return (
                          <Box
                            key={addon.key}
                            display="flex"
                            mt="0.5"
                            justifyContent="center"
                            gap="5px"
                          >
                            <Text fontSize="lg" alignSelf="center">
                              {index + 1}.
                            </Text>
                            <Image
                              src={addon.addonID?.avatar}
                              width="30px"
                              height="25px"
                              alignSelf="center"
                            ></Image>
                            <Box fontSize="lg" wordBreak="break-word">
                              {addon.addonID?.name}
                            </Box>
                            <Flex alignItems="center" alignSelf="end">
                              <StarIcon />
                              <Text>{addon.average}</Text>
                            </Flex>
                          </Box>
                        );
                      })
                    ) : (
                      <Text fontSize="lg" textAlign="center">
                        Your Add-ons are not rated so far.
                      </Text>
                    )}
                  </ListItem>
                </List>
              </Stack>
            </CardHeader>
          </Card>
        </GridItem>
      </SimpleGrid>
    </Fragment>
  );
};
export default Statistics;
