import { Grid, GridItem, useColorModeValue, Button } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import SideBar from "../components/SideBar/SideBar";
import { useState } from "react";
export default function RootLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <Grid templateColumns="repeat(6, 1fr)" bg="gray.50">
      <Button
        display={{ base: "block", lg: "none" }}
        onClick={toggleSidebar}
        zIndex="999"
        position="fixed"
        top="20px"
        left="20px"
        bg="transparent"
        border="none"
        color="gray.500"
        fontSize="2xl"
        cursor="pointer"
      >
        <HamburgerIcon />
      </Button>
      <GridItem
        as="aside"
        colSpan={{ base: showSidebar ? 6 : 0, lg: 1 }}
        bg={useColorModeValue("purple.400", "teal")}
        minHeight={{ lg: "100vh" }}
        p="20px"
        display={{ base: showSidebar ? "block" : "none", lg: "block" }}
      >
        <SideBar />
      </GridItem>

      <GridItem
        as="main"
        colSpan={{ base: 6, lg: 5 }}
        p={10}
        bg={useColorModeValue("gray.50", "gray.700")}
      >
        <NavBar />
        <Outlet />
      </GridItem>
    </Grid>
  );
}
