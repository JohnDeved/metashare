import React from 'react'
import { useMetashare, usePostMeta } from './hooks/metashare'
import { Helmet } from 'react-helmet'
import { Text, Box, Button, Container, SimpleGrid, useColorMode, Image, Center, Heading, Flex, Stack, Input, InputGroup, InputLeftElement, Modal, ModalOverlay, useDisclosure, FormControl, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, HStack, Textarea, VStack } from '@chakra-ui/react'
import { AddIcon, PhoneIcon, QuestionIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons'

const PostCard: React.FC<{ id: string }> = ({ id }) => {
  const { loading, value } = usePostMeta(id)
  return (
    <Box transition=".3s" _hover={{ bg: 'gray.600', transform: 'scale(1.05)', boxShadow: 'dark-lg' }} boxShadow="lg" cursor="pointer" role="group" pos="relative" bg="gray.700" p={2} borderRadius={10}>
      <Box zIndex={10} pos="relative" borderRadius={10} bgColor="gray.600" height={200} width="100%" bgImage={value?.image} bgSize="cover" bgPos="center"/>
      <Box transition=".3s" filter="blur(20px)" opacity={0.35} zIndex={1} pos="absolute" left={0} top={0} borderRadius={10} bgColor="gray.700" height={215} width="100%" bgImage={value?.image} bgSize="cover"/>
      <Heading py={3} textAlign="center" size="xs">{value?.title}</Heading>
    </Box>
  )
}

const App = () => {
  const { posts, peerCount, postCount, sendAll } = useMetashare()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box >
      <Helmet>
        <title>MetaShare • {peerCount?.toString()} Seeders</title>
      </Helmet>
      <Box py={5}>
        <Container maxW="container.lg">
          <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
            <Box>
              <Heading size="lg">MetaShare</Heading>
              <Text>Seeders: {peerCount} • Posts: {postCount}</Text>
            </Box>
            <Stack direction={['column', 'row']} align="stretch" >
              <InputGroup>
                <InputLeftElement pointerEvents="none"><SearchIcon/></InputLeftElement>
                <Input variant="filled" placeholder="Search"/>
              </InputGroup>
              <Box>
                <Button><AddIcon mr={2}/> Submit</Button>
              </Box>
              <Box>
                <Button onClick={onOpen}><SettingsIcon/></Button>
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                >
                  <ModalOverlay/>
                  <ModalContent>
                    <ModalHeader>Profile Settings</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>
                            <HStack>
                              <Text>Username</Text>
                              <Popover>
                                <PopoverTrigger>
                                  <QuestionIcon cursor="pointer" boxSize={3} color="whiteAlpha.500"/>
                                </PopoverTrigger>
                                <PopoverContent bg="gray.800">
                                  <PopoverArrow bg="gray.800"/>
                                  <PopoverBody>This will be displayed as credit on submission</PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </HStack>
                          </FormLabel>
                          <Input placeholder="Anonymous"/>
                        </FormControl>
                        <FormControl>
                          <FormLabel>
                            <HStack>
                              <Text>Torrent Trackers</Text>
                              <Popover>
                                <PopoverTrigger>
                                  <QuestionIcon cursor="pointer" boxSize={3} color="whiteAlpha.500"/>
                                </PopoverTrigger>
                                <PopoverContent bg="gray.800">
                                  <PopoverArrow bg="gray.800"/>
                                  <PopoverBody>You can add more Websocket Torrent Trackers if you feel like it. (Seperate Links with newlines)</PopoverBody>
                                </PopoverContent>
                              </Popover>
                            </HStack>
                          </FormLabel>
                          <Textarea placeholder="wss://tracker.openwebtorrent.com/"/>
                        </FormControl>
                      </VStack>
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="blue" mr={3}>
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            </Stack>
          </Flex>
        </Container>
      </Box>
      <Container py={10} maxW="container.lg">
        <SimpleGrid columns={[1, 2, 3]} spacing="40px">
          {posts?.map(post => <PostCard key={post} id={post}/>)}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default App
