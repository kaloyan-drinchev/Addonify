import React from "react";
import { db } from "../../firebaseConfig/config";
import { get, ref } from "firebase/database";
import { func, object } from "prop-types";
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleThankYou = () => {
    const botMessage = createChatBotMessage(
      "You are welcome.Is there anything else i can help you with?"
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleUploadPaidAddonGuide = () => {
    const botMessage =
      createChatBotMessage(`In order to upload a paid add-on you need to be a verified user.
      To get verified, please navigate to the "Profile" section and locate the "Get Verified" section.
      You can choose between uploading a Passport, National ID card, or Driver's license.
      After you make a submission, our team will review the documents and respond within 48 hours.`);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleBestProject = () => {
    const botMessage = createChatBotMessage(
      "Team 12 has the best project of course!"
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleUploadGuide = () => {
    const botMessage =
      createChatBotMessage(`In order to upload an add-on navigate to the "New Add-on" section.
    Next, choose a name and avatar, add description,tags,your GitHub repository link and the add-on itself.
    Afterwards, click ot the "Submit" button and your application will be sent for review.`);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleStatusPending = () => {
    const botMessage = createChatBotMessage(
      `If your add-on's status is set to 'Pending', this means the plugin is awaiting reviewal from our admins. Application reviews are usually processed within 48hours`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleStatusRejected = () => {
    const botMessage = createChatBotMessage(
      `If your add-on's status is set to 'Rejected', this means the plugin was rejected from our admins. Please make sure you provide appropriate and accurate information and make a new Add-on submission.`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleRatingAnswer = () => {
    const botMessage = createChatBotMessage(
      `Each Add-on's rating is calculated based on the average review score.`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handlePaidAddonAnswer = () => {
    const botMessage = createChatBotMessage(
      `Payment options for purchasing paid Add-on's are provided from Stripe. After completing your purchase you will be redirected to a page where you can download your desired add-on.`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleMostDownloaded = () => {
    const botMessage = createChatBotMessage(
      `Here are the top 3 most popular Add-ons on our platform:`,
      {
        widget: "mostDownloadedAddons",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handlePopularCreators = () => {
    const botMessage = createChatBotMessage(
      `Here are the top 3 most popular creators on our platform:`,
      {
        widget: "mostPopularUsers",
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  const handleGetTagMatch = (keyword) => {
    console.log(keyword);
    const botMessage = createChatBotMessage(
      `Give me a moment to find a potential addon for you:`,
      {
        widget: "getTagMatch",
        tagData: keyword,
      }
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleEditProfileAnswer = () => {
    const botMessage = createChatBotMessage(
      `To edit your profile please navigate to the "Profile" section and locate the bolt icon on the top-right side of the "Account Info" section`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleCreatorsAnswer = () => {
    const botMessage = createChatBotMessage(
      `This project was created by Krasen,Danaela and Kaloyan from team 12.`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleNoMatch = () => {
    const botMessage = createChatBotMessage(
      `Sorry, i couldn't find relevant information. Please check your message for typos or ask something else.`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            handleBestProject,
            handleThankYou,
            handleUploadPaidAddonGuide,
            handleUploadGuide,
            handleStatusPending,
            handleStatusRejected,
            handleRatingAnswer,
            handlePaidAddonAnswer,
            handleMostDownloaded,
            handlePopularCreators,
            handleGetTagMatch,
            handleEditProfileAnswer,
            handleCreatorsAnswer,
            handleNoMatch,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;

ActionProvider.propTypes = {
  createChatBotMessage: func,
  setState: func,
  children: object,
};
