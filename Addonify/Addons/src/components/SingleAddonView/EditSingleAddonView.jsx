import { Fragment, useRef, useState } from "react";
import { db } from "../../../firebaseConfig/config.js";
import { useParams, useNavigate } from "react-router-dom";
import { ref, update, remove } from "firebase/database";
import {
  Button,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Editable,
  useToast,
  Spacer,
  Flex,
  useColorModeValue,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  EditIcon,
  CheckIcon,
  NotAllowedIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { showToastError, showToastSuccess } from "../../utils/toasts.js";
import { func, string } from "prop-types";

export default function EditSingleAddonView({
  description,
  title,
  onChangeDescription,
  onChangeTitle,
}) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
    onClose,
  } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef();

  const [addonDescription, setAddonDescription] = useState("");
  const [addonTitle, setAddonTitle] = useState("");
  const params = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  const handleDescriptionEdit = (event) => {
    setAddonDescription(event.target.value);
  };
  const handleTitleEdit = (event) => {
    setAddonTitle(event.target.value);
  };
  const updateDescription = async () => {
    if (addonDescription !== "") {
      const userRef = ref(db, `add-ons/${params.addonId}`);
      await update(userRef, { description: addonDescription });
      onChangeDescription(addonDescription);
      showToastSuccess(
        toast,
        "Updated!",
        "Successfully updated description",
        <CheckIcon />
      );
      onClose();
    } else {
      showToastError(toast, "Invalid description!", <NotAllowedIcon />);
    }
  };
  const updateTitle = async () => {
    if (addonTitle !== "" && addonTitle.length > 2 && addonTitle.length < 31) {
      const userRef = ref(db, `add-ons/${params.addonId}`);
      await update(userRef, { name: addonTitle });
      onChangeTitle(addonTitle);
      showToastSuccess(
        toast,
        "Updated",
        "Successfully updated title",
        <CheckIcon />
      );
      onClose();
    } else {
      showToastError(toast, "Invalid title!", <NotAllowedIcon />);
    }
  };

  const handleAddonDelete = async () => {
    try {
      const userRef = ref(db, `add-ons/${params.addonId}`);
      await remove(userRef);
      navigate("/");
    } catch (e) {
      console.log(`Error while deleting the add-on: ${e}`);
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
        onClick={() => {
          setOverlay(<OverlayOne />);
          onModalOpen();
        }}
      >
        <EditIcon w={8} h={8} /> <span>Edit</span>
      </Button>
      <Modal isCentered isOpen={isModalOpen} onClose={onModalClose}>
        {overlay}
        <ModalContent gap={2} p={4}>
          <ModalCloseButton />
          <Flex alignItems="center">
            <span>Edit Title</span>
            <Spacer />

            <Tooltip label="Delete Addon">
              <Button
                onClick={onAlertOpen}
                boxSize={8}
                mb={2}
                mr={10}
                _hover={{
                  transform: "scale(1.03)",
                  bgColor: "red.300",
                  borderRadius: "5px",
                  padding: "5px",
                }}
              >
                <DeleteIcon color="red" />
              </Button>
            </Tooltip>

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
                    Delete Add-on
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure you want to delete this Add-on? You can&#39;t
                    undo this action afterwards.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onAlertClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleAddonDelete}
                      ml={3}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
          <Editable>
            <Input
              mb={2}
              type="text"
              defaultValue={title}
              onChange={(e) => handleTitleEdit(e)}
            />
            <Button type="button" onClick={updateTitle}>
              Submit
            </Button>
          </Editable>
          <span>Edit Description</span>
          <Editable>
            <Input
              mb={2}
              type="text"
              defaultValue={description}
              onChange={(e) => handleDescriptionEdit(e)}
            />

            <Button type="button" onClick={updateDescription}>
              Submit
            </Button>
          </Editable>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}

EditSingleAddonView.propTypes = {
  description: string,
  title: string,
  onChangeDescription: func,
  onChangeTitle: func,
};
