import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@chakra-ui/react";
import { ChatIcon } from "@chakra-ui/icons";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "../../chatbot/config.jsx";
import ActionProvider from "../../chatbot/ActionProvider";
import MessageParser from "../../chatbot/MessageParser";
const ChatButton = () => {
  const chatButtonStyle = {
    position: "fixed",
    bottom: "30px",
    right: "50px",
  };

  return (
    <div style={chatButtonStyle}>
      <Popover placement="top-start">
        <PopoverTrigger>
          <Button
            _light={{ color: "white" }}
            size="lg"
            bgColor="purple.400"
            _dark={{ bgColor: "teal.400" }}
          >
            <ChatIcon width="30px" height="30px"></ChatIcon>
          </Button>
        </PopoverTrigger>
        <PopoverContent width="100%">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ChatButton;
