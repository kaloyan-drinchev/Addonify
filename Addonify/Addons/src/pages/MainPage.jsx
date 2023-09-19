import {
  Box,
  Button,
  SimpleGrid,
  HStack,
  Input,
  CardFooter,
  Card,
  Image,
  Flex,
  Divider,
  Text,
  Heading,
  CardBody,
  CardHeader,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ViewIcon,
  StarIcon,
  ArrowBackIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../firebaseConfig/config.js";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import GetTags from "../components/BrowseAddons/GetTags.jsx";
import SortingModalBrowser from "../components/BrowseAddons/SortingModalBrowser.jsx";
import Suggestions from "../components/BrowseAddons/Suggestions.jsx";
import TrendingNewestFeaturedData from "../components/TrendingNewestFeaturedData/TrendingNewestFeaturedData.jsx";
import { useUserContext } from "../AppInitializers.jsx";
import verifiedLogo from "../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png";
import { changePage } from "../utils/helpers.js";

const MainPage = () => {
  const { verifiedData } = useUserContext();
  const [allAddons, setAllAddons] = useState([]);
  const [allAddonsBackup, setAllAddonsBackup] = useState([]);
  const [getAllTags, setAllTags] = useState([]);
  const [searchInput, setInput] = useState("");
  const [goBackButton, setGoBackStatus] = useState(false);
  const [areAddonsFound, setFoundStatus] = useState(false);
  const [suggestions, setSuggestions] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dashboardShown, setShownStatus] = useState(true);

  const pageCount = Math.ceil(allAddons.length / 10);
  useEffect(() => {
    const getAddons = async () => {
      const usersRef = ref(db, `add-ons`);
      const snapshot = await get(usersRef);
      const totalAddons = [];
      const getTags = new Set();
      snapshot.forEach((addon) => {
        if (addon.val().approvalStatus === "approved") {
          const tags = addon.val().tags;
          tags.forEach((tag) => getTags.add(tag));
          const adjustAddon = {
            ...addon.val(),
            key: addon.key,
          };
          totalAddons.push(adjustAddon);
        }
        setAllTags([...getTags]);
        setAllAddons(totalAddons);
        setAllAddonsBackup(totalAddons);
      });
    };
    getAddons();
  }, []);
  const searchAddons = async (input) => {
    const addonsRef = ref(db, `add-ons`);
    const snapshot = await get(addonsRef);
    const gatheredAddons = [];
    snapshot.forEach((addon) => {
      if (addon.val().approvalStatus === "approved") {
        const adjustAddon = {
          ...addon.val(),
          key: addon.key,
        };
        gatheredAddons.push(adjustAddon);
      }
    });
    const searchResults = gatheredAddons.filter((addon) =>
      addon.name.toLocaleLowerCase().match(input.toLocaleLowerCase())
    );
    setAllAddons(searchResults);
    setGoBackStatus(true);
    setShownStatus(false);
    if (searchResults.length === 0) {
      setFoundStatus(true);
    } else {
      setFoundStatus(false);
    }
  };

  const handleGoBack = () => {
    setShownStatus(true);
    setFoundStatus(false);
    setGoBackStatus(false);
  };

  const handleSearchInput = (event) => {
    setInput(`${event}`);
    if (event.length < 1) {
      setFoundStatus(false);
      setGoBackStatus(false);
      setAllAddons(allAddonsBackup);
      setShownStatus(true);
      setSuggestions(false);
    }
    if (searchInput.length > 0) {
      const generateList = allAddons.filter((item) =>
        item.name.toLocaleLowerCase().match(event.toLocaleLowerCase())
      );
      setSuggestionsList(generateList);
      setSuggestions(true);
    }
    if (event.length === 0) {
      setSuggestions(false);
    }
  };

  const handleEnterClick = (e) => {
    if (e.key === "Enter") {
      searchAddons(searchInput);
    }
  };

  return (
    <Box>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        justifyContent="center"
        alignItems={{ base: "center", md: "flex-start" }}
      >
        <SimpleGrid>
          <Input
            variant="filled"
            placeholder="Search extensions"
            marginTop={{ base: "12px", md: 0 }}
            size="lg"
            type="search"
            width="lg"
            onKeyUp={(e) => handleEnterClick(e)}
            onChange={(e) => handleSearchInput(e.target.value)}
          ></Input>
          {suggestions && (
            <Suggestions
              addons={suggestionsList}
              searchFunction={searchAddons}
            ></Suggestions>
          )}
        </SimpleGrid>
        <Button
          size="lg"
          mx={2}
          type="button"
          bgColor="gray.250"
          color="white"
          _hover={{
            bgColor: useColorModeValue("purple.300", "teal.300"),
          }}
          onClick={() => searchAddons(searchInput)}
        >
          <SearchIcon color="black" _dark={{ color: "white" }} />
        </Button>
        <SortingModalBrowser
          display="inline-flex"
          addons={allAddons}
          setAddons={setAllAddons}
          alignSelf="center"
        ></SortingModalBrowser>
      </Flex>
      <GetTags
        tags={getAllTags}
        setAddonData={setAllAddons}
        backButton={setGoBackStatus}
        shownStatus={setShownStatus}
      ></GetTags>
      {!dashboardShown && (
        <Box marginTop="80px">
          <ReactPaginate
            nextLabel="Forward>"
            onPageChange={(e) => changePage(e, setCurrentPage)}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            previousLabel="< Previous"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="activatedPage"
            renderOnZeroPageCount={null}
          />
        </Box>
      )}
      {!dashboardShown && areAddonsFound && (
        <Text
          textAlign="center"
          marginTop="130px"
          fontWeight="extrabold"
          fontSize="5xl"
        >
          No matches were found 😢
        </Text>
      )}
      {goBackButton && (
        <Button type="button" onClick={handleGoBack}>
          <ArrowBackIcon /> Go Back
        </Button>
      )}
      {dashboardShown ? (
        <Box marginTop="80px">
          <TrendingNewestFeaturedData></TrendingNewestFeaturedData>
        </Box>
      ) : (
        <Flex
          spacing={10}
          minWidth="200px"
          display="flex"
          flexWrap="wrap"
          gap={10}
          marginTop="40px"
        >
          {allAddons &&
            allAddons
              .slice(currentPage * 10, (currentPage + 1) * 10)
              .map((addon) => (
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
                      <Image src={addon.avatar} boxSize="100px" />
                    </Flex>
                  </CardHeader>

                  <CardBody>
                    <Flex gap={5} justifyContent="center" alignItems="center">
                      <Box textAlign="center">
                        <Heading as="h3" size="sm">
                          {addon.name}
                        </Heading>
                        <Box
                          _hover={{ textDecor: "underline" }}
                          display="flex"
                          flexDirection="row"
                          justifyContent="center"
                        >
                          <NavLink
                            to={`view-user/${addon.authorUID}`}
                            state={addon}
                          >
                            by {addon.authorUsername}
                          </NavLink>
                          {verifiedData.includes(addon.authorUID) && (
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
                            ></Image>
                          )}
                        </Box>
                      </Box>
                    </Flex>
                  </CardBody>
                  <Divider borderColor="gray.200" />
                  <CardFooter
                    display="flex"
                    flexDirection="row"
                    flexWrap="nowrap"
                  >
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
                        {<ViewIcon />} View Addon
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
      )}
    </Box>
  );
};
export default MainPage;
