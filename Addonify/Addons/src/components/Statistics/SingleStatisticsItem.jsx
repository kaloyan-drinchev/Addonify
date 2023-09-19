import { Box, Image, ListItem, Text } from "@chakra-ui/react";
import { number, object } from "prop-types";

const SingleStatisticsItem = ({ addon, index }) => {
  return (
    <ListItem
      mt="3"
      justifyContent="center"
      key={addon.key}
      display="flex"
      gap="5px"
    >
      <Text fontSize="2xl" alignSelf="center">
        {index + 1}
      </Text>
      <Image
        src={addon.avatar}
        width="30px"
        height="25px"
        alignSelf="center"
      ></Image>
      <Box fontSize="xl" wordBreak="break-word">
        {addon.name}
      </Box>
    </ListItem>
  );
};
export default SingleStatisticsItem;

SingleStatisticsItem.propTypes = {
  addon: object,
  index: number,
};
