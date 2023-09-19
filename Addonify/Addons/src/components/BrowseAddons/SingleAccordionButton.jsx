import { AccordionButton } from "@chakra-ui/react";
import { func, string } from "prop-types";

const SingleAccordionButton = ({
  bgColor,
  sortingOption,
  title,
  onSortOptionSelect,
}) => {
  return (
    <AccordionButton
      _hover={{
        bgColor: bgColor,
        color: "white",
      }}
      onClick={() => onSortOptionSelect(sortingOption)}
    >
      {title}
    </AccordionButton>
  );
};
export default SingleAccordionButton;

SingleAccordionButton.propTypes = {
  bgColor: string,
  sortingOption: string,
  title: string,
  onSortOptionSelect: func,
};
