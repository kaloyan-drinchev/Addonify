import { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig/config";
import { get, ref } from "firebase/database";
import { Avatar, Box, Text, Flex, Heading } from "@chakra-ui/react";
import { array } from "prop-types";
const GetMatchingTags = ({ keyword }) => {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    const getAddonsData = async () => {
      const getRef = ref(db, "add-ons");
      const collectedData = await get(getRef);
      const dataContainer = [];
      collectedData.forEach((addon) => {
        if (
          addon.val().tags.includes(keyword) &&
          addon.val().approvalStatus === "approved"
        ) {
          const adjustAddon = {
            ...addon.val(),
            key: addon.key,
          };
          dataContainer.push(adjustAddon);
        }
      });
      setAddons(dataContainer);
    };
    getAddonsData();
  }, []);

  return (
    <Box>
      {addons && addons.length > 0 ? (
        <Box>
          {addons.map((addon) => {
            return (
              <Flex
                flexDirection="row"
                key={addon.key}
                _dark={{ textColor: "black" }}
              >
                <Avatar src={addon.avatar} height="30px" width="30px"></Avatar>
                <Text>
                  {addon.name} by {addon.authorUsername}.
                </Text>
              </Flex>
            );
          })}
        </Box>
      ) : (
        <Heading size="sm">
          Sorry, i couldn't find potential suggestions.
        </Heading>
      )}
    </Box>
  );
};
export default GetMatchingTags;

GetMatchingTags.propTypes = {
  keyword: array,
};
