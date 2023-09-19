import { useEffect, useState } from 'react'
import { getSotedUsersByFollowers } from '../../services/userServices.js'
import verifiedLogo from '../../assets/qqgbg5tk05kjmk8aulrdbtm7ia-73111b13cf069b9e84d1fe10d4a2fb19.png'
import { Card, Box, Button, Heading, Text, Avatar, CardBody, CardHeader, CardFooter,Image,Flex } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'
const NoFollowersPage = () => {
    const [userData,setUserData] = useState([])

    useEffect(() => {
      getSotedUsersByFollowers().then(setUserData)
},[])

    return (
        <Box>
            <Heading textAlign='center'>You are not following anybody for now.</Heading>
            <Text textAlign='center'>Don't worry, we got you. Here are some popular users you might like.</Text>
<Flex  gap='20px' justifyContent='center' flexWrap='wrap' mt='10%'>
            {userData.map(user => {
                return (
                    <Card width='30%'key={user.key} minWidth='300px'>
                        <CardHeader display='flex' justifyContent='center'>
                        <Heading display="inline-flex" >
                          {user.userName}
                          {user.isVerified && (
                            <Image
                              src={verifiedLogo}
                              height="25px"
                              width="30px"
                              display="flex"
                              alignSelf="center"
                              _dark={{
                                filter:
                                  "invert(14%) sepia(98%) saturate(3728%) hue-rotate(172deg) brightness(110%) contrast(122%)",
                              }}
                            ></Image>
                          )}
                        </Heading>
                        </CardHeader>
                        <CardBody display='flex' alignItems='center' flexDirection='column'>
                            <Avatar src={user.avatar} height='150px' width='150px' ></Avatar>
                            <Text fontWeight='bold'>{user.followers.length} Followers</Text>
                        </CardBody>
                        <CardFooter display='flex' justifyContent='center'>
                        <NavLink
                  key={user.userID}
                  to={`../view-user/${user.userID}`}
                  state={user.userID}
                >
                            <Button size='lg' bgColor='purple.400' _dark={{bgColor:'teal.400'}} _hover={{bgColor:'purple.600' ,_dark:{bgColor:'teal.600'}}} color='white'>Profile</Button>
                                </NavLink>
                        </CardFooter>
                </Card>
            )
            })}
                </Flex>
    </Box>
)

}
export default NoFollowersPage