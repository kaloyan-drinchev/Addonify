import { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig/config";
import { get, ref, update, remove } from "firebase/database";
import {
  Card,
  Flex,
  CardBody,
  Box,
  Heading,
  Divider,
  CardFooter,
  HStack,
  Button,
  Image,
  SimpleGrid,
  Link,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React from "react";
import { DeleteIcon, CheckIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
const AdminVerifyUsers = () => {
  const [gatherDocs, setDocs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  useEffect(() => {
    const fetchPendingDocs = async () => {
      const getRef = ref(db, "documents");
      const snapshot = await get(getRef);
      const gatheredData = [];
      if (snapshot.exists()) {
        snapshot.forEach((user) => {
          gatheredData.push(user.val());
        });
        setDocs(gatheredData);
      }
    };
    fetchPendingDocs();
  }, []);

  const handleReject = async (id) => {
    const getRef = ref(db, `documents/${id}`);
    await remove(getRef);

    const newData = gatherDocs.filter((user) => user.userID !== id);
    setDocs(newData);
  };

  const handleApprove = async (id) => {
    const getRef = ref(db, `users/${id}`);
    await update(getRef, { isVerified: true });

    const getDocsRef = ref(db, `documents/${id}`);
    await remove(getDocsRef);

    const newData = gatherDocs.filter((user) => user.userID !== id);
    setDocs(newData);
  };

  return (
    <Flex flexDirection="column" alignItems="center" gap="30px">
      {gatherDocs.length > 0 ? (
        gatherDocs.map((user, index) => (
          <Card
            key={index}
            borderTop="8px"
            backgroundColor="purple.300"
            bg="gray.50"
            borderTopColor="purple.400"
            width="65%"
            _dark={{
              bgColor: "teal.400",
              bg: "gray.500",
              borderTopColor: "teal.400",
            }}
          >
            <CardBody>
              <Flex gap={5} justifyContent="space-evenly" alignItems="center">
                <Box textAlign="center">
                  <Flex gap={5} alignItems="center" justifyContent="center">
                    <Image src={user.avatar} boxSize="100px" />
                  </Flex>
                  <Heading as="h3" size="sm">
                    Name: {user.firstName} {user.lastName}
                  </Heading>
                  <Heading as="h5" size="sm" fontWeight="medium">
                    Username: {user.username}
                  </Heading>
                </Box>
                <SimpleGrid>
                  <Heading as="h3" size="sm">
                    Submitted On: {user.submittedOn}
                  </Heading>
                  <Heading as="h3" size="sm">
                    Document Type:{" "}
                    {user.type === "nationalID"
                      ? "National ID"
                      : user.type === "passport"
                      ? "Passport"
                      : `Driver's License`}
                  </Heading>
                  {user.type === "passport" ? (
                    <Button
                      as={Link}
                      href={user.passport}
                      isExternal
                      marginTop="15px"
                      _light={{ bgColor: "purple.400" }}
                      _dark={{ bgColor: "teal.500" }}
                      _hover={{
                        _light: { bgColor: "purple.300" },
                        _dark: { bgColor: "teal.400" },
                      }}
                      color="white"
                    >
                      Passport
                    </Button>
                  ) : (
                    <Flex display="flex" flexDirection="row" gap="10px">
                      <Button
                        as={Link}
                        href={user.docFront}
                        isExternal
                        marginTop="15px"
                        bgColor="purple.400"
                        color="white"
                        _dark={{
                          bgColor: "teal.400",
                          _hover: { bgColor: "gray.400" },
                        }}
                      >
                        Front Side
                      </Button>
                      <Button
                        as={Link}
                        href={user.docBack}
                        isExternal
                        marginTop="15px"
                        bgColor="purple.400"
                        _dark={{
                          bgColor: "teal.400",
                          _hover: { bgColor: "gray.400" },
                        }}
                        color="white"
                      >
                        Back Side
                      </Button>
                    </Flex>
                  )}
                </SimpleGrid>
              </Flex>
            </CardBody>
            <Divider borderColor="gray.200" />
            <CardFooter>
              <HStack justifyContent="space-around" width="100%">
                <Button
                  size="lg"
                  p="5px"
                  bgColor="unset"
                  _hover={{
                    transform: "scale(1.03)",
                    borderRadius: "5px",
                    padding: "5px",
                    bgColor: "green.300",
                    _dark: { bgColor: "teal.400" },
                    color: "white",
                  }}
                  fontWeight="bold"
                  onClick={() => handleApprove(user.userID)}
                >
                  <CheckIcon /> Approve
                </Button>
                <>
                  <Button
                    onClick={onOpen}
                    size="lg"
                    p="5px"
                    bgColor="unset"
                    _hover={{
                      transform: "scale(1.03)",
                      borderRadius: "5px",
                      padding: "5px",
                      bgColor: "red.400",
                      color: "white",
                    }}
                    fontWeight="bold"
                  >
                    <DeleteIcon></DeleteIcon>
                    Reject
                  </Button>

                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          Reject Application
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          Are you sure? You cannot undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                          </Button>
                          <Button
                            colorScheme="red"
                            ml={3}
                            size="lg"
                            p="5px"
                            _hover={{
                              transform: "scale(1.03)",
                              bgColor: "red.300",
                              borderRadius: "5px",
                              padding: "5px",
                            }}
                            fontWeight="bold"
                            onClick={() => handleReject(user.userID)}
                          >
                            Delete
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </>
              </HStack>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Heading>There are no applications for review right now.</Heading>
      )}
    </Flex>
  );
};

export default AdminVerifyUsers;
