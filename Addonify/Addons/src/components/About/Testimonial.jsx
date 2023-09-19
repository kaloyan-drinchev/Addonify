import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function Testimonial({ children }) {
  return <Box>{children}</Box>;
}
Testimonial.propTypes = {
  children: PropTypes.node.isRequired,
};
