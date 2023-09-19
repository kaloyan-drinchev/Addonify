import { createChatBotMessage } from "react-chatbot-kit";
import { db } from "../../firebaseConfig/config";
import { get, ref } from "firebase/database";
import MostDownloadedAddons from "./ActionHelpers/MostDownloadedAddons.jsx";
import PopularCreators from "./ActionHelpers/PopularCreators.jsx";
import GetMatchingTags from "./ActionHelpers/GetMatchingTags.jsx";
import BotAvatar from "./ActionHelpers/BotAvatar.jsx";
import UserAvatar from "./ActionHelpers/UserAvatar.jsx";
const getRef = await get(
  ref(db, `users/${localStorage.getItem("currentUserUid")}`)
);

const getColor = localStorage.getItem("chakra-ui-color-mode");
const config = {
  botName: "AddonyBot",
  initialMessages: [
    createChatBotMessage(
      `Hello ${
        localStorage.getItem("loginStatus") ? getRef.val().userName : "there"
      }, how can i help you today?`
    ),
  ],
  widgets: [
    {
      widgetName: "mostDownloadedAddons",
      widgetFunc: (props) => <MostDownloadedAddons {...props} />,
    },
    {
      widgetName: "mostPopularUsers",
      widgetFunc: (props) => <PopularCreators {...props} />,
    },
    {
      widgetName: "getTagMatch",
      widgetFunc: (props) => (
        <GetMatchingTags
          keyword={
            props.state.messages[props.state.messages.length - 1].tagData
          }
        />
      ),
    },
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: getColor === "light" ? "#9F7AEA" : "teal",
    },
    chatButton: {
      backgroundColor: getColor === "light" ? "#9F7AEA" : "teal",
    },
  },
  customComponents: {
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
  },
};

export default config;
