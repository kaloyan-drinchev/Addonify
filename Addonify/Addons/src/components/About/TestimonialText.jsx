import { Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

function TestimonialText({ children }) {
  return (
    <Text textAlign="center" color="white" fontSize="lg" maxW="300px">
      {children}
    </Text>
  );
}

export default TestimonialText;
TestimonialText.propTypes = {
  children: PropTypes.node.isRequired,
};
