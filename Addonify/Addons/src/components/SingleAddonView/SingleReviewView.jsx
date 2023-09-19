import { Fragment, useRef } from "react";
import { deleteReview } from "../../services/reviews";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { DeleteIcon, StarIcon } from "@chakra-ui/icons";
import { bool, number, object, string } from "prop-types";
import { useUserContext } from "../../AppInitializers";
import { checkIsAdmin } from "../../utils/helpers";

export default function SingleReviewView({
  review,
  reviewID,
  addonID,
  isAuthor,
  rating,
}) {
  const { userData } = useUserContext();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const handleDeleteReview = () => {
    deleteReview(addonID, reviewID);
  };

  return (
    <Fragment>
      <Card
        width={"650px"}
        maxWidth={"800px"}
        maxHeight={"400px"}
        p="0"
        mb="1"
        mt={3}
        ml='8%'
        borderRadius="md"
        shadow="xl"
      >
        <CardBody mb="2" py="0" direction={"column"}>
          <Flex
            p={3}
            pb={2}
            width="full"
            alignItems="center"
            position={"relative"}
          >
            <NavLink to={`view-user/${review.authorId}`} state={review}>
              <Flex flexDirection="row" alignItems="center">
                <Avatar src={review.authorAvatar} size="md" mr="2" />
                <Text
                  fontWeight={700}
                  fontSize="xl"
                  _hover={{ textDecoration: "underline" }}
                >
                  {review.author}
                </Text>
              </Flex>
            </NavLink>
            <Text paddingLeft={2} fontSize={"xs"} color="gray.500">
              {new Date(review.date).toLocaleString()}
            </Text>
            <Flex position="absolute" right={1}></Flex>
            <Flex ml="15px">
              {rating &&
                Array.from({ length: rating }).map((_, index) => (
                  <StarIcon key={index} color="yellow.400"></StarIcon>
                ))}
            </Flex>
          </Flex>
          <Flex>
            <Box wordBreak={"break-word"} fontSize="lg">
              {review.content}
            </Box>
          </Flex>
          {userData.role && checkIsAdmin(userData) | isAuthor ? (
            <Box p={4}>
              <Tooltip label="Delete Review">
                <Button onClick={onAlertOpen} ml="95%" mt="-3%" size="md">
                  <DeleteIcon color="red" />
                </Button>
              </Tooltip>
              <AlertDialog
                motionPreset="slideInBottom"
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onAlertClose}
                isCentered
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Review
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to delete the review? You can&#39;t
                      undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onAlertClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={handleDeleteReview}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </Box>
          ) : (
            <Text></Text>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
}

SingleReviewView.propTypes = {
  review: object,
  reviewID: string,
  addonID: string,
  isAuthor: bool,
  isAdmin: bool,
  rating: number,
};
