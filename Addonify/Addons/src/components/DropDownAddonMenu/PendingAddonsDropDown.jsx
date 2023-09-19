import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Badge } from "antd";
import { getPendingAddons } from "../../services/addonServices";
import DropDownOptions from "./DropDownOptions";
import { MdAddchart } from "react-icons/md";

export default function PendingAddonsDropDown() {
  const [pendingAddons, setPendingAddons] = useState();
  useEffect(() => {
    getPendingAddons().then(setPendingAddons);
  }, []);

  return (
    <Menu>
      <MenuButton
        as={Button}
        h={10}
        color="white"
        bgColor="purple.400"
        _dark={{ bgColor: "teal" }}
        rightIcon={<Icon as={MdAddchart} w={6} h={8} />}
        _hover={{
          bgColor: "purple.300",
          _dark: { bgColor: "teal.300" },
        }}
      >
        {pendingAddons && (
          <Badge count={pendingAddons.length} offset={[120, -30]} />
        )}
        Pending
      </MenuButton>
      <MenuList p={2} maxH="300px" overflowY="auto">
        {pendingAddons?.length ? (
          <DropDownOptions addons={pendingAddons} />
        ) : (
          <MenuItem>
            <Text>0 Notifications</Text>
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}
