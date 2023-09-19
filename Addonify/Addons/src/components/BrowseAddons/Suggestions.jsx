import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Image,
  Text,
} from "@chakra-ui/react";
import { array, func } from "prop-types";

const Suggestions = ({ addons, searchFunction }) => {
  return (
    <Accordion>
      <AccordionItem>
        {addons &&
          addons.map((element) => {
            return (
              <AccordionButton
                key={element.key}
                _hover={{ bgColor: "purple.400", _dark: { bgColor: "teal" } }}
                onClick={() => {
                  searchFunction(element.name);
                }}
              >
                <Image src={element.avatar} height="40px" width="40px" mr='8px'></Image>
                <Text>{element.name}</Text>
                <Text marginLeft="5px">By {element.authorUsername}</Text>
              </AccordionButton>
            );
          })}
      </AccordionItem>
    </Accordion>
  );
};
export default Suggestions;

Suggestions.propTypes = {
  addons: array,
  searchFunction: func,
};
