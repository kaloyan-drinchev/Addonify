import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Button,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig/config";
import { ref, onValue, update } from "firebase/database";
import { NavLink } from "react-router-dom";
import { Badge } from "antd";

export default function NotificationDropDownMenu() {
  const [notifications, setNotifications] = useState([]);
  const currentUserUid = localStorage.getItem("currentUserUid");

  useEffect(() => {
    const arrayMail = [];
    const mailRef = ref(db, `users/${currentUserUid}/mailBox`);
    onValue(mailRef, (snapshot) => {
      const data = snapshot.val();
      for (const key in data) {
        arrayMail.push(data[key]);
      }
      arrayMail.shift();
      const reversedMail = arrayMail.reverse();
      setNotifications(reversedMail);
    });
  }, [currentUserUid]);

  const handleClearNotifications = async () => {
    const mailRef = ref(db, `users/${currentUserUid}`);
    await update(mailRef, { mailBox: ["-"] });
    setNotifications([]);
  };

  return (
    <Menu>
      {
        <MenuButton
          as={Button}
          h={10}
          color="white"
          bgColor="purple.400"
          _dark={{ bgColor: "teal" }}
          _hover={{
            bgColor: "purple.300",
            _dark: { bgColor: "teal.300" },
          }}
        >
          <BellIcon color="white" w={8} h={8} />
        </MenuButton>
      }
      {notifications && (
        <Badge count={notifications.length} offset={[-30, -30]} />
      )}
      <MenuList p={2} maxH="300px" overflowY="auto">
        {notifications.length > 0 && (
          <Button
            onClick={handleClearNotifications}
            width="100%"
            // bgColor={useColorModeValue("purple.400", "teal")}
            _dark={{ bgColor: "teal" }}
            _light={{ bgColor: "purple.400" }}
            color="white"
            _hover={{
              _dark: { bgColor: "teal.400" },
              _light: { bgColor: "purple.600" },
            }}
          >
            Clear all
          </Button>
        )}
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NavLink
              to={
                notification.action !== "followed"
                  ? `/single-addon-view/${notification.addon}`
                  : `/view-user/${notification.addon}`
              }
              state={notification}
              key={index}
            >
              <MenuItem
                minH="48px"
                color="white"
                bgColor="purple.300"
                _dark={{ bgColor: "teal" }}
                my={2}
                borderRadius={8}
                transition="0.2s ease-in-out"
                _hover={{
                  transform: "scale(1.05)",
                  bgColor: "gray.300",
                  _dark: { bgColor: "teal.300" },
                  _light: { bgColor: "purple.600" },
                }}
              >
                <Image
                  boxSize="2rem"
                  borderRadius="full"
                  src={notification.img}
                  alt="Fluffybuns the destroyer"
                  mr="12px"
                />
                <VStack spacing={2}>
                  {notification.action === "followed" ? (
                    <>
                      <span>{notification.user} followed you!</span>
                      <Box ml="auto">{notification.date}</Box>
                    </>
                  ) : (
                    <>
                      <span>
                        {notification.user} {notification.action} your addon!
                      </span>
                      <Box ml="auto">{notification.date}</Box>
                    </>
                  )}
                </VStack>
              </MenuItem>
            </NavLink>
          ))
        ) : (
          <MenuItem>
            <Text>0 Notifications</Text>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
