import ReactPaginate from "react-paginate";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, useColorModeValue, Flex } from "@chakra-ui/react";
import { get, ref } from "firebase/database";
import { db } from "../../../firebaseConfig/config";
import { array, func } from "prop-types";
import { changePage } from "../../utils/helpers";

const GetTags = ({ tags, setAddonData, backButton, shownStatus }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const elementsPerPage = 5;

  const pageCount = Math.ceil(tags.length / elementsPerPage);

  const handleTagClick = async (tag) => {
    const getRef = ref(db, "add-ons");
    const snapshot = await get(getRef);
    const gatheredAddons = [];
    snapshot.forEach((addon) => {
      if (
        addon.val().approvalStatus === "approved" &&
        addon.val().tags.includes(tag)
      ) {
        const adjustAddon = {
          ...addon.val(),
          key: addon.key,
        };
        gatheredAddons.push(adjustAddon);
      }
    });
    setAddonData(gatheredAddons);
    backButton(true);
    shownStatus(false);
  };

  return (
    <Box marginTop="20px">
      <Box
        display="flex"
        flexDirection="row"
        gap="15px"
        justifyContent="center"
        marginTop="20px"
      >
        <ReactPaginate
          onPageChange={(e) => changePage(e, setCurrentPage)}
          pageRangeDisplayed={0}
          marginPagesDisplayed={0}
          pageCount={pageCount}
          nextLabel={null}
          previousLabel={null}
          pageClassName="page-item-dashboard"
          pageLinkClassName="page-link-dashboard"
          previousClassName="previous-page-item-dashboard"
          nextClassName="next-page-item-dashboard"
          breakLabel="..."
          breakClassName="page-item-dashboard"
          breakLinkClassName="page-link-dashboard"
          containerClassName="pagination-dashboard"
          activeClassName="activatedPage-dashboard"
          renderOnZeroPageCount={null}
        />
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          alignItems="center"
          flexWrap="wrap"
        >
          <Button
            _hover={{ bgColor: useColorModeValue("purple.300", "teal.400") }}
            isDisabled={currentPage - 1 < 0 ? true : false}
            alignSelf="center"
            cursor="pointer"
            onClick={() =>
              changePage({ selected: currentPage - 1 }, setCurrentPage)
            }
            mb={2}
          >
            <ArrowLeftIcon />
          </Button>
          {tags
            .slice(
              currentPage * elementsPerPage,
              (currentPage + 1) * elementsPerPage
            )
            .map((item, index) => {
              return (
                <Box key={index} mb={2} ml={2}>
                  <Button
                    onClick={() => handleTagClick(item)}
                    _dark={{ bgColor: "gray.250" }}
                    _hover={{
                      transform: "scale(1.1)",
                      _dark: { bgColor: "teal.400" },
                      _light: { bgColor: "purple.300", color: "white" },
                    }}
                  >
                    <Box>{item}</Box>
                  </Button>
                </Box>
              );
            })}
          <Button
            _hover={{ bgColor: "purple.300", _dark: { bgColor: "teal.400" } }}
            isDisabled={currentPage + 1 >= pageCount ? true : false}
            alignSelf="center"
            cursor="pointer"
            onClick={() =>
              changePage({ selected: currentPage + 1 }, setCurrentPage)
            }
            mb={2}
            ml={2}
          >
            <ArrowRightIcon />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default GetTags;

GetTags.propTypes = {
  tags: array,
  setAddonData: func,
  backButton: func,
  shownStatus: func,
};
