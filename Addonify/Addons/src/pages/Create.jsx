import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  Spinner,
  Divider,
  useColorModeValue,
  NumberInput,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { loadStripe } from "@stripe/stripe-js";
import { SmallCloseIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { Form, useNavigate } from "react-router-dom";
import { useState } from "react";
import { auth, db, storage } from "../../firebaseConfig/config";
import { set, ref, push } from "firebase/database";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { IoEllipseSharp } from "react-icons/io5";
import { useUserContext } from "../AppInitializers";
export default function Create() {
  const toast = useToast();
  const stripePromise = loadStripe(
    "pk_test_51NlcfAFzJC2ea4fLm5CQIM55yUJGiwpxDfuzzDLq1M6pc8ldCr8GUwxdnWnhqCvHx4cV06TSYlPV3gqXiX7J3CM7008nDtykZy"
  );
  const [descriptionValue, setDescriptionValue] = useState(false);
  const [isAddonTrending, setTrendingStatus] = useState(false);
  const [activeSpinner, setSpinnerStatus] = useState(false);
  const [avatarValue, setAvatarValue] = useState(false);
  const [tittleValue, setTitleValue] = useState(false);
  const [addonValue, setAddonValue] = useState(false);
  const [tagValue, setTagValue] = useState(false);
  const [linkValue, setLinkValue] = useState(false);
  const [successMessage, setMessageStatus] = useState(false);
  const [errorMessage, setErrorMessageStatus] = useState(false);
  const [addonTags, setTags] = useState([]);
  const [addonAvatar, setAvatar] = useState(null);
  const [addOn, setAddOn] = useState(null);
  const [addTags, saveTag] = useState("");
  const [addonName, setAddonName] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [addonFileName, setAddonFileName] = useState("");
  const [addonDescription, setAddonDescription] = useState("");
  const [repositoryMainLink, setRepositoryMainLink] = useState("");
  const [repositoryFetchLink, setRepositoryFetchLink] = useState("");
  const [isAddonPaid, setPaidStatus] = useState(false);
  const [productPrice, setProductPrice] = useState(0);
  const { userData } = useUserContext();
  const navigate = useNavigate();
  const setName = (value) => {
    setAddonName(value);
    if (value.length < 3 || value.length > 30) {
      setTitleValue(true);
    } else {
      setTitleValue(false);
    }
  };
  const createProduct = async () => {
    const stripe = await stripePromise;
    try {
      const productResponse = await fetch(
        "https://api.stripe.com/v1/products",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer sk_test_51NlcfAFzJC2ea4fLGOmxXhtqVO5YQ4L9WdV6Id45FJ7ymoo42QPTz47UGmgd2nMAVvqQsB163zFjcJPWCS9w2fhh00Ikl1EGe8`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `name=${addonName}`,
        }
      );

      if (!productResponse.ok) {
        console.error("Error creating product:", productResponse.statusText);
        return;
      }

      const productData = await productResponse.json();

      const priceResponse = await fetch("https://api.stripe.com/v1/prices", {
        method: "POST",
        headers: {
          Authorization: `Bearer sk_test_51NlcfAFzJC2ea4fLGOmxXhtqVO5YQ4L9WdV6Id45FJ7ymoo42QPTz47UGmgd2nMAVvqQsB163zFjcJPWCS9w2fhh00Ikl1EGe8`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `unit_amount=${productPrice}&currency=usd&product=${productData.id}`,
      });

      if (!priceResponse.ok) {
        console.error("Error creating price:", priceResponse.statusText);
        return;
      }
      const priceData = await priceResponse.json();
      return priceData.id;
    } catch (error) {
      console.error("Error creating product and price:", error);
    }
  };

  const handlePriceChange = (valueString) => {
    const newValue = valueString;
    if (!isNaN(newValue)) {
      setProductPrice((newValue * 100).toFixed(0));
    }
  };

  const setLink = async (event) => {
    const regex = /^(https?:\/\/)?(www\.)?(github\.com)(:[0-9]+)?(\/[^\s]*)?$/;
    function isValidGitHubApiLink(link) {
      return regex.test(link);
    }
    if (isValidGitHubApiLink(event.target.value)) {
      setRepositoryMainLink(`${event.target.value}`);
      const transformLink = event.target.value.split("/");
      const owner = transformLink[3];
      const repo = transformLink[4];
      setRepositoryFetchLink(`https://api.github.com/repos/${owner}/${repo}`);
      setLinkValue(false);
    } else {
      setLinkValue(true);
    }
  };

  const setAvName = (value) => {
    setAvatarName(value);
  };

  const setDescription = (value) => {
    setAddonDescription(value);
    if (value.length > 0) {
      setDescriptionValue(false);
    }
  };
  const handleAddTag = () => {
    if (!addonTags.includes(addTags)) {
      setTags([...addonTags, addTags]);
    }
    setTagValue(false);
    document.getElementById("manageField").value = "";
  };
  const handleRemoveTag = (element) => {
    const newArr = addonTags.filter((e) => e !== element);
    setTags([...newArr]);
    if (newArr.length === 0) {
      setTagValue(true);
    }
  };
  const setTrending = () => {
    setTrendingStatus(!isAddonTrending);
  };
  const handleAvatar = async (file) => {
    setAvatar(file.target.files[0]);
    setAvatarValue(false);
  };
  const handleAddOn = (file) => {
    setAddOn(file.target.files[0]);
    setAddonValue(false);
  };
  const changeMessageStatus = () => {
    setMessageStatus(!successMessage);
  };
  const changeErrorMessageStatus = () => {
    setErrorMessageStatus(!errorMessage);
  };
  const uploadToFirebase = async (extensionName, downloadUrl, avatarLink) => {
    try {
      const getRef = ref(db, `add-ons`);
      const pushRef = push(getRef);
      const data = {
        name: addonName,
        avatar: `${avatarLink}`,
        description: addonDescription,
        trending: isAddonTrending,
        tags: addonTags,
        authorUsername: userData.userName,
        authorUID: auth.currentUser.uid,
        dateCreated: new Date().toLocaleDateString(),
        lastUpdate: new Date().toLocaleDateString(),
        downloadLink: `${downloadUrl}`,
        downloads: 0,
        // reviews: [0],
        approvalStatus: "pending",
        GitHubInformation: {
          fetchLink: `${repositoryFetchLink}`,
          pullCountLink: `${repositoryFetchLink}/pulls`,
        },
        isPaid: isAddonPaid,
        productPrice: `${(productPrice / 100).toFixed(2)}`,
        productId: await createProduct(),
      };
      await set(pushRef, data);
    } catch (e) {
      console.error(e);
    }
    setSpinnerStatus(false);
    setTimeout(function () {
      window.location.reload();
    }, 3000);

    toast({
      position: "top-right",
      title: "Success.",
      description: "Your plugin is sent for review!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleFileUpload = async () => {
    if (addonName.length === 0) {
      setTitleValue(true);
      return;
    }
    if (!addonAvatar) {
      setAvatarValue(true);
      return;
    }
    if (!addonDescription) {
      setDescriptionValue(true);
      return;
    }
    if (!addOn) {
      setAddonValue(true);
      return;
    }
    if (linkValue) {
      setLinkValue(true);
      return;
    }
    if (addonTags.length === 0) {
      setTagValue(true);
      return;
    }
    setSpinnerStatus(true);
    const owner = "KrasenTelerik";
    const repo = "Addonis";
    const authToken = "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";

    const remotePath = `addOns/${addonName}/${addOn.name}`;

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${remotePath}`;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileContent = event.target.result.split(",")[1];

      const commitMessage = `Add ${remotePath}`;

      const body = {
        message: commitMessage,
        content: fileContent,
      };

      const headers = new Headers({
        Authorization: `token ${authToken}`,
        "Content-Type": "application/json",
      });

      try {
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const avatarRef = sRef(storage, `addonAvatars/${addonAvatar.name}`);
          const snapshot = await uploadBytes(avatarRef, addonAvatar);
          const avatarURL = await getDownloadURL(avatarRef);
          await fetch(`${response.url}`)
            .then((response) => response.json())
            .then((data) => {
              uploadToFirebase(addOn.name, data.download_url, avatarURL);
            });
        } else {
          const errorData = await response.json();
          setSpinnerStatus(false);
          toast({
            position: "top-right",
            title: "An error occurred.",
            description: "Unable to create add-on, please retry.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      } catch (error) {
        setSpinnerStatus(false);
        console.error("An error occurred:", error);
      }
    };
    reader.readAsDataURL(addOn);
  };

  return (
    <Box maxW="480px">
      <Form onSubmit={handleFileUpload}>
        <FormControl isRequired mb="40px">
          <FormLabel>Add-on name:</FormLabel>
          <Input
            isInvalid={tittleValue}
            type="text"
            name="title"
            onChange={(e) => setName(e.target.value)}
          />
          {tittleValue && addonName && (
            <FormHelperText color="red" fontWeight="bold">
              Add-on name must be between 3 and 30 characters.
            </FormHelperText>
          )}
          <FormHelperText>Enter the name of the extension</FormHelperText>
        </FormControl>
        <FormControl isRequired mb="40px">
          <FormLabel>Add-on Avatar:</FormLabel>
          <Input
            type="file"
            display="none"
            onChange={(e) => {
              return handleAvatar(e), setAvName(e.target.value);
            }}
            id="avatar-input"
          />
          <label htmlFor="avatar-input">
            <Button
              as="span"
              bgColor={useColorModeValue("purple.400", "teal.500")}
              color="white"
              _hover={{
                bgColor: useColorModeValue("purple.300", "teal.300"),
              }}
              size="sm"
            >
              Choose Image
            </Button>
          </label>
          <Box ml={2} display="inline">
            {avatarName && <span>{avatarName}</span>}
          </Box>
          {avatarValue ? (
            <FormHelperText color="red" fontWeight="bold">
              Please upload a file!
            </FormHelperText>
          ) : (
            <FormHelperText>Upload an avatar for the extension</FormHelperText>
          )}
        </FormControl>
        <FormControl isRequired mb="40px">
          <FormLabel>Add-on Description</FormLabel>
          <Textarea
            placeholder="Enter a detailed description for the extension..."
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            borderColor={descriptionValue ? "red" : "none"}
          />
          {descriptionValue && (
            <FormHelperText color="red" fontWeight="bold">
              Please include a description.
            </FormHelperText>
          )}
        </FormControl>
        <FormControl isRequired mb="40px">
          <FormLabel>Upload File:</FormLabel>
          <Input
            type="file"
            display="none"
            onChange={(e) => {
              return handleAddOn(e), setAddonFileName(e.target.value);
            }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button
              as="span"
              bgColor={useColorModeValue("purple.400", "teal.500")}
              color="white"
              _hover={{
                bgColor: useColorModeValue("purple.300", "teal.300"),
              }}
              size="sm"
            >
              Choose File
            </Button>
          </label>
          <Box ml={2} display="inline">
            {addonFileName && <span>{addonFileName}</span>}
          </Box>
          {addonValue ? (
            <FormHelperText color="red" fontWeight="bold">
              Please upload a file!
            </FormHelperText>
          ) : (
            <FormHelperText>Upload the file extension</FormHelperText>
          )}
        </FormControl>
        <FormControl isRequired mb="40px">
          <FormLabel>GitHub Repository Link:</FormLabel>
          <Input
            isInvalid={linkValue}
            type="text"
            name="title"
            onChange={(e) => setLink(e)}
          />
          {linkValue && (
            <FormHelperText color="red" fontWeight="bold">
              Missing or invalid repository link!
            </FormHelperText>
          )}
          <FormHelperText>Paste your GitHub repository link.</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Add Tags:</FormLabel>
          <Box display="flex">
            <Input
              isInvalid={tagValue}
              type="text"
              onChange={(e) => saveTag(e.target.value)}
              id="manageField"
            ></Input>
            <Button
              bgColor={useColorModeValue("purple.400", "teal.500")}
              color="white"
              _hover={{
                bgColor: useColorModeValue("purple.300", "teal.300"),
              }}
              onClick={handleAddTag}
            >
              Add
            </Button>
          </Box>
          {tagValue && (
            <FormHelperText color="red" fontWeight="bold">
              Please include at least one tag.
            </FormHelperText>
          )}
          <Box display="flex" gap="10px">
            {addonTags.length === 0 ? (
              <FormHelperText>Add tags describing your Add-on</FormHelperText>
            ) : (
              addonTags.map((item, index) => (
                <FormHelperText key={index}>
                  <Button onClick={() => handleRemoveTag(item)}>
                    <Box>{item}</Box>
                    <SmallCloseIcon />
                  </Button>
                </FormHelperText>
              ))
            )}
          </Box>
        </FormControl>
        <Divider margin="20px" />
        <FormControl display="flex" alignItems="center">
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            size="lg"
            bgColor={useColorModeValue("unset", "unset")}
            onChange={() => setTrending()}
          />
          <FormLabel mb="0" ml="10px">
            Make this a trending Add-on
          </FormLabel>
        </FormControl>
        <Divider margin="20px" />
        <FormControl display="flex" alignItems="center">
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isDisabled={userData.isVerified ? false : true}
            size="lg"
            bgColor={useColorModeValue("unset", "unset")}
            onChange={() => setPaidStatus(!isAddonPaid)}
          />
          <FormLabel mb="0" ml="10px">
            Make this a Paid Add-on?
          </FormLabel>
          <Tooltip label="Available for verified users only." fontSize="lg">
            <QuestionOutlineIcon size="lg" />
          </Tooltip>
        </FormControl>
        {isAddonPaid && (
          <NumberInput
            defaultValue={productPrice}
            precision={2}
            step={0.2}
            onChange={handlePriceChange}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        )}
        <Button
          type="button"
          onClick={handleFileUpload}
          bgColor={useColorModeValue("purple.400", "teal.500")}
          color="white"
          _hover={{
            bgColor: useColorModeValue("purple.300", "teal.300"),
          }}
          mt={3}
          px={10}
          py={6}
        >
          Submit
        </Button>
        {activeSpinner && (
          <Spinner
            marginLeft="30px"
            marginTop="10px"
            thickness="5px"
            color="purple.400"
          ></Spinner>
        )}
      </Form>
    </Box>
  );
}
