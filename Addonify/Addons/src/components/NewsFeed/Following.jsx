/* eslint-disable react-hooks/exhaustive-deps */
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import verifiedLogo from "../../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png";
import { NavLink } from "react-router-dom";
import { useUserContext } from "../../AppInitializers";
import { getFollowersCount } from "../../services/userServices";
import { useEffect, useState } from "react";

const Following = () => {
  const { userData } = useUserContext();
  const [followers, setFollowers] = useState([]);
  const [followersProfiles, setFollowersProfiles] = useState([]);
  useEffect(() => {
    getFollowersCount(userData, setFollowers, setFollowersProfiles);
  }, []);

  return (
    <SimpleGrid>
      <Heading>
        Following:
        <Accordion marginTop="50px">
          {followersProfiles &&
            followersProfiles.map((user, index) => {
              return (
                <NavLink
                  key={user.userID}
                  to={`../view-user/${user.userID}`}
                  state={user.userID}
                >
                  <AccordionItem>
                    <AccordionButton
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Flex>
                        <Image src={user.avatar} width="50px" />
                      </Flex>
                      <SimpleGrid>
                        <Text display="inline-flex">
                          {user.userName}
                          {user.isVerified && (
                            <Image
                              src={verifiedLogo}
                              height="15px"
                              width="20px"
                              display="flex"
                              alignSelf="center"
                              _dark={{
                                filter:
                                  "invert(14%) sepia(98%) saturate(3728%) hue-rotate(172deg) brightness(110%) contrast(122%)",
                              }}
                            ></Image>
                          )}
                        </Text>
                        {followers ? (
                          <Text>{followers[index]} followers</Text>
                        ) : (
                          <Text>No followers</Text>
                        )}
                      </SimpleGrid>
                    </AccordionButton>
                  </AccordionItem>
                </NavLink>
              );
            })}
        </Accordion>
      </Heading>
    </SimpleGrid>
  );
};
export default Following;
