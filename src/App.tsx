import React from 'react'
import logo from './logo.svg'
import { useMetashare, usePostMeta } from './hooks/metashare'
import { Helmet } from 'react-helmet'
import { Text, Box, Button, Container, SimpleGrid, useColorMode, Image, Center, Heading, Flex } from '@chakra-ui/react'

const PostCard: React.FC<{ id: string }> = ({ id }) => {
  const { loading, value } = usePostMeta(id)
  return (
    <Box transition=".3s" _hover={{ boxShadow: 'xs' }} boxShadow="dark-lg" cursor="pointer" role="group" pos="relative" bg="gray.900" p={2} borderRadius={10}>
      <Box zIndex={10} pos="relative" borderRadius={10} bgColor="gray.700" height={200} width="100%" bgImage={value?.image} bgSize="cover" bgPos="center"/>
      <Box transition=".3s" _groupHover={{ opacity: 0 }} filter="blur(20px)" opacity={0.35} zIndex={1} pos="absolute" left={0} top={0} borderRadius={10} bgColor="gray.700" height={215} width="100%" bgImage={value?.image} bgSize="cover"/>
      <Heading py={3} textAlign="center" size="xs">{value?.title}</Heading>
    </Box>
  )
}

const App = () => {
  const { posts, peerCount, postCount, sendAll } = useMetashare()

  return (
    <Box >
      <Helmet>
        <title>MetaShare • {peerCount?.toString()} Seeders</title>
      </Helmet>
      <Box py={5}>
        <Container maxW="container.lg">
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading size="lg">MetaShare</Heading>
              <Text>Seeders: {peerCount} • Posts: {postCount}</Text>
            </Box>
            <Button>Submit Link</Button>
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
