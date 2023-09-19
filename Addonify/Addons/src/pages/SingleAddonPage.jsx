/* eslint-disable no-unused-vars */
import { useUserContext } from "../AppInitializers";
import { ref, get, update } from "firebase/database";
import { Navigate, useParams } from "react-router-dom";
import { useState, useEffect, Fragment } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { db } from "../../firebaseConfig/config";
import { loadStripe } from "@stripe/stripe-js";
import {
  DownloadIcon,
  ArrowDownIcon,
  CheckIcon,
  NotAllowedIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Heading,
  Image,
  Text,
  useColorModeValue,
  Container,
  HStack,
  Button,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Spacer,
  VStack,
  useToast,
  Link,
} from "@chakra-ui/react";
import EditSingleAddonView from "../components/SingleAddonView/EditSingleAddonView";
import Review from "../components/SingleAddonView/Review";
import dollarSign from "../assets/64-512.png";
import { showToastError, showToastSuccess } from "../utils/toasts";
import { notificationProps } from "../services/notificationServices";
import {
  changeAddonStatus,
  getAddonAuthor,
  getAddonRating,
  getGitData,
  getAddon,
} from "../services/addonServices";
import { useNavigate } from "react-router";

export default function SingleAddonPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [addonData, setAddonData] = useState({});
  const toast = useToast();
  const [addonAuthor, setAddonAuthor] = useState({});
  const { userData } = useUserContext();
  const [gitData, setGitData] = useState({});
  const [readMe, setReadMeData] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isStatusButtonHidden, setIsStatusButtonHidden] = useState(true);
  const [downloadCount, setDownloadCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [review, setReview] = useState(0);
  const bgColor = useColorModeValue("purple.400", "teal.500");
  const stripePromise = loadStripe(
    "pk_test_51NlcfAFzJC2ea4fLm5CQIM55yUJGiwpxDfuzzDLq1M6pc8ldCr8GUwxdnWnhqCvHx4cV06TSYlPV3gqXiX7J3CM7008nDtykZy"
  );
  useEffect(() => {
    getAddon(params.addonId).then((addon) => {
      setAddonData(addon);
      setTitle(addon.name);
      setDescription(addon.description);
      setDownloadCount(addon.downloads);
      setIsStatusButtonHidden(addon.approvalStatus === "pending");
    });
  }, []);
  if (!addonData) {
    navigate("*");
  }
  useEffect(() => {
    if (addonData) {
      getAddonAuthor(addonData).then(setAddonAuthor);
      getGitData(addonData, setReadMeData).then(setGitData);
      getAddonRating(params.addonId, setReview, setReviewCount);
    }
  }, [addonData]);

  const downloadIncrement = async () => {
    try {
      const userRef = ref(db, `add-ons/${params.addonId}`);
      const addon = await get(userRef);
      const downloadsCount = addon.val().downloads;
      console.log(downloadsCount);
      await update(userRef, { downloads: downloadsCount + 1 });
      setDownloadCount(downloadsCount + 1);
      showToastSuccess(
        toast,
        "Downloaded!",
        "Successfully downloaded Addon",
        <CheckIcon />
      );
      notificationProps(
        "downloaded",
        userData,
        addonData.authorUID,
        params.addonId
      );
    } catch (e) {
      console.log(e);
    }
  };

  const createCheckoutSession = async (priceId, downloadLink) => {
    const item = {
      price: `${priceId}`,
      quantity: 1,
    };

    const dataForTransfer = {
      addonKey: addonData.key,
      addonAuthor: addonData.authorUID,
      downloadLink: downloadLink,
    };
    const dataForTransferQuery = encodeURIComponent(
      JSON.stringify(dataForTransfer)
    );
    const checkOutOptions = {
      lineItems: [item],
      mode: "payment",
      successUrl: `${window.location.origin}/success?dataForTransfer=${dataForTransferQuery}`,
      cancelUrl: `${window.location.origin}/`,
    };

    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout(checkOutOptions);
  };

  const handleSuccess = () => {
    showToastSuccess(
      toast,
      "Approved!",
      "Successfully approved Addon.",
      <CheckIcon />
    ),
      notificationProps(
        "Approved",
        userData,
        addonData.authorUID,
        params.addonId
      );
  };
  const handleReject = () => {
    showToastSuccess(toast, "Rejected!", "Rejected addon.", <NotAllowedIcon />),
      notificationProps(
        "Approved",
        userData,
        addonData.authorUID,
        params.addonId
      );
    notificationProps(
      "Rejected",
      userData,
      addonData.authorUID,
      params.addonId
    );
  };
  const handleAddonStatus = (isApproved) => {
    changeAddonStatus(params.addonId, isApproved).then(() => {
      isApproved ? handleSuccess() : handleReject();
      setTimeout(() => {
        setIsStatusButtonHidden(false);
      }, 2000);
    });
  };

  return (
    <Container maxW={"7xl"} p="12" marginTop="6" marginLeft="-9">
      <Box
        marginTop={{ base: "1", sm: "5" }}
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="space-between"
      >
        <Box
          display="flex"
          flex="1"
          marginRight="3"
          position="relative"
          alignItems="center"
        >
          <Box
            width={{ base: "100%", sm: "85%" }}
            zIndex="2"
            marginLeft={{ base: "0", sm: "5%" }}
            marginTop="5%"
          >
            <Box textDecoration="none" _hover={{ textDecoration: "none" }}>
              <Image
                borderRadius="lg"
                src={addonData.avatar}
                alt="extension img"
                objectFit="contain"
                transform="scale(1.0)"
                transition="0.2s ease-in-out"
                _hover={{
                  transform: "scale(1.05)",
                }}
                boxSize="200px"
              />
            </Box>
          </Box>
          <Box zIndex="1" width="100%" position="absolute" height="100%">
            <Box
              bgGradient={useColorModeValue(
                "radial(orange.600 1px, transparent 1px)",
                "radial(orange.300 1px, transparent 1px)"
              )}
              backgroundSize="20px 20px"
              opacity="0.4"
              height="100%"
            />
          </Box>
        </Box>
        <Box
          display="flex"
          flex="2"
          flexDirection="column"
          justifyContent="center"
          marginTop={{ base: "3", sm: "0" }}
        >
          <HStack>
            <HStack spacing={2}>
              {addonData &&
                addonData.tags &&
                addonData.tags.map((tag) => (
                  <Tag size={"md"} variant="solid" bgColor={bgColor} key={tag}>
                    {tag}
                  </Tag>
                ))}
            </HStack>
            <Text>
              | {<ArrowDownIcon />} {downloadCount} downloads
            </Text>
            <Text>
              | {<StarIcon />} {review.toFixed(2)} rating ({reviewCount})
            </Text>

            <Spacer />
            {userData.userID === addonData.authorUID ||
            localStorage.getItem("isAdminLogged") ? (
              <EditSingleAddonView
                description={description}
                title={title}
                onChangeDescription={setDescription}
                onChangeTitle={setTitle}
              />
            ) : (
              <Text></Text>
            )}
          </HStack>
          <Heading marginTop="1">
            <Text textDecoration="none" _hover={{ textDecoration: "none" }}>
              {title}
            </Text>
          </Heading>
          <Text
            as="p"
            marginTop="2"
            color={useColorModeValue("gray.700", "gray.200")}
            fontSize="lg"
            wordBreak={"break-word"}
          >
            {description}
          </Text>
          <Box>
            <HStack
              marginTop="2"
              spacing="2"
              display="flex"
              alignItems="center"
            >
              <Image
                borderRadius="full"
                boxSize="40px"
                src={addonAuthor ? addonAuthor.avatar : userData.avatar}
                alt={`Avatar of the creator`}
              />
              <Text fontWeight="medium">{addonData.authorUsername}</Text>
              <Text>—</Text>
              <Text>{addonData.dateCreated}</Text>
            </HStack>
            <HStack alignItems="center">
              {!addonData.isPaid ? (
                <Button
                  as="a"
                  href={addonData.downloadLink}
                  leftIcon={<DownloadIcon />}
                  mt="18px"
                  _dark={{ bgColor: "teal.500" }}
                  _light={{ bgColor: "purple.400" }}
                  color="white"
                  _hover={{
                    _dark: { bgColor: "teal.400" },
                    _light: { bgColor: "purple.300" },
                  }}
                  onClick={downloadIncrement}
                >
                  Download
                </Button>
              ) : (
                <Button
                  mt="18px"
                  _hover={{
                    _dark: { bgColor: "teal.400" },
                    _light: { bgColor: "purple.300" },
                  }}
                  color="white"
                  _dark={{ bgColor: "teal.500" }}
                  _light={{ bgColor: "purple.400" }}
                  onClick={() =>
                    createCheckoutSession(
                      addonData.productId,
                      addonData.downloadLink
                    )
                  }
                >
                  <Image
                    src={dollarSign}
                    color="white"
                    height="25px"
                    width="25px"
                    style={{ filter: "invert(1) grayscale(100%)" }}
                  ></Image>
                  <Text ml="10px">{addonData.productPrice}$</Text>
                </Button>
              )}
              <Spacer />
              {addonData.approvalStatus === "pending" && (
                <Fragment>
                  {isStatusButtonHidden && (
                    <Button
                      mt="18px"
                      colorScheme="teal"
                      onClick={() => handleAddonStatus(true)}
                    >
                      Approve
                    </Button>
                  )}
                  {isStatusButtonHidden && (
                    <Button
                      mt="18px"
                      colorScheme="red"
                      onClick={() => handleAddonStatus(false)}
                    >
                      Reject
                    </Button>
                  )}
                </Fragment>
              )}
            </HStack>
          </Box>
        </Box>
      </Box>

      <Tabs mt="40px" p="20px" colorScheme="purple" variant="enclosed">
        <TabList>
          <Tab
            _selected={{
              color: "white",
              bg: useColorModeValue("purple.400", "teal"),
            }}
            fontSize="xl"
          >
            Overview
          </Tab>
          <Tab
            _selected={{
              color: "white",
              bg: useColorModeValue("purple.400", "teal"),
            }}
            fontSize="xl"
          >
            Reviews
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {gitData && (
              <VStack fontSize="lg">
                <Text
                  variant="link"
                  as={Link}
                  href={gitData.repositoryLink}
                  color="blue.500"
                  textDecoration="underline"
                >
                  GitHub Link
                </Text>
                <Text>Language: {gitData.language}</Text>
                <Text>Last updated at: {gitData.lastUpdate}</Text>
                <Text>Pulls count: {gitData.pullsCount}</Text>
                <Text>Open Issues: {gitData.openIssues}</Text>
              </VStack>
            )}
            <Container
              maxW={"5xl"}
              p="6"
              marginTop="6"
              borderWidth="1px"
              borderRadius="md"
            >
              <Text fontSize="xl" fontWeight="bold" mb="4">
                README.md
              </Text>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
              >
                {readMe && atob(readMe)}
              </ReactMarkdown>
            </Container>
          </TabPanel>
          <TabPanel>
            <Review
              addonID={addonData}
              addonAuthor={addonAuthor}
              user={userData}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
