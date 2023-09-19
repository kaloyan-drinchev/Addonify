import { ListItem, List, Divider, Text, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import GetAddons from "./GetAddons";
import { getSortedAddons } from "../../services/addonServices";
import "./TrendingNewestFeaturedData.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { ArrowUpIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";

const TrendingNewestFeaturedData = () => {
  const [sorted, setSorted] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    try {
      getSortedAddons().then(setSorted);
    } catch (e) {
      navigate("*");
    }
  }, []);
  const handleScrollClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <List>
      {sorted && (
        <InfiniteScroll
          dataLength={sorted}
          style={{ overflow: "hidden" }}
          endMessage={
            <Text textAlign="center" fontSize="lg">
              <Button onClick={handleScrollClick} variant="ghost">
                Back to top <ArrowUpIcon ml="8px" boxSize={5} />
              </Button>
            </Text>
          }
        >
          {sorted &&
            Object.entries(sorted).map(([title, addons]) => (
              <ListItem key={title} marginBottom="80px" width="100%">
                <Divider
                  borderWidth="2px"
                  marginTop="10px"
                  borderRadius={5}
                  _light={{ borderColor: "purple.500" }}
                  _dark={{ borderColor: "teal.200" }}
                />
                <GetAddons addons={addons} title={title} />
              </ListItem>
            ))}
        </InfiniteScroll>
      )}
    </List>
  );
};

export default TrendingNewestFeaturedData;
