import { Image, MenuItem } from "@chakra-ui/react";
import { array } from "prop-types";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";

const DropDownOptions = ({ addons }) => {
  return (
    <Fragment>
      {addons.map((pendingAddon) => (
        <NavLink
          to={`/single-addon-view/${pendingAddon.key}`}
          state={pendingAddon}
          key={pendingAddon.key}
        >
          <MenuItem
            minH="48px"
            bgColor="purple.300"
            _dark={{ bgColor: "teal" }}
            my={2}
            color="white"
            borderRadius={3}
            transition="0.2s ease-in-out"
            _hover={{
              transform: "scale(1.05)",
              bgColor: "gray.300",
              _dark: { bgColor: "teal.300" },
            }}
          >
            <Image
              boxSize="2rem"
              borderRadius="full"
              src={pendingAddon.avatar}
              alt="Fluffybuns the destroyer"
              mr="12px"
            />
            <span>{pendingAddon.name}</span>
          </MenuItem>
        </NavLink>
      ))}
      <NavLink to={"adminRequests"}>
        <MenuItem
          minH="10px"
          bgColor="gray.300"
          my={2}
          fontWeight={"bold"}
          justifyContent={"center"}
          transition="0.2s ease-in-out"
          _hover={{
            transform: "scale(1.05)",
          }}
          _dark={{
            bgColor: "teal.400",
            bg: "gray.500",
            borderTopColor: "teal.400",
          }}
        >
          See all
        </MenuItem>
      </NavLink>
    </Fragment>
  );
};
export default DropDownOptions;

DropDownOptions.propTypes = {
  addons: array,
};
