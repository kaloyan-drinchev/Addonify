import { useEffect } from "react";
import {
  Heading,
  SimpleGrid,
  Button,
  useColorModeValue,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { DownloadIcon } from "@chakra-ui/icons";
import { CheckIcon } from "@chakra-ui/icons";
import { ref, get, update } from "firebase/database";
import { showToastSuccess } from "../utils/toasts";
import { db } from "../../firebaseConfig/config";
import { useUserContext } from "../AppInitializers";
import { notificationProps } from "../services/notificationServices";
const SuccessPurchasePage = () => {
  const [addonData, setAddonData] = useState({});
  const { userData } = useUserContext();
  const toast = useToast();
  const bgColor = useColorModeValue("purple.400", "purple.500");
  const bgColorHover = useColorModeValue("purple.300", "teal.400");
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const gatheredData = urlParams.get("dataForTransfer");
    const transformData = JSON.parse(gatheredData);
    setAddonData({
      ...transformData,
    });
  }, []);

  const downloadIncrement = async () => {
    const userRef = ref(db, `add-ons/${addonData.addonKey}`);
    const addon = await get(userRef);
    const downloadsCount = addon.val().downloads;
    await update(userRef, { downloads: downloadsCount + 1 });
    showToastSuccess(
      toast,
      "Downloaded!",
      "Successfully downloaded Addon",
      <CheckIcon />
    );
    notificationProps(
      "downloaded",
      userData,
      addonData.addonAuthor,
      addonData.addonKey
    );
  };
  return (
    <SimpleGrid>
      <Heading>Thank you for your purchase!</Heading>
      <Text>You can find your download link here below:</Text>
      {addonData && (
        <Button
          as="a"
          href={addonData.downloadLink}
          leftIcon={<DownloadIcon />}
          mt="18px"
          bgColor={bgColor}
          color="white"
          _hover={{ bgColor: bgColorHover }}
          onClick={downloadIncrement}
        >
          Download
        </Button>
      )}
    </SimpleGrid>
  );
};
export default SuccessPurchasePage;
