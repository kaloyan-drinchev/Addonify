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
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { object, string } from "prop-types";
import {
  deleteIdea,
  getAllLikes,
  sendLike,
  sendRemoveLike,
} from "../../services/ideasServices";
import { useUserContext } from "../../AppInitializers";
import { checkIsAdmin } from "../../utils/helpers";
import { DeleteIcon } from "@chakra-ui/icons";
import { useEffect, useRef, useState } from "react";
import { AiFillLike } from "react-icons/ai";

export default function SingleAddonIdea({ idea, ideaId }) {
  const { userData } = useUserContext();
  const [allLikes, setAllLikes] = useState([]);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    getAllLikes(ideaId).then(setAllLikes);
  }, [ideaId]);

  const isLiked = Object.values(allLikes)
    .map((e) => e?.author)
    .includes(userData.userID);

  const likeIdea = () => {
    sendLike(userData.userID, ideaId, setAllLikes);
  };

  const fetchRemoveLike = () => {
    const likeToDelete = Object.values(allLikes).filter(
      (e) => e.author === userData.userID
    )[0];
    sendRemoveLike(ideaId, likeToDelete, setAllLikes);
  };

  return (
    <Flex
      flexWrap="wrap"
      width={"100%"}
      justifyContent={"space-evenly"}
      alignItems={"flex-start"}
    >
      <Card
        width={"380px"}
        minHeight={"400px"}
        maxHeight={"650px"}
        my="20px"
        borderTop="8px"
        bgColor="purple.300"
        bg="gray.50"
        borderTopColor="purple.400"
        _dark={{
          bgColor: "teal.400",
          bg: "gray.600",
          borderTopColor: "teal.400",
        }}
      >
        <CardHeader>
          <Text fontWeight={600} fontSize="md">
            <Avatar src={idea.authorAvatar} size="sm" mr="2" /> {idea.author}{" "}
            <Text fontSize={"xs"} color="gray.500" mt="-9%" ml="60%">
              {new Date(idea.createdOn).toLocaleString()}
            </Text>
          </Text>
        </CardHeader>

        <CardBody
          textAlign="center"
          wordBreak="break-word"
          fontSize="xl"
          fontWeight={600}
          mt="-6%"
        >
          {idea.summary}

          <Divider
            borderColor="gray.400"
            width="90%"
            alignSelf="center"
            p={1}
          />
          <Flex p={1}>
            <Text fontSize="md" fontWeight={400} textAlign="center">
              {idea.description}
            </Text>
          </Flex>
        </CardBody>
        <Divider borderColor="gray.400" width="90%" alignSelf="center" />
        <CardFooter>
          {isLiked ? (
            <Tooltip label="Remove vote">
              <Button
                onClick={fetchRemoveLike}
                variant="outline-primary"
                size="md"
                mt="-6%"
              >
                <AiFillLike />
                <Text>{Object.entries(allLikes).length}</Text>
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="Vote">
              <Button
                variant="outline-primary"
                onClick={likeIdea}
                size="md"
                mt="-6%"
                _hover={{ bgColor: "yellow" }}
              >
                <AiFillLike />
                <Text>{Object.entries(allLikes).length}</Text>
              </Button>
            </Tooltip>
          )}
          {(userData.role && checkIsAdmin(userData)) ||
          userData.userName === idea.author ? (
            <Box>
              <Tooltip label="Delete Idea">
                <Button
                  onClick={onAlertOpen}
                  ml="450%"
                  mt="-60%"
                  size="md"
                  _hover={{ bgColor: "red" }}
                  variant="ghost"
                >
                  <DeleteIcon />
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
                      Delete Idea
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to delete the idea? You can&#39;t
                      undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onAlertClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => deleteIdea(ideaId)}
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
        </CardFooter>
      </Card>
    </Flex>
  );
}

SingleAddonIdea.propTypes = {
  idea: object,
  ideaId: string,
};
