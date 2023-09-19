import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get, ref, update } from "firebase/database";
import { db } from "../../firebaseConfig/config";
import {
  Avatar,
  Box,
  Flex,
  Text,
  Badge,
  Divider,
  Image,
  SimpleGrid,
  CardFooter,
  Card,
  Heading,
  CardBody,
  CardHeader,
  HStack,
  Button,
} from "@chakra-ui/react";
import adminImage from "../assets/Admin_logo_by_lucifercho-d39lpuk.png";
import ReactPaginate from "react-paginate";
import { NavLink } from "react-router-dom";
import { ViewIcon, StarIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { useUserContext } from "../AppInitializers";
import verifiedLogo from "../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png";
import { changePage } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import { notificationProps } from "../services/notificationServices";
import { useToast } from "@chakra-ui/react";
import { showToastError } from "../utils/toasts";
const SingleUserPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const navigation = useNavigate();
  const params = useParams();
  const [singleUser, stSingleUser] = useState({});
  const [getUserAddons, setUserAddons] = useState([]);
  const [areAddonsFound, setFoundStatus] = useState(false);
  const [doesUserFollow, setFollowStatus] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { verifiedData, userData } = useUserContext();
  const pageCount = Math.ceil(getUserAddons.length / 5);
  const isSomeoneLogged = localStorage.getItem("loginStatus");

  useEffect(() => {
    const fetchUser = async () => {
      const getRef = ref(db, `users/${params.userId}`);
      const snapshot = await get(getRef);
      stSingleUser({
        ...snapshot.val(),
      });
      if (
        snapshot.val().followers &&
        snapshot
          .val()
          .followers.includes(localStorage.getItem("currentUserUid"))
      ) {
        setFollowStatus(true);
      }
      setFollowersCount(
        snapshot.val()?.followers ? snapshot.val().followers.length : 0
      );
      const addonsRef = ref(db, "add-ons");
      const fetchUserAddons = await get(addonsRef);
      const gatheredAddonData = [];
      fetchUserAddons.forEach((addon) => {
        if (
          addon.val().authorUID === params.userId &&
          addon.val().approvalStatus === "approved"
        ) {
          const adjustAddon = {
            ...addon.val(),
            key: addon.key,
          };
          gatheredAddonData.push(adjustAddon);
        }
      });
      if (gatheredAddonData.length > 0) {
        setUserAddons(gatheredAddonData);
        setFoundStatus(true);
      } else {
        setFoundStatus(false);
      }
    };
    fetchUser();
  }, [params.userId]);
  if (!userData) {
    navigate("*");
  }
  const handleFollowClick = async () => {
    if (!isSomeoneLogged) {
      navigation("/login");
      showToastError(
        toast,
        "You must be logged in order to follow a user",
        <NotAllowedIcon />
      );
    } else {
      const getRef = ref(db, `users/${params.userId}`);
      const snapshot = await get(getRef);
      const check = [{ ...snapshot.val() }];
      const OldData = snapshot.val().followers;
      if (OldData) {
        const modifyNewData = [
          ...OldData,
          `${localStorage.getItem("currentUserUid")}`,
        ];
        await update(getRef, { followers: modifyNewData });
        setFollowStatus(true);
        setFollowersCount(modifyNewData.length);
      } else {
        await update(getRef, {
          followers: [`${localStorage.getItem("currentUserUid")}`],
        });
        setFollowStatus(true);
        setFollowersCount(1);
      }

      const updateCurrentUser = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      const UserSnapshot = await get(updateCurrentUser);
      const OldUserData = UserSnapshot.val().following
        ? UserSnapshot.val().following.filter(
            (user) => user.userID !== params.userId
          )
        : [];
      if (OldUserData.length > 0) {
        const modifyNewUserData = [...OldUserData, ...check];
        await update(updateCurrentUser, { following: modifyNewUserData });
        userData.following = modifyNewUserData
      } else {
        const modifyNewUserData = [...check];
        await update(updateCurrentUser, { following: modifyNewUserData });
        userData.following = modifyNewUserData
      }
      notificationProps(
        );
        "followed",
        userData,
        params.userId,
        `${localStorage.getItem("currentUserUid")}`
    }
  };

  const handleUnfollowClick = async () => {
    if (!isSomeoneLogged) {
      navigation("/login");
    } else {
      const getRef = ref(db, `users/${params.userId}`);
      const snapshot = await get(getRef);
      const OldData = snapshot.val().followers;
      if (OldData.length > 0) {
        const modifyNewData = OldData.filter(
          (user) => user != `${localStorage.getItem("currentUserUid")}`
        );
        await update(getRef, { followers: modifyNewData });
        setFollowStatus(false);
        setFollowersCount(modifyNewData.length);
      } else {
        await update(getRef, {
          followers: [`${localStorage.getItem("currentUserUid")}`],
        });
        setFollowStatus(false);
        setFollowersCount(0);
      }

      const updateCurrentUser = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      const UserSnapshot = await get(updateCurrentUser);
      const OldUserData = UserSnapshot.val().following;
      const modifyNewUserData = UserSnapshot.val().following
        ? OldUserData.filter((user) => user.userID !== params.userId)
        : [];
      await update(updateCurrentUser, { following: modifyNewUserData });
      userData.following = userData.following.filter(user => user.userID !== params.userId)
    }
  };
  return (
    <SimpleGrid>
      <Box p={8} borderWidth={1} borderRadius="md" shadow="md">
        {doesUserFollow ? (
          <Button
            display="flex"
            size="lg"
            alignSelf="center"
            onClick={handleUnfollowClick}
            bgColor="purple.400"
            _dark={{ bgColor: "teal" }}
          >
            Followed
          </Button>
        ) : (
          <Button
            _hover={{
              bgColor: "purple.400",
              _dark: { bgColor: "teal" },
            }}
            display="flex"
            size="lg"
            alignSelf="center"
            onClick={handleFollowClick}
          >
            Follow
          </Button>
        )}
        <Flex align="center">
          <Avatar size="2xl" src={singleUser.avatar} />
          <Box ml={4}>
            <Text fontSize="xl" fontWeight="bold">
              {singleUser &&
                singleUser.role &&
                singleUser.role.includes("admin") && (
                  <Image src={adminImage} height="60px" width="80px"></Image>
                )}
              {singleUser.firstName} {singleUser.lastName}
            </Text>
            <Text color="gray.500" display="inline-flex">
              @{singleUser.userName}
              {singleUser.isVerified && (
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
            </Text>
            <Text color="gray.500">{followersCount} followers</Text>
            <Badge colorScheme="green">
              Registered on{" "}
              {new Date(singleUser.creationDate).toLocaleDateString()}
            </Badge>
          </Box>
        </Flex>
        <Divider my={4} />
        <Text>Contact e-mail: {singleUser.email}</Text>
      </Box>
      <Box marginTop="80px" display="flex" justifyContent="center">
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
      <Flex gap="50px" flexWrap="wrap" marginTop="80px">
        {areAddonsFound ? (
          getUserAddons
            .slice(currentPage * 5, (currentPage + 1) * 5)
            .map((addon) => (
              <Card
                key={addon.key}
                borderTop="8px"
                backgroundColor="purple.300"
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
                        <Text cursor="pointer">by {addon.authorUsername}</Text>
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
            ))
        ) : (
          <Text
            textAlign="center"
            marginTop="130px"
            fontWeight="extrabold"
            fontSize="5xl"
          >
            This user has no uploaded add-ons so far.
          </Text>
        )}
      </Flex>
    </SimpleGrid>
  );
};
export default SingleUserPage;
