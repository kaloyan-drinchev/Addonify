import {
  Flex,
  Stack,
  Heading,
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { Fragment, useState } from "react";
import { auth } from "../../firebaseConfig/config";
import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { showToastError, showToastSuccess } from "../utils/toasts";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showToastSuccess(
        toast,
        "Success",
        "The reset password email was sent! Please check your email address!",
        <CheckIcon />
      );
    } catch (error) {
      showToastError(
        toast,
        "Invalid email address! Please check and try again!",
        <NotAllowedIcon />
      );
    }
  };

  return (
    <Fragment>
      <Flex
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"3xl"} textAlign={"center"}>
              Password Reset
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.600")}
            boxShadow={"lg"}
            p={8}
            width={"150%"}
            ml={"-25%"}
          >
            <Stack spacing={4}>
              <Box>
                <FormControl id="email" isRequired>
                  <FormLabel>Email Address</FormLabel>
                  <Input
                    type="text"
                    placeholder="Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
              </Box>
              <Button
                onClick={handleReset}
                loadingText="Submitting"
                size="lg"
                bgColor={useColorModeValue("purple.400", "teal.500")}
                color={"white"}
                _hover={{
                  bgColor: useColorModeValue("purple.300", "teal.400"),
                }}
              >
                Send Reset Email
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </Fragment>
  );
}
