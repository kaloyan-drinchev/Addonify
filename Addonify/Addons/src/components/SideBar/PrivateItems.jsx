import {
  AddIcon,
  AtSignIcon,
  NotAllowedIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { Button, Icon, Image, ListItem, Text } from "@chakra-ui/react";
import { BsLightbulb } from "react-icons/bs";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import newsFeed from "../../assets/8113077.png";
import adminVerifyUsersLogo from "../../assets/561470-200.png";
import { bool, object } from "prop-types";
import { MdSupervisorAccount } from "react-icons/md";

const PrivateItems = ({ isAdmin, isBlocked, colors }) => {
  const { bgColor, bgColorHover } = colors;

  return (
    <Fragment>
      <ListItem>
        <Button
          as={NavLink}
          to="/newsFeed"
          bgColor={bgColor}
          color="white"
          size="lg"
          justifyContent="flex-start"
          _hover={{
            bgColor: bgColorHover,
          }}
        >
          <Image
            src={newsFeed}
            color="white"
            boxSize={8}
            style={{ filter: "invert(1) grayscale(100%)" }}
          ></Image>
          <Text marginLeft="5px" fontSize="xl">
            News Feed
          </Text>
        </Button>
      </ListItem>
      {!isBlocked ? (
        <ListItem>
          <Button
            as={NavLink}
            to="/addon-ideas"
            bgColor={bgColor}
            color="white"
            size="lg"
            fontSize="xl"
            justifyContent="flex-start"
            leftIcon={<Icon as={BsLightbulb} color="white" boxSize={8} />}
            _hover={{
              bgColor: bgColorHover,
            }}
          >
            Add-on Ideas
          </Button>
        </ListItem>
      ) : (
        <ListItem>
          <Button
            bgColor={bgColor}
            color="red"
            size="lg"
            fontSize="xl"
            justifyContent="flex-start"
            leftIcon={<NotAllowedIcon color="red" boxSize={8} />}
            _hover={{
              bgColor: bgColorHover,
            }}
          >
            Add-on Ideas
          </Button>
        </ListItem>
      )}
      {isAdmin && (
        <Fragment>
          <ListItem>
            <Button
              as={NavLink}
              to="/adminVerifyUsers"
              bgColor={bgColor}
              color="white"
              size="lg"
              justifyContent="flex-start"
              _hover={{
                bgColor: bgColorHover,
              }}
            >
              <Image
                src={adminVerifyUsersLogo}
                color="white"
                boxSize={8}
                style={{ filter: "invert(1) grayscale(100%)" }}
              ></Image>
              <Text marginLeft="5px" fontSize="xl">
                Verify Users
              </Text>
            </Button>
          </ListItem>
          <ListItem>
            <Button
              as={NavLink}
              to="/adminSearchUsers"
              bgColor={bgColor}
              color="white"
              size="lg"
              fontSize="xl"
              justifyContent="flex-start"
              leftIcon={<SearchIcon color="white" boxSize={8} />}
              _hover={{
                bgColor: bgColorHover,
              }}
            >
              Users Dashboard
            </Button>
          </ListItem>
        </Fragment>
      )}
      <ListItem>
        <Button
          as={NavLink}
          to="/profile"
          bgColor={bgColor}
          color="white"
          size="lg"
          fontSize="xl"
          justifyContent="flex-start"
          leftIcon={<AtSignIcon color="white" boxSize={8} />}
          _hover={{
            bgColor: bgColorHover,
          }}
        >
          Profile
        </Button>
      </ListItem>
      <ListItem>
        <Button
          as={NavLink}
          to="/about"
          bgColor={bgColor}
          color="white"
          size="lg"
          fontSize="xl"
          justifyContent="flex-start"
          leftIcon={<Icon as={MdSupervisorAccount} boxSize={8} />}
          _hover={{
            bgColor: bgColorHover,
          }}
        >
          About us
        </Button>
      </ListItem>
      {!isBlocked ? (
        <ListItem>
          <Button
            // mt="100px"
            py={10}
            as={NavLink}
            to="/create"
            _light={{ bgColor: "purple.600" }}
            _dark={{ bgColor: "gray.700" }}
            color="white"
            size="lg"
            fontWeight="bold"
            fontSize="xl"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            leftIcon={<AddIcon color="white" boxSize={8} />}
            _hover={{
              _dark: { bgColor: "teal.300" },
              _light: { bgColor: "purple.500" },
            }}
          >
            Create Add-on
          </Button>
        </ListItem>
      ) : (
        <ListItem>
          <Button
            bgColor={bgColor}
            color="red"
            size="lg"
            justifyContent="flex-start"
            leftIcon={<NotAllowedIcon color="red" />}
            _hover={{
              bgColor: bgColorHover,
            }}
          >
            New Add-on
          </Button>
        </ListItem>
      )}
    </Fragment>
  );
};
export default PrivateItems;

PrivateItems.propTypes = {
  isAdmin: bool,
  isBlocked: bool,
  colors: object,
};
