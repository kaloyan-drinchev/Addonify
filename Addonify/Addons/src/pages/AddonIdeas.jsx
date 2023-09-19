/* eslint-disable no-unused-vars */
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useUserContext } from "../AppInitializers";
import { db } from "../../firebaseConfig/config";
import { getIdea } from "../services/ideasServices";
import SingleAddonIdea from "../components/SingleAddonIdea/SingleAddonIdea";
import { ArrowUpIcon, CheckIcon } from "@chakra-ui/icons";
import { showToastSuccess } from "../utils/toasts";

export default function AddonIdeas() {
  const { userData } = useUserContext();
  const [description, setDescription] = useState("");
  const [idea, setIdea] = useState("");
  const [summary, setSummary] = useState("");
  const [allIdeas, setAllIdeas] = useState({});
  const toast = useToast();

  useEffect(() => {
    getIdea(setAllIdeas);
  }, []);

  const handleCreateIdea = (e) => {
    e.preventDefault();
    const newIdeaRef = push(ref(db, "ideas"));

    set(newIdeaRef, {
      author: userData.userName,
      authorAvatar: userData.avatar,
      description: description,
      summary: summary,
      createdOn: Date.now(),
    });
    setDescription("");
    setSummary("");
    setIdea("");
    showToastSuccess(
      toast,
      "Rated",
      "Successfully rated add-on",
      <CheckIcon />,
      onClose()
    );
  };

  const OverlayOne = () => (
    <ModalOverlay
      backdropFilter={useColorModeValue(
        "blur(20px) hue-rotate(300deg)",
        "blur(20px) hue-rotate(400deg)"
      )}
    />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleScrollClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box>
        <VStack>
          <Heading>
            <Text textAlign="center" fontWeight="bold" fontSize="3xl" mt="6%">
              ADD-ON IDEAS
            </Text>
            <Button
              size="lg"
              height="30px"
              width="110px"
              border="2px"
              _light={{ borderColor: "purple.400" }}
              _dark={{ borderColor: "teal" }}
              ml="190%"
              mt="-40%"
              onClick={() => {
                setOverlay(<OverlayOne />);
                onOpen();
              }}
            >
              CREATE
            </Button>

            <Modal
              isCentered
              isOpen={isOpen}
              onClose={() => {
                onClose();
              }}
            >
              {overlay}
              <ModalContent
                _dark={{ bgColor: "gray.600", color: "white" }}
                _light={{ bgColor: "gray.300", color: "black" }}
              >
                <ModalHeader textAlign="center">Create New Idea</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text fontSize="20px">Idea Summary</Text>{" "}
                  <Input
                    size="md"
                    type="summary"
                    placeholder="Short and descriptive"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                  <Text fontSize="20px">Description</Text>{" "}
                  <Input
                    size="lg"
                    type="description"
                    placeholder="Share about your idea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter gap={2}>
                  <Button type="button" onClick={handleCreateIdea}>
                    Submit
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Divider orientation="horizontal" mt="-2%" />
          </Heading>
          <Text textAlign="center" fontSize="2xl" mt="-2%">
            Bring your dream add-ons to life by sharing your own ideas or voting
            on existing ones
          </Text>
        </VStack>
      </Box>
      <Container
        marginTop="100px"
        display="flex"
        flexWrap="wrap"
        gap="50px"
        justifyContent="center"
      >
        <InfiniteScroll
          dataLength={allIdeas}
          endMessage={
            <Text textAlign="center" fontSize="xl">
              {allIdeas ? (
                <>
                  <Button mb={"1"} onClick={handleScrollClick} variant="ghost">
                    You have checked all posted ideas{" "}
                    <ArrowUpIcon boxSize={5} ml="8px" />
                  </Button>
                </>
              ) : (
                <Text
                  fontFamily={"Heading Font Name, sans-serif"}
                  fontSize={"4xl"}
                >
                  There are not any ideas for now. You can start with the first
                  one!
                </Text>
              )}
            </Text>
          }
        >
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            {Object.entries(allIdeas || {}).map(([ideaId, idea]) => (
              <SingleAddonIdea key={ideaId} idea={idea} ideaId={ideaId} />
            ))}
          </Grid>
        </InfiniteScroll>
      </Container>
    </>
  );
}
