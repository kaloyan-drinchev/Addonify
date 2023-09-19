import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { NotAllowedIcon } from "@chakra-ui/icons";
import { handleLogin } from "../services/authServices";

const Login = () => {
  const [password, updatePassword] = useState("");
  const [email, updateEmail] = useState("");
  const toast = useToast({position:'top'});

  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.700")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("gray.50", "gray.600")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="E-mail..."
                value={email}
                onChange={(e) => updateEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Password..."
                value={password}
                onChange={(e) => updatePassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>

                <NavLink to="/resetPassword">
                  <Text color={"purple.500"} _dark={{color:'teal.400'}}>Forgot password?</Text>
                </NavLink>
              </Stack>
              <Button
                onClick={() =>
                  handleLogin(email, password, toast, NotAllowedIcon)
                }
                bg={useColorModeValue("purple.400", "teal.500")}
                color={"white"}
                _hover={{
                  bgColor: useColorModeValue("purple.300", "teal.300"),
                }}
              >
                Sign in
              </Button>
              <Flex align={"center"} justify={"center"} gap={3}>
                <Text>Need an account?</Text>
                <NavLink to="/signUp">
                  <Text color={"purple.500"} _dark={{ color: 'teal.400' }}>Sign up here ✌️</Text>
                </NavLink>
              </Flex>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
