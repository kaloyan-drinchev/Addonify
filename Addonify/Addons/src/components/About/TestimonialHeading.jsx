import { Box, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function TestimonialHeading({ children }) {
  return (
    <Box>
      <Text fontSize="3xl">{children}</Text>
    </Box>
  );
}
TestimonialHeading.propTypes = {
  children: PropTypes.node.isRequired,
};
