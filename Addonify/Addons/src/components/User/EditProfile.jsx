import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
  useColorModeValue,
  useToast,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import {
  CheckIcon,
  DeleteIcon,
  EmailIcon,
  InfoIcon,
  LockIcon,
  NotAllowedIcon,
  PhoneIcon,
  RepeatIcon,
  SettingsIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { Fragment, useEffect, useRef, useState } from "react";
import { db } from "../../../firebaseConfig/config.js";
import { uploadUserAvatar } from "../../services/userServices.js";
import { deleteUser, getAuth, updatePassword } from "firebase/auth";
import { ref, remove, update } from "firebase/database";
import { useUserContext } from "../../AppInitializers";
import { object } from "prop-types";
import { showToastSuccess } from "../../utils/toasts.js";
import { useNavigate } from "react-router-dom";
import { handleSignOut } from "../../services/authServices.js";
import { getAddonsIdByUsername } from "../../services/addonServices.js";
export default function EditProfile({ user }) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();
  const toast = useToast();
  const { userData, setUserData } = useUserContext();
  const navigate = useNavigate();
  const auth = getAuth();
  const currUser = auth.currentUser;
  const [newPassword, setNewPassword] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [addons, setAddons] = useState([]);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState(user.avatar);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAddonsIdByUsername(userData.userName).then(setAddons);
    if (currUser?.avatarURL) {
      setAvatarURL(avatarURL);
    }
  }, [avatarURL, currUser?.avatarURL, userData.userName]);

  const showToastError = () => {
    toast({
      title: "Error!",
      description: "Invalid account details! Please check and try again!",
      duration: 3000,
      isClosable: true,
      status: "error",
      position: "top",
      icon: <NotAllowedIcon />,
    });
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value.trim());
  };

  const handlePhotoChange = (event) => {
    if (event.target.files[0]) {
      setAvatar(event.target.files[0]);
    }
  };

  const handlePhoneChange = (event) => {
    setNewPhoneNumber(event.target.value.trim());
  };

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value.trim());
  };

  const handleFirstNameChange = (event) => {
    setNewFirstName(event.target.value.trim());
  };

  const handleLastNameChange = (event) => {
    setNewLastName(event.target.value.trim());
  };

  const updateUserInformation = async () => {
    try {
      if (newPassword != "") {
        await updatePassword(currUser, newPassword);
      }
    } catch (error) {
      console.error(error);
      showToastError();
    }
    try {
      if (avatar) {
        await uploadUserAvatar(avatar, currUser, setLoading);
      }
    } catch (error) {
      console.error(error);
      showToastError();
    }

    try {
      const userRef = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      if (newPhoneNumber != "") {
        // console.log(newPhoneNumber);
        // console.log(newPhoneNumber.length);
        await update(userRef, { phone: newPhoneNumber });
        showToastSuccess(
          toast,
          "Updated!",
          "The account information was successfully updated!",
          <CheckIcon />
        );
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      showToastError();
    }
    try {
      const userRef = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      if (newEmail != "") {
        await update(userRef, { email: newEmail });
        showToastSuccess(
          toast,
          "Updated!",
          "The account information was successfully updated!",
          <CheckIcon />
        );
      }
    } catch (error) {
      console.error("Error updating the email:", error);
      showToastError();
    }
    try {
      const userRef = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      if (newFirstName != "") {
        await update(userRef, { firstName: newFirstName });
        showToastSuccess(
          toast,
          "Updated!",
          "The account information was successfully updated!",
          <CheckIcon />
        );
      }
    } catch (error) {
      console.error("Error updating the email:", error);
      showToastError();
    }
    try {
      const userRef = ref(
        db,
        `users/${localStorage.getItem("currentUserUid")}`
      );
      if (newLastName != "") {
        await update(userRef, { lastName: newLastName });
        showToastSuccess(
          toast,
          "Updated!",
          "The account information was successfully updated!",
          <CheckIcon />
        );
      }
    } catch (error) {
      console.error("Error updating the email:", error);
      showToastError();
    }
  };

  const deleteAccount = async () => {
    try {
      await remove(ref(db, `users/${localStorage.getItem("currentUserUid")}`));
      addons.forEach(async (addonId) => {
        const addonRef = ref(db, `add-ons/${addonId}`);
        await remove(addonRef);
      });
    } catch (e) {
      console.error(`Error while deleting user: ${e}`);
    }
    try {
      await deleteUser(currUser);
      handleSignOut();
      setUserData({});
      navigate("/login");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const OverlayOne = () => (
    <ModalOverlay
      backdropFilter={useColorModeValue(
        "blur(20px) hue-rotate(300deg)",
        "blur(20px) hue-rotate(400deg)"
      )}
    />
  );

  const [overlay, setOverlay] = useState(<OverlayOne />);

  return (
    <Fragment>
      <Button
        colorScheme="teal"
        variant="ghost"
        position="relative"
        left="620px"
        onClick={() => {
          setOverlay(<OverlayOne />);
          onModalOpen();
        }}
      >
        <SettingsIcon />
      </Button>
      <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Edit Account Information</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <InputGroup id="formFile" onChange={handlePhotoChange}>
                <Stack direction={["column", "row"]} spacing={6}>
                  <Center>
                    <Avatar
                      size="xl"
                      src={
                        loading
                          ? "https://media.tenor.com/p6E3HWDFrl8AAAAi/loading-discord-emoji.gif"
                          : user.avatar
                      }
                    ></Avatar>
                  </Center>
                  <Center w="full">
                    <Input type="file" />
                  </Center>
                </Stack>
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <InfoIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="firstName"
                  placeholder="First Name"
                  value={newFirstName}
                  onChange={handleFirstNameChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <InfoIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="lastName"
                  placeholder="Last Name"
                  value={newLastName}
                  onChange={handleLastNameChange}
                />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <PhoneIcon color="gray.300" />
                </InputLeftElement>
                <NumberInput width="100%">
                  <NumberInputField
                    type="phone"
                    placeholder="Phone Number"
                    value={newPhoneNumber}
                    onChange={handlePhoneChange}
                    paddingLeft="2.5rem"
                  />
                </NumberInput>
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <EmailIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={newEmail}
                  onChange={handleEmailChange}
                />
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={newPassword}
                  onChange={handlePasswordChange}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type={show ? "text" : "password"}
                  placeholder="Confirm Password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Stack>
          </ModalBody>
          <ModalFooter gap={2}>
            <Tooltip label="Save Changes">
              <Button onClick={updateUserInformation}>
                <RepeatIcon color="green" />
              </Button>
            </Tooltip>
            <Tooltip label="Delete Account">
              <Button onClick={onAlertOpen}>
                <DeleteIcon color="red" />
              </Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        motionPreset="slideInBottom"
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete your account? You can&#39;t undo
              this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Fragment>
  );
}

EditProfile.propTypes = {
  user: object,
};
