import { useState } from "react";
import { Avatar } from "@chakra-ui/react";
import { useUserContext } from "../../AppInitializers";
const UserAvatar = () => {
  const [isUserLogged, setLoginStatus] = useState(
    localStorage.getItem("loginStatus")
  );
  const { userData } = useUserContext();

  return (
    <>
      {isUserLogged ? (
        <Avatar src={userData.avatar}></Avatar>
      ) : (
        <Avatar src="https://cdn2.iconfinder.com/data/icons/private-detective-filloutline/64/suspect-unknown-incognito-avatar-people-512.png"></Avatar>
      )}
    </>
  );
};
export default UserAvatar;
