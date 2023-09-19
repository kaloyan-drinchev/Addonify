import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function TestimonialContent({ children }) {
  return (
    <Box
      _dark={{ bgColor: "teal" }}
      _light={{ bgColor: "purple.400" }}
      boxShadow="lg"
      padding="8px"
      borderRadius="xl"
      textAlign="center"
      position="relative"
    >
      {children}
      <Box
        content=""
        width={0}
        height={0}
        borderLeft="solid transparent"
        borderLeftWidth={16}
        borderRight="solid transparent"
        borderRightWidth={16}
        borderTop="solid"
        borderTopWidth={16}
        position="absolute"
        bottom="-16px"
        left="50%"
        _dark={{ borderTopColor: "teal" }}
        _light={{ borderTopColor: "purple.400" }}
        transform="translateX(-50%)"
      ></Box>
    </Box>
  );
}
TestimonialContent.propTypes = {
  children: PropTypes.node.isRequired,
};
