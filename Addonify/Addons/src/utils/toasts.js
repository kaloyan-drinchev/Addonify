export const showToastSuccess = (callback, title, description, icon) => {
  callback({
    title: title,
    description: description,
    duration: 3000,
    isClosable: true,
    status: "success",
    position: "top",
    icon: icon,
  });
};

export const showToastError = (callback, description, icon) => {
  callback({
    title: "Error!",
    description: description,
    duration: 3000,
    isClosable: true,
    status: "error",
    position: "top",
    icon: icon,
  });
};
