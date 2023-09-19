import { Fragment, useEffect, useState } from "react";
import { useUserContext } from "../../AppInitializers";
import SingleAddonUser from "./SingleAddonUser";
import { Box, Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { getAddonsByUsername } from "../../services/addonServices";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function UserAddons() {
  const { userData } = useUserContext();
  const [addons, setAddons] = useState([]);
  const bgColorHover = useColorModeValue("purple.100", "teal.800");
  const navigation = useNavigate();

  useEffect(() => {
    getAddonsByUsername(userData.userName).then(setAddons);
  }, [userData.userName]);
  return (
    <Fragment>
      <Flex justifyContent="center">
        {addons.length > 0 ? (
          addons.map((addon) => (
            <SingleAddonUser key={addon.name} addon={addon} />
          ))
        ) : (
          <Box>
            <Button
              _hover={{ bgColor: bgColorHover }}
              cursor="pointer"
              variant="ghost"
              fontSize="3xl"
              mt="20%"
              leftIcon={<AiOutlineCloudUpload />}
              onClick={() => navigation("/create")}
            >
              Click HERE to upload your first Add-on
            </Button>
          </Box>
        )}
      </Flex>
    </Fragment>
  );
}
