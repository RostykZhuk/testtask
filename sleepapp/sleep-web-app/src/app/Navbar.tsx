import { Box, Image, Heading } from "@chakra-ui/react";

export function Navbar() {
  return (
    <Box p={2} display="flex" flexDir="row">
      <Image src="/images/noom-logo.jpeg" w="110px" h="24px" p={0} mr={2} />
      <Heading size="md">Sleep Log</Heading>
    </Box>
  );
}
