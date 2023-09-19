import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { func } from "prop-types";
import { sortingUserOptions } from "../../utils/helpers";
import SingleAccordionButton from "./SingleAccordionButton";

const SortingModal = ({ onClose, onSortOptionSelect }) => {
  const bgColorPurple = useColorModeValue("purple.400", "teal.700");
  const bgColorYellow = useColorModeValue("yellow.400", "teal.400");

  return (
    <Accordion>
      <AccordionItem className="modal-content">
        <Heading marginLeft="40%">Sort users by:</Heading>
        {Object.entries(sortingUserOptions).map(([option, title], i) => (
          <SingleAccordionButton
            key={i}
            bgColor={i % 2 ? bgColorYellow : bgColorPurple}
            sortingOption={option}
            title={title}
            onSortOptionSelect={onSortOptionSelect}
          />
        ))}
        <AccordionButton
          _hover={{
            bgColor: bgColorPurple,
            color: "white",
          }}
          fontWeight="extrabold"
          onClick={onClose}
        >
          Close
        </AccordionButton>
      </AccordionItem>
    </Accordion>
  );
};

export default SortingModal;

SortingModal.propTypes = {
  onClose: func,
  onSortOptionSelect: func,
};
