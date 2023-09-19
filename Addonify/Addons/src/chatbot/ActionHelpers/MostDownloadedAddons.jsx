import { useState, useEffect } from "react";
import { Box, Avatar, Text, Flex } from "@chakra-ui/react";
import { getSortedAddonsByDownloads } from "../../services/addonServices";
const MostDownloadedAddons = () => {
  const [addon, setAddons] = useState([]);

  useEffect(() => {
    getSortedAddonsByDownloads().then(setAddons);
  }, []);

  return (
    <Box>
      {addon &&
        addon.map((addon) => {
          return (
            <Flex
              flexDirection="row"
              key={addon.key}
              _dark={{ textColor: "black" }}
            >
              <Avatar src={addon.avatar} height="30px" width="30px"></Avatar>
              <Text>
                {addon.name} by {addon.authorUsername} downloaded
                {addon.downloads} times.
              </Text>
            </Flex>
          );
        })}
    </Box>
  );
};
export default MostDownloadedAddons;
