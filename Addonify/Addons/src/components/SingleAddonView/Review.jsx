import {
  Box,
  Stack,
  Heading,
  Container,
  SimpleGrid,
  HStack,
  VStack,
  Button,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  FormControl,
  Input,
  useToast,
  List,
  ListItem,
  Progress,
  Text,
} from "@chakra-ui/react";
import { getAddon } from "../../services/addonServices";
import { BsPencilFill } from "react-icons/bs";
import { CheckIcon } from "@chakra-ui/icons";
import { Fragment, useEffect, useState } from "react";
import { ref, set, get, update } from "firebase/database";
import { db } from "../../../firebaseConfig/config";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Rate } from "antd";
import { addReview, getAllReviews } from "../../services/reviews";
import SingleReviewView from "./SingleReviewView";
import { showToastSuccess } from "../../utils/toasts";
import { useUserContext } from "../../AppInitializers";
import { notificationProps } from "../../services/notificationServices";
import { checkIsAdmin } from "../../utils/helpers";
import { StarIcon } from "@chakra-ui/icons";
export default function Review() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [review, setReview] = useState("");
  const [allReviews, setAllReviews] = useState({});
  const toast = useToast();
  const params = useParams();
  const [addonData, setAddonData] = useState({});
  const auth = getAuth();
  const currUser = auth.currentUser;
  const [rating, setRating] = useState(3);
  const [oneStar, setOneStarCount] = useState(0);
  const [twoStar, setTwoStarCount] = useState(0);
  const [threeStar, setThreeStarCount] = useState(0);
  const [fourStar, setFourStarCount] = useState(0);
  const [fiveStar, setFiveStarCount] = useState(0);
  const [one, setOne] = useState(0);
  const [two, setTwo] = useState(0);
  const [three, setThree] = useState(0);
  const [four, setFour] = useState(0);
  const [five, setFive] = useState(0);
  const [isNewReviewSubmitted, setIsNewReviewSubmitted] = useState(false);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const { user, userData } = useUserContext();
  const navigation = useNavigate();
  const bgColorHover = useColorModeValue("purple.100", "teal.800");

  useEffect(() => {
    try {
      getAddon(params.addonId).then((addon) => {
        setAddonData(addon);
      });
    } catch (e) {
      console.log(e);
    }
  }, [isNewReviewSubmitted]);
  const OverlayOne = () => (
    <ModalOverlay
      backdropFilter={useColorModeValue(
        "blur(20px) hue-rotate(300deg)",
        "blur(20px) hue-rotate(400deg)"
      )}
    />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const handleRating = (newRating) => {
    if (newRating === null) {
      return;
    }
    setRating(newRating);
  };
  const handleSubmit = async () => {
    try {
      if (rating !== null) {
        const getRef = ref(db, `rates/${params.addonId}`);
        const rated = await get(getRef);
        if (rated.exists()) {
          const whoRated = rated.val().rater;
          //          const oldRating = rated.val().ratingValue;
          const ratedUsers = whoRated.filter((user) => {
            return user.rated !== `${localStorage.getItem("currentUserUid")}`;
          });
          if (ratedUsers.length > 0) {
            const ratingData = {
              addonID: addonData,
              rater: [
                ...ratedUsers,
                {
                  rated: `${localStorage.getItem("currentUserUid")}`,
                  value: rating,
                },
              ],
            };
            await set(getRef, ratingData);
          } else {
            const newRater = [
              {
                rated: `${localStorage.getItem("currentUserUid")}`,
                value: rating,
              },
            ];
            await update(getRef, { rater: newRater });
          }
        } else {
          const ratingData = {
            addonID: addonData,
            rater: [
              {
                rated: `${localStorage.getItem("currentUserUid")}`,
                value: rating,
              },
            ],
          };
          try {
            await set(getRef, ratingData);
          } catch (e) {
            console.log(e);
          }
        }
      }

      if (review !== "") {
        const newReview = {
          author: userData.userName,
          date: Date.now(),
          content: review,
          authorId: currUser.uid,
          authorAvatar: userData.avatar,
          rating: rating,
        };
        await addReview(params.addonId, newReview);
        setReview("");
        setIsNewReviewSubmitted(!isNewReviewSubmitted);
      }
      if (review !== "") {
        notificationProps(
          "reviewed",
          userData,
          addonData.authorUID,
          params.addonId
        );
      }
      if (rating !== 0) {
        notificationProps(
          "rated",
          userData,
          addonData.authorUID,
          params.addonId
        );
      }
      showToastSuccess(
        toast,
        "Rated",
        "Successfully rated add-on",
        <CheckIcon />,
        onClose()
      );
      setIsNewReviewSubmitted(!isNewReviewSubmitted);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (addonData) {
      getAllReviews(params.addonId, setAllReviews);
      setTotalReviewsCount(0);
      setOne(0);
      setTwo(0);
      setThree(0);
      setFour(0);
      setFive(0);
      setOneStarCount(0);
      setTwoStarCount(0);
      setThreeStarCount(0);
      setFourStarCount(0);
      setFiveStarCount(0);
      for (const review in addonData.reviews) {
        setTotalReviewsCount((prevTotal) => prevTotal + 1);
        if (addonData.reviews[review].rating === 1) {
          setOne((prevOne) => prevOne + 1);
        } else if (addonData.reviews[review].rating === 2) {
          setTwo((prevTwo) => prevTwo + 1);
        } else if (addonData.reviews[review].rating === 3) {
          setThree((prevThree) => prevThree + 1);
        } else if (addonData.reviews[review].rating === 4) {
          setFour((prevFour) => prevFour + 1);
        } else if (addonData.reviews[review].rating === 5) {
          setFive((prevFive) => prevFive + 1);
        }
      }
    }
  }, [addonData, isNewReviewSubmitted]);
  useEffect(() => {
    setOneStarCount(((one / totalReviewsCount) * 100).toFixed(0));
    setTwoStarCount(((two / totalReviewsCount) * 100).toFixed(0));
    setThreeStarCount(((three / totalReviewsCount) * 100).toFixed(0));
    setFourStarCount(((four / totalReviewsCount) * 100).toFixed(0));
    setFiveStarCount(((five / totalReviewsCount) * 100).toFixed(0));
  }, [one, two, three, four, five, addonData, isNewReviewSubmitted]);
  const handleSubmitReview = (event) => {
    setReview(event.target.value);
  };

  return (
    <Fragment>
      {user && !allReviews && (
        <Box p={4}>
          <Button
            _hover={{ bgColor: bgColorHover }}
            cursor="pointer"
            variant="ghost"
            ml="40%"
            mt="5%"
            fontSize={"xl"}
            onClick={() => {
              setOverlay(<OverlayOne />);
              onOpen();
            }}
          >
            Be the first to review this Add-on!
          </Button>
          <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setRating(null);
            }}
          >
            {overlay}
            <ModalContent
              _dark={{ bgColor: "teal.800", color: "white" }}
              _light={{ bgColor: "gray.400", color: "black" }}
            >
              <ModalHeader>Tell us what do you think</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p style={{ fontSize: "20px" }}>Rate</p>{" "}
                <Rate
                  defaultValue={rating}
                  allowClear={true}
                  onChange={handleRating}
                  style={{
                    color: "yellow",
                    marginBottom: "10px",
                    fontSize: "20px",
                  }}
                />
                <p style={{ marginBottom: "10px" }}>Your rating: {rating}</p>
                <FormControl>
                  <Input
                    type="review"
                    placeholder="Write a review"
                    value={review}
                    onChange={handleSubmitReview}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter gap={2}>
                <Button type="button" onClick={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}

      {!user && !allReviews && (
        <Button
          _light={{ color: "black" }}
          _dark={{ color: "white" }}
          variant="link"
          ml="40%"
          mt="5%"
          fontSize={"xl"}
          onClick={() => navigation("/login")}
        >
          Be the first to review this Add-on!
        </Button>
      )}
      {allReviews && (
        <Box p={4}>
          <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
            <List alignItems="center" display="flex" flexDirection="column">
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt="5px"
              >
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>{" "}
                <Progress
                  ml="10px"
                  colorScheme="yellow"
                  size="sm"
                  value={fiveStar}
                  width="400px"
                  _light={{ bgColor: "gray.400" }}
                />
                <Text fontWeight="bold" fontSize="xl" ml="5px">
                  ({five})
                </Text>
              </ListItem>
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt="5px"
              >
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>{" "}
                <Progress
                  ml="25px"
                  colorScheme="yellow"
                  size="sm"
                  value={fourStar}
                  width="400px"
                  _light={{ bgColor: "gray.400" }}
                />
                <Text ml="5px" fontWeight="bold" fontSize="xl">
                  ({four})
                </Text>
              </ListItem>
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt="5px"
              >
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>{" "}
                <Progress
                  ml="40px"
                  colorScheme="yellow"
                  size="sm"
                  value={threeStar}
                  width="400px"
                  _light={{ bgColor: "gray.400" }}
                />
                <Text ml="5px" fontWeight="bold" fontSize="xl">
                  ({three})
                </Text>
              </ListItem>
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt="5px"
              >
                <StarIcon color="yellow.400"></StarIcon>
                <StarIcon color="yellow.400"></StarIcon>{" "}
                <Progress
                  ml="55px"
                  colorScheme="yellow"
                  size="sm"
                  value={twoStar}
                  width="400px"
                  _light={{ bgColor: "gray.400" }}
                />
                <Text ml="5px" fontWeight="bold" fontSize="xl">
                  ({two})
                </Text>
              </ListItem>
              <ListItem
                display="flex"
                flexDirection="row"
                alignItems="center"
                mt="5px"
              >
                <StarIcon color="yellow.400"></StarIcon>{" "}
                <Progress
                  ml="70px"
                  colorScheme="yellow"
                  size="sm"
                  value={oneStar}
                  width="400px"
                  _light={{ bgColor: "gray.400" }}
                />
                <Text ml="5px" fontWeight="bold" fontSize="xl">
                  ({one})
                </Text>
              </ListItem>
            </List>
            {user && <Button
              size="md"
              height="40px"
              width="150px"
              border="2px"
              _light={{ borderColor: "purple.400" }}
              _dark={{ borderColor: "teal" }}
              ml="100%"
              mt="-8%"
              onClick={() => {
                setOverlay(<OverlayOne />);
                onOpen();
              }}
              rightIcon={<BsPencilFill />}
            >
              Write a review
            </Button>}
            <Heading fontSize={"2xl"}>User Reviews</Heading>
          </Stack>

          <Modal
            isCentered
            isOpen={isOpen}
            onClose={() => {
              onClose();
              setRating(null);
            }}
          >
            {overlay}
            <ModalContent
              _dark={{ bgColor: "teal.800", color: "white" }}
              _light={{ bgColor: "gray.400", color: "black" }}
            >
              <ModalHeader>Tell us what do you think</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <p style={{ color: "white", fontSize: "20px" }}>Rate</p>{" "}
                <Rate
                  defaultValue={rating}
                  allowClear={true}
                  onChange={handleRating}
                  style={{
                    color: "yellow",
                    marginBottom: "10px",
                  }}
                />
                <p style={{ color: "white", marginBottom: "10px" }}>
                  Your rating: {rating}
                </p>
                <FormControl>
                  <Input
                    type="review"
                    placeholder="Write a review"
                    value={review}
                    onChange={handleSubmitReview}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter gap={2}>
                <Button type="button" onClick={handleSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Container maxW={"6xl"} mt={10}>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 4 }}
              spacing={10}
              ml="12%"
            >
              <HStack key={"id"} align={"top"}>
                <Box color={"green.400"} px={2}></Box>

                <VStack align={"start"}>
                  {Object.entries(allReviews || {}).map(
                    ([reviewID, review]) => (
                      <SingleReviewView
                        key={reviewID}
                        review={review}
                        reviewID={reviewID}
                        addonID={params.addonId}
                        isAuthor={userData.userName === review.author}
                        rating={review.rating}
                      />
                    )
                  )}
                </VStack>
              </HStack>
            </SimpleGrid>
          </Container>
        </Box>
      )}
    </Fragment>
  );
}
