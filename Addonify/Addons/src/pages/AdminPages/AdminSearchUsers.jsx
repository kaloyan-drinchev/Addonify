import {
  Box,
  Button,
  Checkbox,
  Input,
  Card,
  Image,
  Flex,
  Divider,
  Text,
  useColorModeValue,
  Icon,
  Center,
  useToast,
} from "@chakra-ui/react";

import { MdFilterList } from "react-icons/md";
import { ArrowBackIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { NavLink } from "react-router-dom";
import "./AdminSearchUsers.css";
import { ref, get, update } from "firebase/database";
import { db } from "../../../firebaseConfig/config.js";
import { useState, useEffect } from "react";
import SortingModal from "../../components/BrowseAddons/SortingModal";
// import filterImage from "../../assets/search-filter-icon-14.jpg";
import ReactPaginate from "react-paginate";
import { changePage, sortUsers } from "../../utils/helpers";
import { showToastError } from "../../utils/toasts";

const AdminSearchUsers = () => {
  const toast = useToast();
  const [blockedUsers, setBlockedUsers] = useState(new Set());
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [searchInput, setInput] = useState("");
  const [searchOption, setOption] = useState("");
  const [isOptionChosen, setOptionStatus] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allUsersBackup, setAllUsersBackup] = useState([]);
  const [areUsersFound, setFoundStatus] = useState(false);
  const [sortingModalOpen, setSortingModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const elementsPerPage = 8;

  const handleCheckboxChange = (index, option) => {
    setSelectedCheckbox(index === selectedCheckbox ? null : index);
      setOption(option);
  };
  useEffect(() => {
    const getBlockedUsers = async () => {
      const usersRef = ref(db, `users`);
      const snapshot = await get(usersRef);
      const totalUsers = [];
      snapshot.forEach((user) => {
        totalUsers.push(user.val());
        if (user.val().role.includes("blocked")) {
          setBlockedUsers(
            (prevBlockedUsers) =>
              new Set([...prevBlockedUsers, user.val().userID])
          );
        }
        setAllUsers(totalUsers);
        setAllUsersBackup(totalUsers);
      });
    };
    getBlockedUsers();
  }, []);

  useEffect(() => {
    if (isOptionChosen) {
      showToastError(
        toast,
        "Please select a search criteria",
        <NotAllowedIcon />
      );
    }
  }, [isOptionChosen, toast]);

  const handleBlock = async (userID) => {
    const getRef = ref(db, `users/${userID}`);
    const fetchedUser = await get(getRef);
    const user = fetchedUser.val().role.filter((e) => e != "blocked");
    await update(getRef, { role: [...user, "blocked"] });
    setBlockedUsers(
      (prevBlockedUsers) => new Set([...prevBlockedUsers, userID])
    );
  };

  const handleUnblock = async (userID) => {
    const getRef = ref(db, `users/${userID}`);
    const fetchedUser = await get(getRef);
    const user = fetchedUser.val().role.filter((e) => e != "blocked");
    await update(getRef, { role: [...user] });
    blockedUsers.delete(userID);
    const updateBlocked = blockedUsers;
    setBlockedUsers(new Set([...updateBlocked]));
  };

  const searchUsers = async () => {
    if (selectedCheckbox === null) {
      setOptionStatus(true);
      console.log(selectedCheckbox)
    } else {
      console.log(searchOption)
      setOptionStatus(false);
      const usersRef = ref(db, `users`);
      const snapshot = await get(usersRef);
      const gatheredUsers = [];
      snapshot.forEach((user) => {
        gatheredUsers.push(user.val());
      });
      const searchResults = gatheredUsers.filter(
        (user) =>
          user[searchOption].toLocaleLowerCase().match(searchInput.toLocaleLowerCase())
      );
      setAllUsers(searchResults);
      if (searchResults.length === 0) {
        setFoundStatus(true);
      } else {
        setFoundStatus(false);
      }
    }
  };

  const handleSearchInput = (event) => {
    setInput(`${event}`);
    if (event.length < 1) {
      setOptionStatus(false);
      setFoundStatus(false);
      setAllUsers(allUsersBackup);
    }
  };

  const handleGoBack = () => {
    setAllUsers(allUsersBackup);
    setFoundStatus(false);
  };

  const handleFilterOptions = () => {
    setSortingModalOpen(!sortingModalOpen);
  };

  const pageCount = Math.ceil(allUsers.length / elementsPerPage);

  return (
    <Box>
      <Center>
        <Input
          type="text"
          width="lg"
          onChange={(e) => handleSearchInput(e.target.value)}
        ></Input>
        <Button
          m={3}
          type="button"
          bgColor={useColorModeValue("purple.400", "teal")}
          color="white"
          _hover={{
            bgColor: useColorModeValue("purple.300", "teal.400"),
          }}
          onClick={searchUsers}
        >
          Search
        </Button>
      </Center>
      <Center>
        <Flex direction="row" alignItems="center" gap={2}>
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isChecked={selectedCheckbox === 0}
            onChange={() => handleCheckboxChange(0, "userName")}
          >
            Usernames
          </Checkbox>
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isChecked={selectedCheckbox === 1}
            onChange={() => handleCheckboxChange(1, "firstName")}
          >
            First Names
          </Checkbox>
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isChecked={selectedCheckbox === 2}
            onChange={() => handleCheckboxChange(2, "lastName")}
          >
            Last Names
          </Checkbox>
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isChecked={selectedCheckbox === 3}
            onChange={() => handleCheckboxChange(3, "email")}
          >
            E-mails
          </Checkbox>
          <Checkbox
            colorScheme={useColorModeValue("purple", "teal")}
            isChecked={selectedCheckbox === 4}
            onChange={() => handleCheckboxChange(4, "phone")}
          >
            Phone Number
          </Checkbox>
        </Flex>
      </Center>
      {/* {isOptionChosen &&
        showToastError(
          toast,
          "Please select a search criteria",
          <NotAllowedIcon />
        )} */}
      <Button
        backgroundColor="transparent"
        id="filterButton"
        bgSize="cover"
        marginLeft="45%"
        marginTop="20px"
        width="60px"
        height="60px"
        _hover={{ bgColor: useColorModeValue("purple.400", "teal.400") }}
        onClick={handleFilterOptions}
      >
        <Icon as={MdFilterList} w={10} h={10} _dark={{ color: "white" }} />
      </Button>
      {sortingModalOpen && (
        <SortingModal
          isOpen={sortingModalOpen}
          onClose={handleFilterOptions}
          onSortOptionSelect={(sortOption) => {
            sortUsers(sortOption, setAllUsers, allUsers);
            handleFilterOptions();
          }}
        />
      )}
      <Divider></Divider>
      <ReactPaginate
        nextLabel="Forward>"
        onPageChange={(e) => changePage(e, setCurrentPage)}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< Previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="activatedPage"
        renderOnZeroPageCount={null}
      />
      {areUsersFound && (
        <Box>
          <Button type="button" onClick={handleGoBack}>
            <ArrowBackIcon /> Go Back
          </Button>
          <Text
            textAlign="center"
            marginTop="130px"
            fontWeight="extrabold"
            fontSize="5xl"
          >
            No matches were found 😢
          </Text>
        </Box>
      )}
      <Flex
        marginTop="130px"
        display="flex"
        flexWrap="wrap"
        gap="50px"
        justifyContent="center"
      >
        {allUsers &&
          allUsers
            .slice(
              currentPage * elementsPerPage,
              (currentPage + 1) * elementsPerPage
            )
            .map((user) => {
              return (
                <Card key={user.userID}>
                  <Box _hover={{ textDecor: "underline" }} textAlign="center">
                    <NavLink
                      to={`../view-user/${user.userID}`}
                      state={user.userID}
                    >
                      {user.userName}
                    </NavLink>
                  </Box>
                  <Image src={user.avatar} width="320px" height="300px"></Image>
                  <Divider></Divider>
                  <Text textAlign="center">
                    Name: {user.firstName} {user.lastName}
                  </Text>
                  <Text textAlign="center">Email: {user.email}</Text>
                  <Divider></Divider>
                  <Text textAlign="center">Phone Number: {user.phone}</Text>
                  <Text textAlign="center">
                    Creation Date: {user.creationDate}
                  </Text>
                  <Divider></Divider>
                  {user.role.includes("admin") ? (
                    <Text color="red">Admin</Text>
                  ) : (
                    <Text>User</Text>
                  )}
                  {!blockedUsers.has(user.userID) ? (
                    <Button
                      onClick={() => handleBlock(user.userID)}
                      type="button"
                      height="30px"
                      bg="red.400"
                      color="white"
                      colorScheme="red"
                    >
                      Block
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUnblock(user.userID)}
                      type="button"
                      height="30px"
                      bg="green"
                      color="white"
                      colorScheme="green"
                    >
                      Unblock
                    </Button>
                  )}
                </Card>
              );
            })}
      </Flex>
    </Box>
  );
};

export default AdminSearchUsers;
