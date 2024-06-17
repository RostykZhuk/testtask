import { Link } from "react-router-dom";
import { Link as UILink, Box, Heading } from "@chakra-ui/react";

export function NotFoundPage() {
  return (
    <Box>
      <Heading size="xl">404 | Not Found</Heading>
      <br />
      <UILink as={Link} to="/">
        Back To Home
      </UILink>
    </Box>
  );
}
