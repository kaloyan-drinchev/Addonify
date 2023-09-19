import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Box,
  Select,
  Button,
  Input,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { db } from "../../../firebaseConfig/config";
import { ref, set } from "firebase/database";
import { storage } from "../../../firebaseConfig/config";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../AppInitializers";
const Verification = () => {
  const [selectedDocumentOption, setSelectedOption] = useState("");
  const { userData } = useUserContext();
  const [error, setErrorStatus] = useState(false);
  const [passport, setPassport] = useState(null);
  const [passportError, setPassportError] = useState(false);
  const [natIDFront, setNatIDFront] = useState(null);
  const [natIDBack, setNatIDBack] = useState(null);
  const [errorNatID, setNatIDError] = useState(false);
  const [driverLicenseFront, setDriverLicenseFront] = useState(null);
  const [driverLicenseBack, setDriverLicenseBack] = useState(null);
  const [errorDriverLicense, setDriverLicenseError] = useState(false);
  const [fileNamePassport, setFileNamePassport] = useState("");
  const [fileNameIdFront, setFileNameIdFront] = useState("");
  const [fileNameIdBack, setFileNameIdBack] = useState("");
  const [fileNameLicenseFront, setFileNameLicenseFront] = useState("");
  const [fileNameLicenseBack, setFileNameLicenseBack] = useState("");
  const [spinnerStatus, setSpinnerStatus] = useState(false);
  const navigation = useNavigate();
  const steps = [
    { title: "First", description: "Select document type" },
    { title: "Second", description: "Upload Document" },
    { title: "Third", description: "Success!" },
  ];
  const { activeStep, goToNext, goToPrevious } = useSteps({
    index: 1,
    count: steps.length,
  });

  const handleSteps = () => {
    if (activeStep >= 1) {
      if (selectedDocumentOption) {
        goToNext();
      } else {
        handleOptionError();
      }
    }
  };

  const handleGoBack = () => {
    goToPrevious();
  };

  const handleOptionError = () => {
    setErrorStatus(true);
    setTimeout(() => {
      setErrorStatus(false);
    }, 2000);
  };

  const handlePassportError = () => {
    setPassportError(true);
    setTimeout(() => {
      setPassportError(false);
    }, 2000);
  };

  const handleNatIDError = () => {
    setNatIDError(true);
    setTimeout(() => {
      setNatIDError(false);
    }, 2000);
  };

  const handleDriverLicenseError = () => {
    setDriverLicenseError(true);
    setTimeout(() => {
      setDriverLicenseError(false);
    }, 2000);
  };

  const handlePassport = (file) => {
    setPassport(file.target.files[0]);
    setFileNamePassport(file.target.files[0].name);
  };
  const handleNatIDFront = (file) => {
    setFileNameIdFront(file.target.files[0].name);
    setNatIDFront(file.target.files[0]);
  };
  const handleNatIDBack = (file) => {
    setFileNameIdBack(file.target.files[0].name);
    setNatIDBack(file.target.files[0]);
  };
  const handleDriverLicenseFront = (file) => {
    setFileNameLicenseFront(file.target.files[0].name);
    setDriverLicenseFront(file.target.files[0]);
  };
  const handleDriverLicenseBack = (file) => {
    setFileNameLicenseBack(file.target.files[0].name);
    setDriverLicenseBack(file.target.files[0]);
  };

  const handleSubmit = async (selectedDocumentOption) => {
    setSpinnerStatus(true);
    switch (selectedDocumentOption) {
      case "passport":
        if (passport) {
          const getRef = sRef(storage, `documents/${passport.name}`);
          await uploadBytes(getRef, passport);
          const passportURL = await getDownloadURL(getRef);

          const getFirebaseRef = ref(
            db,
            `documents/${localStorage.getItem("currentUserUid")}`
          );
          const setDocument = {
            passport: passportURL,
            username: userData.userName,
            avatar: userData.avatar,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userID: userData.userID,
            type: "passport",
            submittedOn: new Date().toLocaleDateString(),
          };
          await set(getFirebaseRef, setDocument);
          handleSteps();
          setSpinnerStatus(false);
        } else {
          handlePassportError();
          setSpinnerStatus(false);
        }
        break;
      case "nationalIdDocument":
        if (natIDFront && natIDBack) {
          const frontRef = sRef(storage, `documents/${natIDFront.name}`);
          await uploadBytes(frontRef, natIDFront);
          const IDfrontURL = await getDownloadURL(frontRef);

          const backRef = sRef(storage, `documents/${natIDBack.name}`);
          await uploadBytes(backRef, natIDBack);
          const IDbackURL = await getDownloadURL(backRef);

          const getFirebaseRef = ref(
            db,
            `documents/${localStorage.getItem("currentUserUid")}`
          );
          const setDocument = {
            docFront: IDfrontURL,
            docBack: IDbackURL,
            username: userData.userName,
            avatar: userData.avatar,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userID: userData.userID,
            type: "nationalID",
            submittedOn: new Date().toLocaleDateString(),
          };
          await set(getFirebaseRef, setDocument);
          handleSteps();
          setSpinnerStatus(false);
        } else {
          setSpinnerStatus(false);
          handleNatIDError();
        }
        break;
      case "driverLicense":
        if (driverLicenseBack && driverLicenseFront) {
          const frontRef = sRef(
            storage,
            `documents/${driverLicenseFront.name}`
          );
          await uploadBytes(frontRef, driverLicenseFront);
          const IDfrontURL = await getDownloadURL(frontRef);

          const backRef = sRef(storage, `documents/${driverLicenseBack.name}`);
          await uploadBytes(backRef, driverLicenseFront);
          const IDbackURL = await getDownloadURL(backRef);

          const getFirebaseRef = ref(
            db,
            `documents/${localStorage.getItem("currentUserUid")}`
          );
          const setDocument = {
            docFront: IDfrontURL,
            docBack: IDbackURL,
            username: userData.userName,
            avatar: userData.avatar,
            firstName: userData.firstName,
            lastName: userData.lastName,
            userID: userData.userID,
            type: "driverLicense",
            submittedOn: new Date().toLocaleDateString(),
          };
          await set(getFirebaseRef, setDocument);
          setSpinnerStatus(false);
          handleSteps();
        } else {
          setSpinnerStatus(false);
          handleDriverLicenseError();
        }
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      {error && (
        <Alert status="error">
          <AlertIcon />
          Please choose an option!
        </Alert>
      )}
      {passportError && (
        <Alert status="error">
          <AlertIcon />
          Please upload your Passport document!
        </Alert>
      )}
      {errorNatID && (
        <Alert status="error">
          <AlertIcon />
          Please upload both necessary documents!
        </Alert>
      )}
      {errorDriverLicense && (
        <Alert status="error">
          <AlertIcon />
          Please upload both necessary documents!
        </Alert>
      )}
      <Stepper
        index={activeStep}
        colorScheme={useColorModeValue("purple", "teal")}
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      {activeStep === 1 && (
        <Select
          cursor="pointer"
          placeholder="Select option"
          marginTop="100px"
          size="lg"
          onChange={(event) => setSelectedOption(event.target.value)}
        >
          <option value="passport">Passport</option>
          <option value="nationalIdDocument">National ID document</option>
          <option value="driverLicense">Driver&#39;s License</option>
        </Select>
      )}

      {activeStep === 2 && selectedDocumentOption === "passport" && (
        <Box marginTop="100px" display="block" justifyContent="center">
          <Heading marginBottom="30px">Upload a copy of your Passport</Heading>
          <Flex>
            <Input
              type="file"
              id="fileInput"
              display="none"
              onChange={(e) => handlePassport(e)}
            />
            <Button
              as="label"
              marginLeft="30px"
              htmlFor="fileInput"
              _light={{ bgColor: "purple.400" }}
              _dark={{ bgColor: "teal" }}
              _hover={{
                _light: { bgColor: "purple.600" },
                _dark: { bgColor: "teal.400" },
              }}
              color="white"
              size="lg"
              cursor="pointer"
            >
              Choose File
            </Button>
            <Text
              display="flex"
              alignItems="center"
              marginLeft="20px"
              fontWeight="bold"
            >
              {fileNamePassport}
            </Text>
          </Flex>
        </Box>
      )}
      {activeStep === 2 && selectedDocumentOption === "nationalIdDocument" && (
        <Box marginTop="100px" display="block" justifyContent="center">
          <Heading marginBottom="30px">
            Upload a copy of your National ID
          </Heading>
          <Flex>
            <Text fontWeight="bold" fontSize="2xl">
              {" "}
              Front Side:
              <Input
                type="file"
                id="fileInputIDFront"
                display="none"
                onChange={(e) => handleNatIDFront(e)}
              />
              <Button
                as="label"
                marginLeft="25px"
                htmlFor="fileInputIDFront"
                _light={{ bgColor: "purple.400" }}
                _dark={{ bgColor: "teal" }}
                _hover={{
                  _light: { bgColor: "purple.600" },
                  _dark: { bgColor: "teal.400" },
                }}
                color="white"
                size="lg"
                cursor="pointer"
              >
                Choose File
              </Button>
            </Text>
            <Text
              display="flex"
              alignItems="end"
              marginLeft="20px"
              fontWeight="bold"
            >
              {fileNameIdFront}
            </Text>
          </Flex>
          <Flex>
            <Text marginTop="50px" fontWeight="bold" fontSize="2xl">
              {" "}
              Back Side:
              <Input
                type="file"
                id="fileInputFrontID"
                display="none"
                onChange={(e) => handleNatIDBack(e)}
              />
              <Button
                as="label"
                marginLeft="30px"
                htmlFor="fileInputFrontID"
                _light={{ bgColor: "purple.400" }}
                _dark={{ bgColor: "teal" }}
                _hover={{
                  _light: { bgColor: "purple.600" },
                  _dark: { bgColor: "teal.400" },
                }}
                color="white"
                size="lg"
                cursor="pointer"
              >
                Choose File
              </Button>
            </Text>
            <Text
              display="flex"
              alignItems="end"
              marginLeft="20px"
              fontWeight="bold"
            >
              {fileNameIdBack}
            </Text>
          </Flex>
        </Box>
      )}
      {activeStep === 2 && selectedDocumentOption === "driverLicense" && (
        <Box marginTop="100px" display="block" justifyContent="center">
          <Heading marginBottom="30px">
            Upload a copy of your Driver License
          </Heading>
          <Flex>
            <Text fontWeight="bold" fontSize="2xl">
              {" "}
              Front Side:
              <Input
                type="file"
                id="fileInputLicenseFront"
                display="none"
                onChange={(e) => handleDriverLicenseFront(e)}
              />
              <Button
                as="label"
                marginLeft="25px"
                htmlFor="fileInputLicenseFront"
                _light={{ bgColor: "purple.400" }}
                _dark={{ bgColor: "teal" }}
                _hover={{
                  _light: { bgColor: "purple.600" },
                  _dark: { bgColor: "teal.400" },
                }}
                color="white"
                size="lg"
                cursor="pointer"
              >
                Choose File
              </Button>
            </Text>
            <Text
              display="flex"
              alignItems="end"
              marginLeft="20px"
              fontWeight="bold"
            >
              {fileNameLicenseFront}
            </Text>
          </Flex>
          <Flex>
            <Text marginTop="50px" fontWeight="bold" fontSize="2xl">
              {" "}
              Back Side:
              <Input
                type="file"
                id="fileInputLicenseBack"
                display="none"
                onChange={(e) => handleDriverLicenseBack(e)}
              />
              <Button
                as="label"
                marginLeft="30px"
                htmlFor="fileInputLicenseBack"
                _light={{ bgColor: "purple.400" }}
                _dark={{ bgColor: "teal" }}
                _hover={{
                  _light: { bgColor: "purple.600" },
                  _dark: { bgColor: "teal.400" },
                }}
                color="white"
                size="lg"
                cursor="pointer"
              >
                Choose File
              </Button>
            </Text>
            <Text
              display="flex"
              alignItems="end"
              marginLeft="20px"
              fontWeight="bold"
            >
              {fileNameLicenseBack}
            </Text>
          </Flex>
        </Box>
      )}
      {activeStep < 2 && (
        <Box display="flex" justifyContent="center" marginTop="20px" gap="30px">
          <Button
            onClick={() => handleSteps()}
            size="lg"
            display="flex"
            flexDirection="row"
            _hover={{
              bgColor: "purple.400",
              color: "white",
              _dark: { bgColor: "teal", color: "white" },
            }}
          >
            Next
          </Button>
        </Box>
      )}

      {activeStep === 2 && (
        <Box display="flex" justifyContent="center" marginTop="20px" gap="30px">
          <Button
            onClick={() => handleGoBack()}
            size="lg"
            display="flex"
            flexDirection="row"
            _hover={{
              bgColor: "purple.400",
              color: "white",
              _dark: { bgColor: "teal", color: "white" },
            }}
          >
            Previous
          </Button>
          <Button
            onClick={() => handleSubmit(selectedDocumentOption)}
            size="lg"
            display="flex"
            flexDirection="row"
            _hover={{
              bgColor: "purple.400",
              color: "white",
              _dark: { bgColor: "teal", color: "white" },
            }}
          >
            Sumbit
          </Button>
          {spinnerStatus && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.400"
              _dark={{ color: "teal.400" }}
              size="xl"
            />
          )}
        </Box>
      )}
      {activeStep === 3 && (
        <Alert
          marginTop="100px"
          status="success"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Application submitted!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Thanks for submitting your documents. Our team will review them and
            get back to you soon.
          </AlertDescription>
          <Button onClick={() => navigation("/")}>Back to main page</Button>
        </Alert>
      )}
    </Box>
  );
};

export default Verification;
