import { useState } from "react";
import { NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
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
  HStack,
  Image,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  StarIcon,
  ViewIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { array, string } from "prop-types";
import { useUserContext } from "../../AppInitializers";
import verifiedLogo from "../../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png";
import { changePage } from "../../utils/helpers";

const GetAddons = ({ addons, title }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { userData, verifiedData } = useUserContext();
  const pageCount = Math.ceil(addons.length / 4);

  return (
    <Box>
      <HStack>
        <Text fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
      </HStack>
      <SimpleGrid
        gap={{ base: 4, md: 2 }}
        spacing={10}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
      >
        <ReactPaginate
          onPageChange={(e) => changePage(e, setCurrentPage)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          pageCount={pageCount}
          nextLabel={null}
          previousLabel={null}
          pageClassName="page-item-dashboard"
          pageLinkClassName="page-link-dashboard"
          previousClassName="previous-page-item-dashboard"
          nextClassName="next-page-item-dashboard"
          breakLabel="..."
          breakClassName="page-item-dashboard"
          breakLinkClassName="page-link-dashboard"
          containerClassName="pagination-dashboard"
          activeClassName="activatedPage-dashboard"
          renderOnZeroPageCount={null}
        />

        <Button
          _hover={{ bgColor: useColorModeValue("purple.300", "teal.400") }}
          isDisabled={currentPage - 1 < 0}
          alignSelf="center"
          cursor="pointer"
          onClick={() =>
            changePage({ selected: currentPage - 1 }, setCurrentPage)
          }
          mb={{ base: 4, md: 0 }}
        >
          <ArrowLeftIcon />
        </Button>
        <Flex
          flexWrap="wrap"
          width={"100%"}
          justifyContent={"space-evenly"}
          alignItems={"flex-start"}
        >
          {addons.slice(currentPage * 4, (currentPage + 1) * 4).map((addon) => (
            <Card
              my="20px"
              maxWidth="240px"
              height={"350px"}
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
                  <Image src={addon.avatar} boxSize="100px" />
                </Flex>
              </CardHeader>

              <CardBody>
                <Flex gap={5} justifyContent="center" alignItems="center">
                  <Box textAlign="center">
                    <Heading as="h3" wordBreak="break-word" size={"md"}>
                      {addon.name}
                    </Heading>
                    <Box
                      _hover={{ textDecor: "underline" }}
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                    >
                      <NavLink
                        to={
                          addon.authorUsername === userData?.userName
                            ? "/profile"
                            : `view-user/${addon.authorUID}`
                        }
                        state={addon.authorUID}
                      >
                        by {addon.authorUsername}
                      </NavLink>
                      {verifiedData?.includes(addon.authorUID) && (
                        <Image
                          src={verifiedLogo}
                          height="20px"
                          width="25px"
                          display="flex"
                          alignSelf="center"
                          _dark={{
                            filter:
                              "invert(14%) sepia(98%) saturate(3728%) hue-rotate(172deg) brightness(110%) contrast(122%)",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Flex>
              </CardBody>
              <Divider borderColor="gray.200" />
              <CardFooter>
                <HStack justifyContent="space-between" width="100%">
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
                    <ViewIcon /> View Addon
                  </Button>
                  {!addon.isPaid ? (
                    <Flex flexDirection="row" display="flex">
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
                    >
                      ${addon.productPrice}
                    </Text>
                  )}
                </HStack>
              </CardFooter>
            </Card>
          ))}
        </Flex>

        <Button
          _hover={{ bgColor: "purple.300", _dark: { bgColor: "teal.400" } }}
          isDisabled={currentPage + 1 >= pageCount}
          alignSelf="center"
          cursor="pointer"
          onClick={() =>
            changePage({ selected: currentPage + 1 }, setCurrentPage)
          }
        >
          <ArrowRightIcon />
        </Button>
      </SimpleGrid>
    </Box>
  );
};

GetAddons.propTypes = {
  addons: array,
  title: string,
};

export default GetAddons;
