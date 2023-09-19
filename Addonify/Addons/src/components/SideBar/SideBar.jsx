import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  List,
  ListItem,
  Img,
  HStack,
  useColorModeValue,
  Button,
  useColorMode,
  Icon,
} from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { NavLink } from "react-router-dom";
import image from "../../assets/image.png";
import PrivateItems from "./PrivateItems";
import { useUserContext } from "../../AppInitializers";
import { checkIsAdmin, checkIsBlocked } from "../../utils/helpers";
import { FiShoppingBag } from "react-icons/fi";

export default function SideBar() {
  const { toggleColorMode } = useColorMode();
  const { user, userData } = useUserContext();
  const [moonHidden, setMoonHidden] = useState(
    localStorage.getItem("themeStatus")
  );
  const bgColor = useColorModeValue("purple.400", "teal");
  const bgColorHover = useColorModeValue("purple.300", "teal.300");

  const handleSwitch = () => {
    setMoonHidden(!moonHidden);
    toggleColorMode();
  };

  return (
    <Fragment>
      <Img src={image} alt="Addonify logo"></Img>
      <HStack spacing="20px"></HStack>
      <List color="white" fontSize="1.2em" spacing={4}>
        <ListItem>
          <Button
            as={NavLink}
            to="/"
            bgColor={bgColor}
            color="white"
            size="lg"
            justifyContent="flex-start"
            leftIcon={<Icon as={FiShoppingBag} color="white" boxSize={8} />}
            fontSize="xl"
            _hover={{
              bgColor: bgColorHover,
            }}
          >
            Marketplace
          </Button>
        </ListItem>
        {user && userData.role && (
          <PrivateItems
            isAdmin={checkIsAdmin(userData)}
            isBlocked={checkIsBlocked(userData)}
            colors={{ bgColor: bgColor, bgColorHover: bgColorHover }}
          />
        )}
        <ListItem>
          <Button
            bgColor={bgColor}
            _hover={{
              bgColor: bgColorHover,
            }}
            onClick={handleSwitch}
          >
            {moonHidden ? (
              <SunIcon boxSize={8} color="white" />
            ) : (
              <MoonIcon boxSize={8} color="white" />
            )}
          </Button>
        </ListItem>
      </List>
    </Fragment>
  );
}
