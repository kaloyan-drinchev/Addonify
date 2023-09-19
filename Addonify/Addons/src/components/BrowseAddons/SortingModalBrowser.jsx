import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { array, func } from "prop-types";
import { MdFilterList } from "react-icons/md";
import { sortAddons } from "../../utils/helpers";

const SortingModalBrowser = ({ addons, setAddons }) => {
  const handleSorting = (sortOption) =>
    sortAddons(sortOption, setAddons, addons);

  return (
    <Popover placement="bottom" closeOnBlur="true">
      <PopoverTrigger>
        <Button
          color="black"
          backgroundColor="transparent"
          id="filterButton"
          bgSize="cover"
          size="lg"
          bgColor="gray.250"
          _hover={{
            _dark: { bgColor: "teal.300" },
            _light: { bgColor: "purple.300" },
          }}
        >
          <Icon as={MdFilterList} w={10} h={10} _dark={{ color: "white" }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Button
          _hover={{
            bgColor: useColorModeValue("purple.400", "teal.700"),
            color: "white",
          }}
          onClick={() => handleSorting("addonnamesAZ")}
        >
          Add-on Name A-Z
        </Button>
        <Button
          _hover={{
            bgColor: useColorModeValue("yellow.400", "teal.400"),
            color: "white",
          }}
          onClick={() => handleSorting("addonnamesZA")}
        >
          Add-on Name Z-A
        </Button>
        <Button
          _hover={{
            bgColor: useColorModeValue("purple.400", "teal.700"),
            color: "white",
          }}
          onClick={() => handleSorting("createDateNewToOld")}
        >
          Date created(newest to oldest)
        </Button>
        <Button
          _hover={{
            bgColor: useColorModeValue("yellow.400", "teal.400"),
            color: "white",
          }}
          onClick={() => handleSorting("createDateOldToNew")}
        >
          Date created(older to newest)
        </Button>
        <Button
          _hover={{
            bgColor: useColorModeValue("purple.400", "teal.700"),
            color: "white",
          }}
          onClick={() => handleSorting("downloadNumber")}
        >
          Most Downloaded
        </Button>
        <Button
          _hover={{
            bgColor: useColorModeValue("yellow.400", "teal.400"),
            color: "white",
          }}
          onClick={() => handleSorting("lastUpdate")}
        >
          Last Updated
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default SortingModalBrowser;

SortingModalBrowser.propTypes = {
  addons: array,
  setAddons: func,
};
