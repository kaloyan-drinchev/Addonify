import { object } from "prop-types";
import React from "react";

const MessageParser = ({ children, actions }) => {
  const keywordActions = [
    { keywords: ["hello"], action: actions.handleHello },
    { keywords: ["best", "project"], action: actions.handleBestProject },
    { keywords: ["thank you", "thanks"], action: actions.handleThankYou },
    {
      keywords: ["upload", "paid"],
      action: actions.handleUploadPaidAddonGuide,
    },
    { keywords: ["upload", "submit"], action: actions.handleUploadGuide },
    { keywords: ["status", "pending"], action: actions.handleStatusPending },
    { keywords: ["status", "rejected"], action: actions.handleStatusRejected },
    { keywords: ["rating", "calculated"], action: actions.handleRatingAnswer },
    {
      keywords: ["purchase", "buy", "paid"],
      action: actions.handlePaidAddonAnswer,
    },
    {
      keywords: [
        "top add-ons",
        "most downloaded",
        "most popular add-ons",
        "most popular addons",
        "top addons",
      ],
      action: actions.handleMostDownloaded,
    },
    {
      keywords: [
        "most followers",
        "popular users",
        "most followed",
        "most popular users",
      ],
      action: actions.handlePopularCreators,
    },
    { keywords: ["addon for"], action: actions.handleGetTagMatch },
    { keywords: ["edit profile"], action: actions.handleEditProfileAnswer },
    {
      keywords: ["project creators", "project owners", "created you"],
      action: actions.handleCreatorsAnswer,
    },
  ];
  const parse = (message) => {
    const normalizedMessage = message.toLowerCase();

    for (let i = 0; i < keywordActions.length; i++) {
      const { keywords, action } = keywordActions[i];
      const regex = new RegExp(keywords.join("|"), "i");
      if (normalizedMessage.match(regex)) {
        if (normalizedMessage.includes("addon for")) {
          const modifyMessage = normalizedMessage.split(" ");
          let keyword = "";
          for (let j = 0; j < modifyMessage.length; j++) {
            if (
              modifyMessage[j - 1] === "addon" &&
              modifyMessage[j] === "for"
            ) {
              keyword = modifyMessage[j + 1];
            }
          }
          action(keyword.toLocaleLowerCase());
          break;
        }
        action();
        break;
      }
      if (i === keywordActions.length - 1) {
        actions.handleNoMatch();
      }
    }
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;

MessageParser.propTypes = {
  children: object,
  actions: object,
};
