import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../firebaseConfig/config.js";
import { NavLink } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //NEED TO ADD USERNAME FORM----------------------------
  const handleSignUp = async () => {
    try {
      if (password === "") {
        setError("Please choose a password");
        return;
      }
      if (firstName === "") {
        setError("Please a first name");
        return;
      }
      if (lastName === "") {
        setError("Please choose a last name");
        return;
      }
      if (username === "") {
        setError("Please choose a username");
        return;
      }
      if (number.length > 13) {
        setError("Please fill a valid phone number");
        return;
      }
      if (
        firstName === "" ||
        lastName === "" ||
        password === "" ||
        email === "" ||
        number === ""
      ) {
        setError("Please fill out all fields!");
        return;
      }
      const newUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setError("");
      const userData = {
        userID: newUser.user.uid,
        avatar:
          "https://cdn2.iconfinder.com/data/icons/private-detective-filloutline/64/suspect-unknown-incognito-avatar-people-512.png",
        firstName: firstName,
        lastName: lastName,
        phone: number,
        userName: username,
        email: email,
        role: ["user"],
        followers: [],
        following: [],
        isVerified: false,
        creationDate: new Date().toDateString(),
        mailBox: ["test"],
      };
      const userRef = ref(db, "users/" + newUser.user.uid);
      await set(userRef, userData);
      localStorage.setItem("loginStatus", true);
      localStorage.setItem("currentUserUid", newUser.user.uid);
      window.location.pathname = "/";
    } catch (e) {
      switch (e.code) {
        case "auth/missing-email":
          setError("Missing E-mail");
          break;
        case "auth/invalid-email":
          setError("E-mail is invalid");
          break;
        default:
          console.error(e);
      }
    }
  };
  return (
    <Flex
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.700")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up ✌️
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.600")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            {error ? <Text color="red">{error}</Text> : null}
            <HStack>
              <Box>
                <FormControl id="firstName" isRequired>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="First Name..."
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value.trim());
                      setError("");
                    }}
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl id="lastName" isRequired>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Last Name..."
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value.trim());
                      setError("");
                    }}
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="e-mail..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value.trim());
                  setError("");
                }}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value.trim());
                    setError("");
                  }}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <HStack mt={3}>
                <Box>
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      placeholder="username..."
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value.trim());
                        setError("");
                      }}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="number" isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <NumberInput>
                      <NumberInputField
                        type="text"
                        placeholder="Phone Number..."
                        value={number}
                        onChange={(e) => {
                          setNumber(e.target.value);
                          setError("");
                        }}
                      ></NumberInputField>
                    </NumberInput>
                  </FormControl>
                </Box>
              </HStack>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleSignUp}
                loadingText="Submitting"
                size="lg"
                bgColor={useColorModeValue("purple.400", "teal.500")}
                color={"white"}
                _hover={{
                  bgColor: useColorModeValue("purple.300", "teal.400"),
                }}
              >
                Sign up
              </Button>
            </Stack>
            <Flex justifyContent="center" gap={3}>
              <NavLink to="/login">
                <Text align={"center"}>Already a user?</Text>
              </NavLink>
              <Link color={"purple.500"} _dark={{ color: "teal.400" }}>
                Login
              </Link>
            </Flex>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUp;
