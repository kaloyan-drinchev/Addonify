import { UnlockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Button,
  Flex,
  HStack,
  Image,
  Spacer,
  Text,
  useToast,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { MdLogout } from "react-icons/md";
import PendingAddonsDropDown from "../../components/DropDownAddonMenu/PendingAddonsDropDown";
import { NavLink, useNavigate } from "react-router-dom";
import NotificationDropDownMenu from "../Notifications/NotificationDropDownMenu";
import verifiedLogo from "../../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png";
import { showToastSuccess } from "../../utils/toasts";
import NoUserNavbar from "./NoUserNavbar";
import { handleSignOut } from "../../services/authServices.js";
import { useUserContext } from "../../AppInitializers";
import { checkIsAdmin } from "../../utils/helpers";

export default function NavBar() {
  const { user, userData, setUserData } = useUserContext(); // same as loginStatus
  const navigate = useNavigate(); // same as window.location
  const toast = useToast();
  const bgColor = useColorModeValue("purple.400", "teal");
  const bgColorHover = useColorModeValue("purple.300", "teal.300");

  const handleLogOut = () => {
    showToastSuccess(
      toast,
      "Logged out",
      "Successfully logged out",
      <UnlockIcon />
    );
    handleSignOut();
    setUserData({});
    navigate("/login");
  };

  return (
    <Flex
      as="nav"
      p="10px"
      mb={{ base: "20px", md: "40px" }}
      alignItems="center"
    >
      <Spacer />
      {user ? (
        <HStack spacing={{ base: "10px", md: "20px" }}>
          {userData.role &&
            checkIsAdmin(userData) /* same as isAdminLogged */ && (
              <PendingAddonsDropDown />
            )}
          <NotificationDropDownMenu />
          <NavLink to="/profile">
            <Avatar src={userData.avatar}>
              {userData.isVerified && (
                <AvatarBadge border="none">
                  <Image
                    src={verifiedLogo}
                    height="17px"
                    width="22px"
                    display="flex"
                    alignSelf="center"
                    _dark={{
                      filter:
                        "invert(14%) sepia(98%) saturate(3728%) hue-rotate(172deg) brightness(110%) contrast(122%)",
                    }}
                  ></Image>
                </AvatarBadge>
              )}
            </Avatar>
          </NavLink>
          <Text display={{ base: "none", md: "block" }}>
            {userData.userName}
          </Text>
          <Button
            h={10}
            color="white"
            bgColor={bgColor}
            _hover={{
              bgColor: bgColorHover,
            }}
            onClick={handleLogOut}
          >
            <Icon as={MdLogout} w={8} h={6} />
          </Button>
        </HStack>
      ) : (
        <NoUserNavbar />
      )}
    </Flex>
  );
}
