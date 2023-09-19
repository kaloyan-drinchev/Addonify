import { Box, Flex, Text, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function TestimonialAvatar({ src, name, title }) {
  return (
    <Flex align="center" mt={8} direction="column">
      <Box borderRadius="50%" overflow="hidden" mb={2} boxSize="300px">
        <Image src={src} alt={name} w="100%" h="100%" objectFit="cover" />
      </Box>
      <Flex direction="column" alignItems="center">
        <Text fontWeight={600}>{name}</Text>
        <Text
          fontSize="lg"
          _dark={{ color: "white" }}
          _light={{ color: "black" }}
        >
          {title}
        </Text>
      </Flex>
    </Flex>
  );
}
TestimonialAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
