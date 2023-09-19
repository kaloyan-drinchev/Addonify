import { useState, useEffect } from "react";
import { Box, Flex, Avatar, Text } from "@chakra-ui/react";
import { getSotedUsersByFollowers } from "../../services/userServices";
const PopularCreators = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getSotedUsersByFollowers().then(setUserData);
  }, []);

  return (
    <Box>
      {userData &&
        userData.map((user) => {
          return (
            <Flex
              flexDirection="row"
              key={user.key}
              _dark={{ textColor: "black" }}
            >
              <Avatar src={user.avatar} height="30px" width="30px"></Avatar>
              <Text ml="5px">
                {user.userName} followers: {user.followers.length}.
              </Text>
            </Flex>
          );
        })}
    </Box>
  );
};

export default PopularCreators;
